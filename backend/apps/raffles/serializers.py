"""Serializers de la API."""

from django.utils import timezone
from rest_framework import serializers

from apps.raffles.models import Raffle
from apps.raffles.services import verify_featured

class RaffleSerializer(serializers.ModelSerializer):
    """Rifa con los contadores calculados desde las reservas."""

    sold_tickets = serializers.IntegerField(read_only=True, source="sold_count")
    reserved_tickets = serializers.ListField(
        child=serializers.IntegerField(), read_only=True, source="reserved_numbers"
    )
    free_tickets = serializers.ListField(
        child=serializers.IntegerField(), read_only=True, source="free_numbers"
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
        ]
    def create(self, validated_data):
    # lógica de negocio para crear una rifa
        # crear numeros de la lista segun el total
        validated_data["free_tickets"] = list(range(1, int(validated_data["total_tickets"]) + 1))
        # valida que la fecha fin del sorteo no sea menor que la actual
        if validated_data.get("draw_date") < timezone.now():
            serializers.ValidationError("La fecha de sorteo menor que la fecha actual.")
        # valida que solo exista una rifa destacada
        if validated_data.get("featured"):
            is_featured = verify_featured(validated_data.get("featured"))
            if is_featured:
                serializers.ValidationError("Ya existe una destacada")
        return super().create(validated_data)

    def to_representation(self, instance):
        """Convierte el objeto a un diccionario para la respuesta JSON."""
        data = super().to_representation(instance)
        # Convierte los campos Decimal a float para evitar problemas de serialización.
        data["ticket_price"] = float(data["ticket_price"])
        return data
