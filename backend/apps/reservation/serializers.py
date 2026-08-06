from django.db import transaction
from rest_framework import serializers

from apps.participants.models import Participant
from apps.enums.status import Status
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
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "raffle_fk",
            "participants_fk",
            "numbers",
            "status",
            "created_at",
            "updated_at",
        ]

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
        return super().create(validated_data)