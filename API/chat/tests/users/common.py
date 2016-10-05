from chat.tests.common import *

from django.contrib.auth.models import User
from chat.models import TingUser

def create_user(username, password, email='default@default.com', birthday=11 ** 10, gender=3, reserved=False):
    """
    Creates a user with the given username, password,
    email, birthday and gender.
    """
    user = User.objects.create_user(
        username=username,
        password=password,
        email=email
    )
    user.tinguser.birthday = timestamp_to_datetime(birthday)
    user.tinguser.gender = gender
    user.tinguser.reserved = reserved
    user.save()
    return user
