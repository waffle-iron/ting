from chat.tests.common import *

from chat.models import TingUser

def create_user(username, password, email, birthday, gender):
    """
    Creates a user with the given username, password,
    email, birthday and gender.
    """
    return TingUser.objects.create(
        username=username,
        password=password,
        email=email,
        birthday=timestamp_to_datetime(birthday),
        gender=gender
    )
