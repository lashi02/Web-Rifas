from django.db import models

from apps.enums.status import PaymentStatus


class Reservation(models.Model):
    """Reserva de números de una rifa por parte de un participante."""

    raffle_fk = models.ForeignKey(
        "raffles.Raffle",
        on_delete=models.CASCADE,
        null=False,
        blank=True,
        related_name="reservations",
    )
    participants_fk = models.ForeignKey(
        "participants.Participant",
        on_delete=models.CASCADE,
        null=False,
        blank=True,
        related_name="reservations",
    )
    numbers = models.JSONField(default=list, blank=True)
    status = models.CharField(
        choices=PaymentStatus.choices,
        default=PaymentStatus.PENDING,
        db_index=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Reservacion"
        verbose_name_plural = "Reservaciones"

    def __str__(self) -> str:
        return f"{self.participants_fk} - {len(self.numbers)} números"
