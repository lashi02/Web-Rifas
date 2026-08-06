from rest_framework import serializers

from apps.participants.models import Participant


class ParticipantSerializer(serializers.ModelSerializer):
    """Serializador de participantes."""

    class Meta:
        model = Participant
        fields = "__all__"

    def validate_phone(self, value):
        phone = value.strip()
        if not phone:
            return phone

        queryset = Participant.objects.filter(phone=phone)
        if self.instance is not None:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise serializers.ValidationError("Ya existe un participante con ese teléfono.")

        return phone
