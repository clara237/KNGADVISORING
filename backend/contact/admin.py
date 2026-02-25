from django.contrib import admin
from .models import ContactSubmission


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ("nom", "email", "sujet", "created_at")
    list_filter = ("created_at",)
    search_fields = ("nom", "email", "sujet", "message")
    readonly_fields = ("nom", "email", "sujet", "message", "created_at")
