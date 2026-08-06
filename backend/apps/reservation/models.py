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
        max_length=20,
        choices=PaymentStatus.choices,
        default=PaymentStatus.PENDING,
        db_index=True,
    )
    expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Reservacion"
        verbose_name_plural = "Reservaciones"

    def __str__(self) -> str:
        return f"{self.participants_fk} - {len(self.numbers)} números"

    def is_expired(self) -> bool:
        """True si la reserva sigue pendiente y ya pasó su fecha de vencimiento."""
        from django.utils import timezone

        return (
            self.status == PaymentStatus.PENDING
            and self.expires_at is not None
            and timezone.now() > self.expires_at
        )

    @property
    def effective_status(self) -> str:
        """Estado real: devuelve Vencido si la reserva pendiente expiró."""
        if self.is_expired():
            return PaymentStatus.EXPIRED
        return self.status
