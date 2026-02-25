from django.conf import settings
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.db import transaction

from .serializers import ContactFormSerializer
from .models import ContactSubmission

def _send_contact_notification(data: dict) -> None:
    subject = f"[KNG Advising] Nouveau message: {data['sujet']}"
    body = f"""
Nouveau message depuis le formulaire de contact KNG Advising.

De : {data['nom']} <{data['email']}>
Sujet : {data['sujet']}

Message :
{data['message']}

---
Cet email a été envoyé automatiquement par le site KNG Advising.
""".strip()

    send_mail(
        subject=subject,
        message=body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[settings.ADMIN_EMAIL],
        fail_silently=False,
    )

@api_view(["POST"])
@permission_classes([AllowAny])
@authentication_classes([])  # désactive SessionAuthentication → pas de CSRF
def contact_submit(request):
    serializer = ContactFormSerializer(data=request.data)

    if not serializer.is_valid():
        return Response({"success": False, "errors": serializer.errors},
                        status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data

    try:
        with transaction.atomic():
            ContactSubmission.objects.create(**data)
            _send_contact_notification(data)
    except Exception as e:
        return Response(
            {"success": False, "message": "Une erreur interne est survenue.",
             "detail": str(e) if settings.DEBUG else None},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return Response({"success": True, "message": "Votre message a bien été envoyé."},
                    status=status.HTTP_201_CREATED)