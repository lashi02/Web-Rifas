
import json

from rest_framework import serializers

from backend.apps import Reservation


class ReservationSerializer(serializers.ModelSerializer):
    """Serializador de reservaciones, cliente."""
    class Meta:
        model = Reservation
        fields = ["__all__"]

    def create(self, validated_data):
        numbers = validated_data.pop("numbers", [])
        validated_data["numbers"] = json.dumps(numbers)  # [1,2] -> "[1,2]"
        return super().create(validated_data)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["numbers"] = json.loads(data["numbers"] or "[]")  # "[1,2]" -> [1,2]
        return data