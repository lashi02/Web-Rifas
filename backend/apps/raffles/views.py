"""Views de la API de rifas.

Endpoints públicos (sin auth):
    GET  /api/raffles/           lista de rifas (filtros: status, featured)
    GET  /api/raffles/<id>/      detalle de rifa
    GET  /api/raffles/<id>/numbers/  grilla completa de números (NumberState[])
    POST /api/reservations/      crear una reserva (pago offline)
    GET  /api/winners/           ganadores
    GET  /api/social-aids/       ayudas sociales

Endpoints de admin (requieren JWT + is_admin):
    GET  /api/reservations/      lista de reservas
"""

from django.db import transaction
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.raffles.models import Raffle, Reservation, SocialAid, Winner
from apps.raffles.serializers import (
    NumberStateSerializer,
    RaffleSerializer,
    ReservationCreateSerializer,
    ReservationSerializer,
    SocialAidSerializer,
    WinnerSerializer,
)


class RaffleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Raffle.objects.all()
    serializer_class = RaffleSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        status = self.request.query_params.get("status")
        if status:
            queryset = queryset.filter(status=status)
        featured = self.request.query_params.get("featured")
        if featured in ("true", "1"):
            queryset = queryset.filter(featured=True)
        return queryset

    @action(detail=True, methods=["get"])
    def numbers(self, request, pk=None):
        """Grilla de números 1..total_tickets con estado y titular."""
        raffle = self.get_object()
        holder_by_number: dict[int, dict] = {}
        completed = self.get_object().active_reservations().filter(
            payment_status=Reservation.PaymentStatus.COMPLETED
        )
        pending = self.get_object().active_reservations().filter(
            payment_status=Reservation.PaymentStatus.PENDING
        )
        # Pendientes primero, luego completados: si un número aparece en ambas,
        # gana "paid" (la reserva completada se procesa después).
        for res in list(pending) + list(completed):
            for number in res.ticket_numbers or []:
                holder_by_number[number] = {
                    "holder_name": res.buyer_name,
                    "holder_phone": res.buyer_phone,
                    "status": "paid" if res.payment_status == "completed" else "reserved",
                    "reserved_at": res.created_at if res.payment_status == "pending" else None,
                    "paid_at": res.confirmed_at if res.payment_status == "completed" else None,
                }

        winner_number = raffle.winner_ticket_number
        states = []
        for number in range(1, raffle.total_tickets + 1):
            holder = holder_by_number.get(number)
            if number == winner_number:
                state = {"number": number, "status": "winner"}
            elif holder:
                state = {"number": number, **holder}
            else:
                state = {"number": number, "status": "available"}
            states.append(state)

        serializer = NumberStateSerializer(states, many=True)
        return Response({"total_tickets": raffle.total_tickets, "numbers": serializer.data})


class ReservationViewSet(viewsets.ModelViewSet):
    """Reservas: creación pública, el resto solo admin."""

    http_method_names = ["get", "post", "head", "options"]

    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_serializer_class(self):
        if self.action == "create":
            return ReservationCreateSerializer
        return ReservationSerializer

    def get_queryset(self):
        return Reservation.objects.select_related("raffle").all()

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        raffle = Raffle.objects.select_for_update().get(
            pk=serializer.validated_data["raffle"].pk
        )
        reservation = serializer.save(raffle=raffle)
        out = ReservationSerializer(reservation, context=self.get_serializer_context())
        return Response(out.data, status=201)


class WinnerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Winner.objects.all()
    serializer_class = WinnerSerializer
    permission_classes = [permissions.AllowAny]


class SocialAidViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SocialAid.objects.filter(published=True)
    serializer_class = SocialAidSerializer
    permission_classes = [permissions.AllowAny]
