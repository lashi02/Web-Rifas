"""Vistas de la app core."""

from django.http import JsonResponse


def health(request):
    """Health check para verificar que la función Vercel responde."""
    return JsonResponse({"status": "ok", "service": "web-rifas-api"})
