from rest_framework import serializers

from apps.reservation.models import Reservation


class ReservationSerializer(serializers.ModelSerializer):
    """Serializador de reservaciones."""

    class Meta:
        model = Reservation
        fields = "__all__"

    def validate(self, attrs):
        raffle = attrs.get("raffle_fk")
        numbers = attrs.get("numbers", [])
        if raffle and numbers:
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
