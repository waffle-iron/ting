from chat.tests.sessions.common import *
from chat.tests.users.common import create_user
from django.test import TestCase, Client
from chat.models import TingUser
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

class SessionTests(ChatTests):
    def test_login_with_invalid_username(self):
        post_dict = {'username': '', 'password': 'bigfatsecret'}
        response = self.client.post(
            reverse('chat:session'),
            post_dict
        )
        self.assertEqual(response.status_code, 400)

    def test_login_with_reserved_username_and_no_password(self):
        username = 'alex'
        create_user(username=username, password='something', reserved=True)
        post_dict = {'username': username, 'password': ''}
        response = self.client.post(
            reverse('chat:session'),
            post_dict
        )
        self.assertEqual(response.status_code, 403)

    def test_login_with_reserved_username_and_wrong_password(self):
        username = 'alex'
        create_user(username=username, password='something', reserved=True)
        post_dict = {'username': username, 'password': 'wrongpass'}
        response = self.client.post(
            reverse('chat:session'),
            post_dict
        )
        self.assertEqual(response.status_code, 403)

    def test_login_with_reserved_username_and_correct_password(self):
        username = 'alex'
        password = 'correctpass'
        create_user(username=username, password=password, reserved=True)
        post_dict = {'username': username, 'password': password}
        response = self.client.post(
            reverse('chat:session'),
            post_dict
        )
        user = User.objects.get(username=username)
        self.assertTrue(user.is_authenticated)
        self.assertEqual(response.status_code, 200)

    def test_login_with_not_reserved_username_and_password(self):
        post_dict = {'username': 'alex', 'password': 'bigfatsecret'}
        response = self.client.post(
            reverse('chat:session'),
            post_dict
        )
        self.assertEqual(response.status_code, 404)

    def test_login_wih_not_reserved_username_and_no_password(self):
        post_dict = {'username': 'unreserved'}
        response = self.client.post(
            reverse('chat:session'),
            post_dict
        )
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(self.client.session.get('ting_auth'))
