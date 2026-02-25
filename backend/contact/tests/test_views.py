from django.urls import reverse
from django.test import TestCase, override_settings
from rest_framework import status
from rest_framework.test import APIClient

from ..models import ContactSubmission


class ContactViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        # we declare the URL name in the app's urls so we can reverse it
        self.url = reverse("contact_submit")
        # ensure the reverse doesn't contain a duplicated api/ prefix;
        # a misconfigured urls.py used to generate "/api/api/contact/".
        assert self.url == "/api/contact/", f"unexpected URL {self.url}"

    def test_post_valid_data_creates_submission_and_sends_email(self):
        data = {
            "nom": "Test User",
            "email": "test@example.com",
            "sujet": "Besoin d'information",
            "message": "Bonjour, je souhaiterais en savoir plus.",
        }
        # use locmem email backend to capture sent messages
        with override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend"):
            response = self.client.post(self.url, data, format="json")
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            self.assertTrue(response.data.get("success"))
            # DB entry created
            self.assertEqual(ContactSubmission.objects.count(), 1)
            submission = ContactSubmission.objects.first()
            self.assertEqual(submission.nom, data["nom"])
            # email should have been sent
            from django.core import mail

            self.assertEqual(len(mail.outbox), 1)
            self.assertIn(data["sujet"], mail.outbox[0].subject)

    def test_session_cookie_without_csrf_still_works(self):
        """Simulate browser sending sessionid but no CSRF token.

        Without @authentication_classes([]) the default SessionAuthentication
        would perform a CSRF check and return a 403 with 'CSRF token missing'.
        """
        data = {
            "nom": "Cookie User",
            "email": "cookie@example.com",
            "sujet": "Cookie test",
            "message": "Le client envoie un cookie de session mais pas le csrf.",
        }
        self.client.cookies["sessionid"] = "fake-session"
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data.get("success"))

    def test_post_invalid_data_returns_errors(self):
        bad = {"nom": "A", "email": "not-an-email", "sujet": "Hi", "message": "short"}
        response = self.client.post(self.url, bad, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data.get("success"))
        # some fields should be in errors
        errors = response.data.get("errors", {})
        self.assertIn("nom", errors)
        self.assertIn("email", errors)

    def test_internal_error_returns_500(self):
        # simulate DB error by monkeypatching model
        original_create = ContactSubmission.objects.create

        def explode(**kwargs):
            raise RuntimeError("boom")

        ContactSubmission.objects.create = explode
        data = {
            "nom": "Test Error",
            "email": "err@example.com",
            "sujet": "Erreur",
            "message": "Ce message va provoquer une erreur interne.",
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertFalse(response.data.get("success"))
        # restore
        ContactSubmission.objects.create = original_create
