import time

from django import forms
from django.contrib.auth import authenticate
from django.contrib.auth.forms import AuthenticationForm
from django.core.exceptions import ValidationError

from .models import Message
from django.contrib.auth.models import User
from .utils import timestamp_to_datetime, datetime_to_timestamp
from django.utils.crypto import get_random_string



class MessageForm(forms.Form):
    message_content = forms.CharField(widget=forms.Textarea)
    typing = forms.BooleanField(required=False)
    message_type = forms.CharField(widget=forms.Textarea)


class MessageCreationForm(MessageForm):
    username = forms.CharField(max_length=20)
    datetime_start = forms.IntegerField()

    def clean_datetime_start(self):
        now = int(round(time.time() * 1000))
        timestamp = int(self.data['datetime_start'])
        if now < timestamp:
            timestamp = now

        self.cleaned_data['datetime_start'] = timestamp_to_datetime(timestamp)

    def save(self):
        self.clean_datetime_start()

        message = Message.objects.create(channel=self.channel, **self.cleaned_data)

        if not message.typing:
            message.datetime_sent = message.datetime_start
            message.save()

        return message;


class MessagePatchForm(MessageForm):
    datetime_sent = forms.IntegerField()

    def save(self, message):
        timestamp_start = datetime_to_timestamp(message.datetime_start)
        timestamp_sent = int(self.cleaned_data['datetime_sent'])

        if timestamp_sent < timestamp_start:
            timestamp_sent = timestamp_start

        message.datetime_sent = timestamp_to_datetime(timestamp_sent)
        message.message_content = self.cleaned_data['message_content']
        message.typing = self.cleaned_data.get('typing', False)

        message.save()

class SessionForm(AuthenticationForm):
    username = forms.CharField(max_length=20)
    password = forms.CharField(max_length=32, widget=forms.PasswordInput, required=False)

    def is_valid(self):
        if not super(SessionForm, self).is_valid():
            return False

        if User.objects.get(username=self.data['username']).tinguser.reserved:
            # username reserved
            if not self.data['password']:
            # username reserved and no password is set
                raise ValidationError(
                    "password_required",
                    code="password_required"
                )

            user = authenticate(username=self.data['username'], password=self.data['password'])
            if user is None:
                raise ValidationError(
                    "wrong_password",
                    code="wrong_password"
                )
        elif not User.objects.get(username=self.data['username']).tinguser.reserved:
            # username not reserved
            if  self.data['password']:
                raise ValidationError(
                    "The username is not reserved, so no password should be set",
                    code="password_set"
                )
            if not User.objects.get(username=self.data['username']):
                user = User.objects.create_user(
                    username=self.data['username'],
                    password=get_random_string()
                )

        return True

