
# Create your views here.
from rest_framework import viewsets, permissions
from apps.participants.models import Participant
from apps.participants.serializers import ParticipantSerializer


class ParticipantViewSet(viewsets.ModelViewSet):
    """API del cliente: crear y listar participantes."""
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get", "post"]