from chat.tests.users.common import *

class UserModelTests(ChatTests):
    def test_user_create(self):
        """
        A user must be saved correctly in the database.
        """
        user = create_user(
            username='alex',
            password='bigfatsecret',
            email='me@you.com',
            birthday=11 ** 10,
            gender=1,
            reserved=True
        )

        users = User.objects.all().select_related('tinguser').filter(pk=user.id)
        self.assertTrue(users.exists())
        self.assertEqual(users.count(), 1)

        dbmessage = users[0]
        self.assertEqual(dbmessage.username, user.username)
        self.assertEqual(dbmessage.password, user.password)
        self.assertEqual(dbmessage.email, user.email)
        self.assertEqual(dbmessage.tinguser.birthday, user.tinguser.birthday)
        self.assertEqual(dbmessage.tinguser.gender, user.tinguser.gender)
        self.assertEqual(dbmessage.tinguser.reserved, user.tinguser.reserved)

