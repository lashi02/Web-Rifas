from datetime import timedelta

from django.db import transaction
from django.utils import timezone
from rest_framework import serializers

from apps.participants.models import Participant
from apps.enums.status import Status, PaymentStatus
from apps.raffles.models import Raffle
from apps.reservation.models import Reservation


class ReservationSerializer(serializers.ModelSerializer):
    """Serializador de reservaciones."""

    raffle_id = serializers.PrimaryKeyRelatedField(
        source="raffle_fk",
        queryset=Raffle.objects.all(),
        write_only=True,
    )
    ticket_numbers = serializers.ListField(
        child=serializers.IntegerField(min_value=1),
        source="numbers",
        write_only=True,
    )
    buyer_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    buyer_phone = serializers.CharField(write_only=True, required=False, allow_blank=True)
    buyer_email = serializers.EmailField(write_only=True, required=False, allow_blank=True)
    buyer_country = serializers.CharField(write_only=True, required=False, allow_blank=True)
    participant_id = serializers.PrimaryKeyRelatedField(
        source="participants_fk",
        queryset=Participant.objects.all(),
        required=False,
        allow_null=True,
        write_only=True,
    )
    status = serializers.SerializerMethodField()

    class Meta:
        model = Reservation
        fields = [
            "id",
            "raffle_id",
            "ticket_numbers",
            "buyer_name",
            "buyer_phone",
            "buyer_email",
            "buyer_country",
            "participant_id",
            "raffle_fk",
            "participants_fk",
            "numbers",
            "status",
            "expires_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "raffle_fk",
            "participants_fk",
            "numbers",
            "expires_at",
            "created_at",
            "updated_at",
        ]

    def get_status(self, obj):
        """Estado efectivo: Vencido si la reserva pendiente expiró."""
        return obj.effective_status

    def validate(self, attrs):
        raffle = attrs.get("raffle_fk")
        numbers = attrs.get("numbers", [])
        if raffle and numbers:
            if raffle.winner_id or raffle.status != Status.ACTIVE:
                raise serializers.ValidationError(
                    {"raffle_id": "Esta rifa ya tiene ganador asignado o no está disponible para reservas."}
                )
            taken = set(raffle.reserved_numbers)
            if set(numbers) & taken:
                raise serializers.ValidationError(
                    {"numbers": "Algunos números ya están reservados."}
                )
            if any(n < 1 or n > raffle.total_tickets for n in numbers):
                raise serializers.ValidationError(
                    {"numbers": "Hay números fuera del rango de la rifa."}
                )
        return attrs

    def _get_or_create_participant(self, attrs):
        participant = attrs.pop("participants_fk", None)
        if participant is not None:
            return participant

        name = attrs.pop("buyer_name", "").strip()
        phone = attrs.pop("buyer_phone", "").strip()
        email = attrs.pop("buyer_email", "").strip()
        country = attrs.pop("buyer_country", "").strip()

        if not name:
            raise serializers.ValidationError({"buyer_name": "El nombre es obligatorio."})
        if not phone:
            raise serializers.ValidationError({"buyer_phone": "El teléfono es obligatorio."})

        participant, created = Participant.objects.get_or_create(
            phone=phone,
            defaults={
                "name": name,
                "email": email,
                "country": country,
            },
        )

        if not created:
            updated = False
            if name and participant.name != name:
                participant.name = name
                updated = True
            if email and participant.email != email:
                participant.email = email
                updated = True
            if country and participant.country != country:
                participant.country = country
                updated = True
            if updated:
                participant.save(update_fields=["name", "email", "country"])

        return participant

    @transaction.atomic
    def create(self, validated_data):
        participant = self._get_or_create_participant(validated_data)
        validated_data["participants_fk"] = participant
        raffle = validated_data.get("raffle_fk")
        if raffle is not None:
            validated_data["expires_at"] = timezone.now() + timedelta(
                minutes=raffle.reservation_limit_minutes
            )
        return super().create(validated_data)


class ReservationAdminUpdateSerializer(serializers.ModelSerializer):
    """Actualización de una reserva por el admin.

    Permite confirmar el pago (status → Confirmado) y ajustar los números
    reservados (ej: dejar [3, 5] en vez de [3, 4, 5]).
    """

    numbers = serializers.ListField(
        child=serializers.IntegerField(min_value=1),
        required=False,
    )
    status = serializers.ChoiceField(
        choices=PaymentStatus.choices,
        required=False,
    )

    class Meta:
        model = Reservation
        fields = [
            "id",
            "numbers",
            "status",
            "raffle_fk",
            "participants_fk",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "raffle_fk",
            "participants_fk",
            "created_at",
            "updated_at",
        ]

    def validate_numbers(self, value):
        numbers = sorted(set(value))
        if not numbers:
            raise serializers.ValidationError(
                "La reserva debe conservar al menos un número."
            )
        if self.instance is None:
            return numbers

        raffle = self.instance.raffle_fk
        out_of_range = [n for n in numbers if n < 1 or n > raffle.total_tickets]
        if out_of_range:
            raise serializers.ValidationError(
                f"Números fuera del rango de la rifa: {out_of_range}."
            )

        taken = set()
        for res in raffle.reservations.exclude(pk=self.instance.pk):
            taken.update(res.numbers or [])
        conflicts = sorted(set(numbers) & taken)
        if conflicts:
            raise serializers.ValidationError(
                f"Números ya reservados por otra reserva: {conflicts}."
            )
        return numbers

    def update(self, instance, validated_data):
        instance.numbers = validated_data.get("numbers", instance.numbers)
        instance.status = validated_data.get("status", instance.status)
        instance.save(update_fields=["numbers", "status", "updated_at"])
        return instance