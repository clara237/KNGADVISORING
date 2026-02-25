"""
URL configuration for KNG Advising project.
"""

from django.conf import settings
from django.contrib import admin
from django.http import FileResponse, JsonResponse
from django.urls import include, path
from django.views.static import serve


def serve_frontend(request, path=""):
    """
    Sert le frontend SPA (index.html) pour les déploiements same-origin.
    """
    frontend_dist = getattr(settings, "FRONTEND_DIST", None)
    if not frontend_dist:
        return JsonResponse({"status": "ok", "api_base": "/api/"})
    index_path = frontend_dist / "index.html"
    if not index_path.exists():
        return JsonResponse({"status": "ok", "api_base": "/api/"})
    return FileResponse(open(index_path, "rb"), content_type="text/html")


def api_root(request):
    """Fallback si le frontend n’est pas encore construit."""
    return JsonResponse({"status": "ok", "api_base": "/api/"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("contact.urls")),  # → /api/contact/ maintenant
]

# Serve static frontend assets si le dossier dist existe
frontend_dist = getattr(settings, "FRONTEND_DIST", None)
if frontend_dist and frontend_dist.exists() and (frontend_dist / "index.html").exists():
    urlpatterns += [
        path("assets/<path:path>", serve, {"document_root": frontend_dist / "assets"}),
        path("", serve_frontend),
        path("<path:path>", serve_frontend),
    ]
else:
    urlpatterns += [
        path("", api_root),
    ]