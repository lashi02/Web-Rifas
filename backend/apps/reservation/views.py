from django.db import transaction
from rest_framework import permissions, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from apps.raffles.models import Raffle
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

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Bloquea la fila de la rifa: dos peticiones simultáneas no pueden
        # reservar el mismo número (en Postgres; en SQLite local no hay locks).
        raffle = Raffle.objects.select_for_update().get(
            pk=serializer.validated_data["raffle_fk"].pk
        )
        numbers = serializer.validated_data["numbers"]
        conflicts = sorted(set(numbers) & set(raffle.taken_numbers))
        if conflicts:
            raise ValidationError(
                {"ticket_numbers": f"Números ya reservados: {conflicts}."}
            )

        reservation = serializer.save()
        out = ReservationSerializer(
            reservation, context=self.get_serializer_context()
        )
        return Response(out.data, status=201)


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
