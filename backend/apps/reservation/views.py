from rest_framework import permissions, viewsets

from apps.reservation.models import Reservation
from apps.reservation.serializers import (
    ReservationAdminUpdateSerializer,
    ReservationSerializer,
)


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

    def get_serializer_class(self):
        if self.action in ("update", "partial_update"):
            return ReservationAdminUpdateSerializer
        return ReservationSerializer

    def update(self, request, *args, **kwargs):
        # Permite PUT parcial (ej: solo {"status": ...} o solo {"numbers": [...]}).
        kwargs["partial"] = True
        return super().update(request, *args, **kwargs)
