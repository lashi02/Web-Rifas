"""Modelos del dominio de rifas.

Diseño clave: los números disponibles / reservados / vendidos de una rifa NO se
guardan como arrays duplicados. Se calculan a partir de las reservas
(Reservation.ticket_numbers), por lo que la única fuente de verdad es la tabla
de reservas. Esto evita inconsistencias entre `sold_tickets`, `reserved_tickets`
y `free_tickets`.
"""

from django.db import models

from apps.enums.status import Status, PaymentStatus


class Raffle(models.Model):
    """Una rifa o sorteo."""
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    image_url = models.URLField(blank=True)
    images = models.JSONField(default=list, blank=True)
    ticket_price = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=True)
    total_tickets = models.IntegerField(default=1)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE,db_index=True)
    draw_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    featured = models.BooleanField(default=False)
    # Minutos de vigencia de una reserva pendiente antes de vencer.
    reservation_limit_minutes = models.PositiveIntegerField(default=30)
    # Métodos de pago: zelle / transfer / other.
    payment_methods = models.JSONField(default=list, blank=True)
    winner = models.ForeignKey("participants.Participant", on_delete=models.SET_NULL,
                                                            null=True,
                                                            blank=True,
    )

    def save(self, *args, **kwargs):
        if self.winner_id:
            self.status = Status.FINISHED
        super().save(*args, **kwargs)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Rifa"
        verbose_name_plural = "Rifas"

    def __str__(self) -> str:
        return self.title

    # === Campos calculados desde las reservas (fuente única de verdad) ===

    def _numbers_for_status(self, status):
        numbers = set()
        for reservation in self.reservations.filter(status=status):
            numbers.update(reservation.numbers or [])
        return sorted(numbers)

    @property
    def completed_numbers(self):
        """Números con pago confirmado (vendidos)."""
        return self._numbers_for_status(PaymentStatus.COMPLETED)

    @property
    def reserved_numbers(self):
        """Números reservados (pendientes y no vencidos).

        Las reservas pendientes vencidas liberan sus números.
        """
        numbers = set()
        for reservation in self.reservations.filter(status=PaymentStatus.PENDING):
            if not reservation.is_expired():
                numbers.update(reservation.numbers or [])
        return sorted(numbers)

    @property
    def taken_numbers(self):
        """Números no disponibles (vendidos o reservados vigentes)."""
        return sorted(set(self.completed_numbers) | set(self.reserved_numbers))

    @property
    def sold_count(self):
        """Cantidad de números vendidos (reservas confirmadas)."""
        return len(self.completed_numbers)

    @property
    def free_numbers(self):
        """Números que aún no han sido reservados."""
        taken = set(self.taken_numbers)
        return [n for n in range(1, self.total_tickets + 1) if n not in taken]