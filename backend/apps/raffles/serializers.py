"""Serializers de la API.

Los campos de salida siguen las interfaces de `frontend/src/types/index.ts`
(Raffle, Winner, SocialAid, Ticket/NumberState) para que el frontend consuma la
API sin cambios grandes.
"""

from datetime import timedelta

from django.utils import timezone
from rest_framework import serializers

from apps.raffles.models import Raffle, Reservation, SocialAid, Winner


class RaffleSerializer(serializers.ModelSerializer):
    """Rifa con los contadores calculados desde las reservas."""

    sold_tickets = serializers.IntegerField(read_only=True, source="sold_count")
    reserved_tickets = serializers.ListField(
        child=serializers.IntegerField(), read_only=True, source="reserved_numbers"
    )
    free_tickets = serializers.ListField(
        child=serializers.IntegerField(), read_only=True, source="free_numbers"
    )
    winner_id = serializers.SerializerMethodField()

    class Meta:
        model = Raffle
        fields = [
            "id",
            "title",
            "description",
            "image_url",
            "images",
            "ticket_price",
            "total_tickets",
            "sold_tickets",
            "reserved_tickets",
            "free_tickets",
            "status",
            "draw_date",
            "created_at",
            "rules",
            "featured",
            "social_aid_percentage",
            "payment_methods",
            "winner_id",
            "winner_ticket_number",
        ]

    def get_winner_id(self, obj: Raffle) -> str | None:
        return str(obj.winner_id) if obj.winner_id else None


class NumberStateSerializer(serializers.Serializer):
    """Estado de un número individual de la grilla."""

    number = serializers.IntegerField()
    status = serializers.ChoiceField(choices=["available", "reserved", "paid", "winner"])
    holder_name = serializers.CharField(required=False, allow_blank=True)
    holder_phone = serializers.CharField(required=False, allow_blank=True)
    reserved_at = serializers.DateTimeField(required=False)
    paid_at = serializers.DateTimeField(required=False)


class ReservationSerializer(serializers.ModelSerializer):
    """Reserva tal cual está en BD (un registro puede tener varios números)."""

    raffle_id = serializers.PrimaryKeyRelatedField(
        source="raffle", read_only=True
    )
    payment_status = serializers.SerializerMethodField()

    class Meta:
        model = Reservation
        fields = [
            "id",
            "raffle_id",
            "ticket_numbers",
            "buyer_name",
            "buyer_phone",
            "buyer_country",
            "buyer_province",
            "beneficiary_name",
            "payment_status",
            "payment_method",
            "amount",
            "created_at",
            "expires_at",
            "confirmed_at",
            "admin_notes",
        ]

    def get_payment_status(self, obj: Reservation) -> str:
        return "expired" if obj.is_expired() else obj.payment_status


class ReservationCreateSerializer(serializers.ModelSerializer):
    """Creación pública de una reserva (pago offline).

    Valida que los números existan y estén libres, calcula el monto y fija la
    fecha de vencimiento según las reglas de la rifa.
    """

    raffle_id = serializers.PrimaryKeyRelatedField(
        source="raffle", queryset=Raffle.objects.all()
    )
    ticket_numbers = serializers.ListField(
        child=serializers.IntegerField(min_value=1), allow_empty=False
    )

    class Meta:
        model = Reservation
        fields = [
            "raffle_id",
            "ticket_numbers",
            "buyer_name",
            "buyer_phone",
            "buyer_country",
            "buyer_province",
            "beneficiary_name",
            "payment_method",
        ]

    def validate_ticket_numbers(self, numbers: list[int]) -> list[int]:
        if len(set(numbers)) != len(numbers):
            raise serializers.ValidationError("No se permiten números repetidos.")
        return sorted(set(numbers))

    def validate(self, attrs):
        raffle: Raffle = attrs["raffle"]
        numbers: list[int] = attrs["ticket_numbers"]

        if raffle.status != Raffle.Status.ACTIVE:
            raise serializers.ValidationError(
                "Esta rifa no está activa y no acepta reservas."
            )

        out_of_range = [n for n in numbers if n > raffle.total_tickets]
        if out_of_range:
            raise serializers.ValidationError(
                {"ticket_numbers": f"Números fuera de rango: {out_of_range}."}
            )

        taken = set(raffle.completed_numbers) | set(raffle.reserved_numbers)
        conflicts = sorted(set(numbers) & taken)
        if conflicts:
            raise serializers.ValidationError(
                {"ticket_numbers": f"Números ya reservados o vendidos: {conflicts}."}
            )
        return attrs

    def create(self, validated_data):
        raffle: Raffle = validated_data["raffle"]
        numbers = validated_data["ticket_numbers"]
        validated_data.update(
            {
                "amount": raffle.ticket_price * len(numbers),
                "payment_status": Reservation.PaymentStatus.PENDING,
                "expires_at": timezone.now()
                + timedelta(minutes=raffle.reservation_limit_minutes()),
            }
        )
        return super().create(validated_data)


class WinnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Winner
        fields = [
            "id",
            "raffle_id",
            "ticket_number",
            "winner_name",
            "winner_phone",
            "winner_province",
            "prize",
            "drawn_at",
            "delivered",
            "delivered_at",
            "delivery_photo",
            "delivery_video",
        ]

    raffle_id = serializers.PrimaryKeyRelatedField(
        source="raffle", read_only=True
    )


class SocialAidSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialAid
        fields = [
            "id",
            "title",
            "description",
            "image",
            "date",
            "amount",
            "location",
            "published",
        ]
