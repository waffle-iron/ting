import json

from django.shortcuts import get_object_or_404
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseForbidden, HttpResponseNotFound, QueryDict
from django.views.generic import View
from .utils import datetime_to_timestamp
from .models import Channel, Message, TingUser, City
from .forms import MessageCreationForm, MessagePatchForm, SessionForm
from django.conf import settings
from django.contrib.auth import authenticate, login
from django import forms


def privileged(f):
    """
    Do a password check for privileged operations
    """
    def check(self, request, *args, **kwargs):
        if settings.PASS != request.META.get('HTTP_AUTHORIZATION'):
            return HttpResponse('Unauthorized', status=401)
        return f(self, request, *args, **kwargs)
    return check


class MessageView(View):
    @privileged
    def post(self, request, type, target, *args, **kwargs):
        # currently `type` is always 'channel'
        channel = get_object_or_404(Channel, name=target)

        form = MessageCreationForm(request.POST)

        if not form.is_valid():
            return HttpResponseBadRequest(str(form.errors))

        form.channel = channel
        message = form.save()

        return HttpResponse(message.id)

    @privileged
    def patch(self, request, id, *args, **kwargs):
        qdict = QueryDict(request.body)

        message = Message.objects.get(pk=id)

        form = MessagePatchForm(qdict)

        if not form.is_valid() or not message.typing:
            return HttpResponseBadRequest(str(form.errors))

        form.save(message)

        return HttpResponse(status=204)

    def get(self, request, type, target, *args, **kwargs):
        lim = request.GET.get('lim', 100)

        # currently `type` is always 'channel'
        channel = get_object_or_404(Channel, name=target)

        messages = Message.objects.values(
            'message_content', 'username', 'datetime_start', 'typing', 'id',
            'datetime_sent', 'message_type'
        ).filter(channel=channel).order_by('-id')[:lim]

        # convert datetime_start to UTC epoch milliseconds
        for message in messages:
            message['datetime_start'] = datetime_to_timestamp(message['datetime_start'])
            if message['datetime_sent']:
                message['datetime_sent'] = datetime_to_timestamp(message['datetime_sent'])

        messages_json = json.dumps(list(messages))

        return HttpResponse(messages_json, content_type='application/json')

    @privileged
    def delete(self, request, id, *args, **kwargs):
        message = get_object_or_404(Message, pk=id)

        message.delete()
        return HttpResponse(status=204)


class ChannelView(View):
    def post(self, request, *args, **kwargs):
        channel = Channel(name=request.POST['name'])
        channel.save()

        return HttpResponse(status=204)

    def get(self, request, *args, **kwargs):
        queryset = Channel.objects.values('name')
        channel = get_object_or_404(queryset, name=request.GET['name'])

        return HttpResponse(
            json.dumps(channel),
            content_type='application/json'
        )

class CityView(View):
    def get(self, request, *args, **kwargs):
        cities = City.objects.values('name').order_by('name')
        cities_json = json.dumps(list(cities))

        return HttpResponse(cities_json, content_type='application/json')

class SessionView(View):
    def post(self, request, *args, **kwargs):
        session_form = SessionForm(data=request.POST)
        if not session_form.is_valid():
            error = session_form.errors["__all__"].as_data()[0]
            if error.code in [
                'invalid_login', 'password_required', 'wrong_password'
            ]:
                return HttpResponseForbidden()
            if error.code is 'password_set':
                return HttpResponseNotFound()
            if error.code is 'invalid_username':
                return HttpResponseBadRequest()

        user = session_form.get_user()
        if user is not None:
            login(request, user)
            request.session['ting_auth'] = user.id

        return HttpResponse(status=200)


    def delete(self, request, *args, **kwargs):
        logout(request)
