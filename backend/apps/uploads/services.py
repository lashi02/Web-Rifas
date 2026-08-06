"""Servicio de subida de imágenes.

Usa Cloudinary si hay credenciales configuradas; en desarrollo cae a storage
local (MEDIA_ROOT) para poder trabajar sin la cuenta en la nube.
"""

import uuid

from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile


def is_cloudinary_configured() -> bool:
    return bool(
        settings.CLOUDINARY_CLOUD_NAME
        and settings.CLOUDINARY_API_KEY
        and settings.CLOUDINARY_API_SECRET
    )


def _upload_cloudinary(file_obj, folder: str) -> str:
    import cloudinary.uploader

    result = cloudinary.uploader.upload(file_obj, folder=folder)
    return result["secure_url"]


def _upload_local(file_obj, folder: str) -> str:
    name = f"{uuid.uuid4().hex}_{file_obj.name}"
    path = default_storage.save(f"{folder}/{name}", ContentFile(file_obj.read()))
    return f"{settings.MEDIA_URL}{path}"


def upload_image(file_obj, folder: str = "web-rifas") -> str:
    """Sube una imagen y devuelve la URL accesible (Cloudinary o local)."""
    if is_cloudinary_configured():
        return _upload_cloudinary(file_obj, folder)
    return _upload_local(file_obj, folder)
