"""Configuración para desarrollo local."""

from .base import *  # noqa: F403
from .base import env

DEBUG = True
ALLOWED_HOSTS = ["*"]

# CORS abierto en desarrollo (frontend Astro en localhost:4321).
CORS_ALLOWED_ORIGINS = env.list(
    "CORS_ALLOWED_ORIGINS",
    default=[
        "http://localhost:4321",
        "http://127.0.0.1:4321",
    ],
)

# Endpoints y documentación de DRF visibles en desarrollo.
REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"] = (  # noqa: F405
    "rest_framework.renderers.BrowsableAPIRenderer",
    "rest_framework.renderers.JSONRenderer",
)
