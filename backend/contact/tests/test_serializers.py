from django.test import SimpleTestCase

from ..serializers import ContactFormSerializer


class ContactFormSerializerTests(SimpleTestCase):
    def test_valid_data(self):
        data = {
            "nom": "Marie Dupont",
            "email": "marie@example.com",
            "sujet": "Question",
            "message": "Bonjour, j'ai une question...",
        }
        serializer = ContactFormSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_trim_fields(self):
        data = {
            "nom": "  Paul  ",
            "email": "  paul@example.com  ",
            "sujet": "  Sujet  ",
            "message": "   Contenu du message valide.   ",
        }
        serializer = ContactFormSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data["nom"], "Paul")
        self.assertEqual(serializer.validated_data["email"], "paul@example.com")
        self.assertEqual(serializer.validated_data["sujet"], "Sujet")
        self.assertEqual(
            serializer.validated_data["message"], "Contenu du message valide."
        )

    def test_invalid_name_characters(self):
        data = {
            "nom": "John@Doe",
            "email": "john@example.com",
            "sujet": "Hi",
            "message": "Ceci est un message assez long.",
        }
        serializer = ContactFormSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("nom", serializer.errors)

    def test_invalid_message_too_short(self):
        data = {
            "nom": "Alice",
            "email": "alice@example.com",
            "sujet": "Sujet",
            "message": "short",
        }
        serializer = ContactFormSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("message", serializer.errors)
