"""Configuración de producción (Vercel)."""

from .base import *  # noqa: F403
from .base import env

DEBUG = False

# En Vercel el host es <proyecto>.vercel.app o el dominio personalizado.
ALLOWED_HOSTS = env.list(
    "DJANGO_ALLOWED_HOSTS",
    default=[
        ".vercel.app",
        "api.webrifas.com",
    ],
)

# CORS cerrado: solo orígenes explícitos del frontend.
CORS_ALLOWED_ORIGINS = env.list(
    "CORS_ALLOWED_ORIGINS",
    default=["https://webrifas.com"],
)

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"] = (  # noqa: F405
    "rest_framework.renderers.JSONRenderer",
)
