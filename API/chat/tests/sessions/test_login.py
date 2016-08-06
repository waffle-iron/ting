from chat.models import TingUser

class SessionTests(TestCase):
    def create_user(username, password, gender="None", birthday=None):
        return TingUser.objects.create(
            username=username,
            password=password,
            gender=gender,
            birthday=birthday
        )

    def test_login_with_invalid_username(self):
        post_dict = {'username': '', 'password': 'bigfatsecret'}
        response = self.client.post(
            reverse('chat:sessions'),
            post_dict
        )
        self.assertEqual(response.status_code, 404)

    def test_login_with_reserved_username_and_no_password(self):
        username = 'alex'
        self.create_user(username=username, password='something')
        post_dict = {'username': username, 'password': ''}
        response = self.client.post(
            reverse('chat:sessions'),
            post_dict
        )
        self.assertEqual(response.status_code, 400)


    def test_login_with_reserved_username_and_wrong_password(self):
        username = 'alex'
        self.create_user(username=username, password='something')
        post_dict = {'username': username, 'password': 'wrongpass'}
        response = self.client.post(
            reverse('chat:sessions'),
            post_dict
        )
        self.assertEqual(response.status_code, 403)

    def test_login_with_reserved_username_and_correct_password(self):
        username = 'alex'
        password = 'correctpass'
        self.create_user(username=username, password=password)
        post_dict = {'username': username, 'password': password}
        response = self.client.post(
            reverse('chat:sessions'),
            post_dict
        )
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(self.client.session.get('ting_auth'))

    def test_login_with_not_reserved_username_and_password(self):
        post_dict = {'username': 'alex', 'password': 'bigfatsecret'}
        response = self.client.post(
            reverse('chat:sessions'),
            post_dict
        )
        self.assertEqual(response.status_code, 404)

    def test_login_wih_not_reserved_username_and_no_password(self):
        post_dict = {'username': 'alex', 'password': ''}
        response = self.client.post(
            reverse('chat:sessions'),
            post_dict
        )
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(self.client.session.get('ting_auth'))

