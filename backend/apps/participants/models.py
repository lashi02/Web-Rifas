from django.db import models
from django.db.models import Q

from apps.enums.status import Country


class Participant(models.Model):
    """Participante que reserva o compra números de una rifa."""

    name = models.CharField(max_length=150)
    phone = models.CharField(max_length=30, blank=True)
    email = models.EmailField(blank=True)
    country = models.CharField(max_length=50,
                               choices=Country.choices,
                               blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Participante"
        verbose_name_plural = "Participantes"
        constraints = [
            models.UniqueConstraint(fields=["phone"], condition=~Q(phone=""), name="unique_participant_phone_non_empty",)
        ]

    def __str__(self) -> str:
        return self.name
