from rest_framework import serializers


class UploadSerializer(serializers.Serializer):
    """Archivo de imagen a subir."""

    file = serializers.ImageField(
        help_text="Imagen (jpg, png, webp, gif)."
    )
