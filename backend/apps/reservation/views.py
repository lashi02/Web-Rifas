from rest_framework import permissions, viewsets

from apps.reservation.models import Reservation
from apps.reservation.serializers import ReservationSerializer


class ReservationViewSet(viewsets.ModelViewSet):
    """API del cliente: crear y listar reservaciones."""
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [permissions.AllowAny]
    http_method_names = ["get", "post"]


class ReservationAdminViewSet(viewsets.ModelViewSet):
    """API del admin: gestionar reservaciones."""
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]
