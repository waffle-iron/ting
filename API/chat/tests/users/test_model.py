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
            gender=1
        )

        users = TingUser.objects.filter(pk=user.id)

        self.assertTrue(users.exists())
        self.assertEqual(users.count(), 1)

        dbmessage = users[0]


        self.assertEqual(dbmessage.username, user.username)
        self.assertEqual(dbmessage.password, user.password)
        self.assertEqual(dbmessage.email, user.email)
        self.assertEqual(dbmessage.birthday, user.birthday)
        self.assertEqual(dbmessage.gender, user.gender)

