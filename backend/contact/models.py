from django.db import models


class ContactSubmission(models.Model):
    """Modèle optionnel pour stocker les soumissions de contact."""

    nom = models.CharField(max_length=200)
    email = models.EmailField()
    sujet = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
