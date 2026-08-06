"""Serializers de la API."""

from django.utils import timezone
from rest_framework import serializers

from apps.enums.status import PaymentStatus, Status
from apps.participants.models import Participant
from apps.raffles.models import Raffle
from apps.raffles.services import verify_featured
from apps.reservation.models import Reservation

ALLOWED_PAYMENT_METHODS = {"zelle", "transfer", "other"}


class RaffleSerializer(serializers.ModelSerializer):
    """Rifa con los contadores calculados desde las reservas."""

    sold_tickets = serializers.IntegerField(read_only=True, source="sold_count")
    reserved_tickets = serializers.ListField(
        child=serializers.IntegerField(), read_only=True, source="reserved_numbers"
    )
    free_tickets = serializers.ListField(
        child=serializers.IntegerField(), read_only=True, source="free_numbers"
    )
    winner = serializers.PrimaryKeyRelatedField(
        queryset=Participant.objects.all(),
        required=False,
        allow_null=True,
    )

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
            "updated_at",
            "featured",
            "payment_methods",
            "winner",
        ]

    def validate_winner(self, winner):
        """Valida la asignación de ganador sobre una rifa activa."""
        if winner is None or self.instance is None:
            return winner

        raffle = self.instance
        if raffle.status == Status.FINISHED:
            raise serializers.ValidationError(
                "No se puede modificar el ganador de una rifa finalizada."
            )
        if raffle.winner_id and raffle.winner_id != winner.pk:
            raise serializers.ValidationError(
                "Esta rifa ya tiene un ganador asignado."
            )

        completed = Reservation.objects.filter(
            raffle_fk=raffle,
            participants_fk=winner,
            status=PaymentStatus.COMPLETED,
        )
        has_valid_reservation = any(
            bool((res.numbers or []))
            and all(1 <= n <= raffle.total_tickets for n in res.numbers)
            for res in completed
        )
        if not has_valid_reservation:
            raise serializers.ValidationError(
                "El participante debe tener una reserva confirmada "
                "con números válidos en esta rifa."
            )
        return winner

    def validate_payment_methods(self, value):
        """Valida la integridad de los métodos de pago."""
        if value is None:
            return value
        if not isinstance(value, list):
            raise serializers.ValidationError("payment_methods debe ser una lista.")
        normalized = [str(m).strip().lower() for m in value]
        invalid = set(normalized) - ALLOWED_PAYMENT_METHODS
        if invalid:
            raise serializers.ValidationError(
                f"Métodos de pago no válidos: {invalid}. Válidos: zelle, transfer, other."
            )
        if len(set(normalized)) != len(normalized):
            raise serializers.ValidationError("No se permiten métodos de pago duplicados.")
        return normalized

    def create(self, validated_data):
        # Valida que la fecha fin del sorteo no sea menor que la actual.
        draw_date = validated_data.get("draw_date")
        if draw_date and draw_date < timezone.now():
            raise serializers.ValidationError(
                "La fecha de sorteo no puede ser menor que la fecha actual."
            )
        # Valida que solo exista una rifa destacada.
        if validated_data.get("featured") and not verify_featured():
            raise serializers.ValidationError("Ya existe una rifa destacada.")
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Una rifa finalizada no se puede editar (ni cambiarle el ganador).
        if instance.status == Status.FINISHED:
            raise serializers.ValidationError(
                "No se puede editar una rifa finalizada."
            )
        # Asignación de ganador: solo se actualiza ese campo, el resto se deja igual.
        winner = validated_data.pop("winner", None)
        if winner is not None:
            instance.winner = winner
        return super().update(instance, validated_data)

    def to_representation(self, instance):
        """Convierte el objeto a un diccionario para la respuesta JSON."""
        data = super().to_representation(instance)
        # Convierte los campos Decimal a float para evitar problemas de serialización.
        data["ticket_price"] = float(data["ticket_price"])
        return data
