import time

from django import forms
from django.contrib.auth import authenticate
from django.contrib.auth.forms import AuthenticationForm
from django.core.exceptions import ValidationError

from .models import Message
from django.contrib.auth.models import User
from .utils import timestamp_to_datetime, datetime_to_timestamp



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
    username = forms.CharField(max_length=20, required=False)
    password = forms.CharField(max_length=32, widget=forms.PasswordInput, required=False)

    def clean(self):
        username = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')

        if not username:
            raise forms.ValidationError(
                "invalid_username",
                code="invalid_username"
            )

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            rand_pass=User.objects.make_random_password()
            user = User.objects.create_user(
                username=self.data['username'],
                password=rand_pass
            )
            user.save()

        if not user.tinguser.reserved and password:
            # unreserved username and password set
            raise forms.ValidationError(
                "password_set",
                code="password_set"
            )

        if user and user.tinguser.reserved:
            # username reserved
            if not password:
            # username reserved and no password is set
                raise forms.ValidationError(
                    "password_required",
                    code="password_required"
                )

            user = authenticate(username=username, password=password)
            if user is None:
                raise forms.ValidationError(
                    "wrong_password",
                    code="wrong_password"
                )

        if not user.tinguser.reserved:
            user = authenticate(username=user.username, password=rand_pass)
        self.user_cache = user
        self.confirm_login_allowed(self.user_cache)
        return self.cleaned_data

