from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from apps.uploads.serializers import UploadSerializer
from apps.uploads.services import upload_image


class UploadView(APIView):
    """Sube una imagen y devuelve la URL para usarla en una rifa."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = UploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        url = upload_image(serializer.validated_data["file"])
        return Response({"url": url}, status=status.HTTP_201_CREATED)
