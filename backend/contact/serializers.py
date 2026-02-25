"""
Validation du formulaire de contact via DRF Serializer.
"""
import re
from rest_framework import serializers


class ContactFormSerializer(serializers.Serializer):
    """Valide les champs du formulaire de contact."""

    nom = serializers.CharField(
        max_length=200,
        min_length=2,
        trim_whitespace=True,
        help_text="Nom du contact",
    )
    email = serializers.EmailField(help_text="Adresse email valide")
    sujet = serializers.CharField(
        max_length=200,
        min_length=3,
        trim_whitespace=True,
        help_text="Objet du message",
    )
    message = serializers.CharField(
        min_length=10,
        max_length=5000,
        trim_whitespace=True,
        help_text="Contenu du message",
    )

    def validate_nom(self, value):
        r"""Vérifie que le nom ne contient pas de caractères indésirables.

        Le formulaire doit accepter les lettres (accentuées y compris en majuscule),
        les espaces, les tirets, les points et apostrophes. On laisse
        également `\w` pour la compatibilité unicode (il couvre déjà la plupart
        des lettres), ce qui évite de maintenir une liste explicite de
        caractères accentués. Le champ est retourné coupé des espaces inutiles.
        """
        # autorise aussi l’apostrophe typographique et supprime les espaces
        if not re.match(r"^[\w\s\-\.'’]+$", value, re.UNICODE):
            raise serializers.ValidationError("Le nom contient des caractères non autorisés.")
        return value.strip()

    def validate_message(self, value):
        """Vérifie le contenu du message."""
        value = value.strip()
        if len(value) < 10:
            raise serializers.ValidationError("Le message doit contenir au moins 10 caractères.")
        return value

    def validate(self, attrs):
        # strip les autres champs pour éviter que des espaces en début/fin
        # provoquent des erreurs de longueur côté serveur.
        attrs["email"] = attrs.get("email", "").strip()
        attrs["sujet"] = attrs.get("sujet", "").strip()
        # le message est déjà traité par validate_message
        attrs["nom"] = attrs.get("nom", "").strip()
        return attrs
