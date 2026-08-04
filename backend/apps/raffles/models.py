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
    # Métodos de pago: zelle / transfer / other.
    payment_methods = models.JSONField(default=list, blank=True)
    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Rifa"
        verbose_name_plural = "Rifas"

    def __str__(self) -> str:
        return self.title

    # === Campos calculados desde las reservas (fuente única de verdad) ===

    @property
    def reserved_numbers(self):
        """Números tomados por cualquier reserva de esta rifa."""
        numbers = set()
        for reservation in self.reservations.all():
            numbers.update(reservation.numbers)
        return sorted(numbers)

    @property
    def sold_count(self):
        """Cantidad de números vendidos (reservas confirmadas)."""
        return sum(
            len(reservation.numbers)
            for reservation in self.reservations.filter(
                status=PaymentStatus.COMPLETED
            )
        )

    @property
    def free_numbers(self):
        """Números que aún no han sido reservados."""
        reserved = set(self.reserved_numbers)
        return [n for n in range(1, self.total_tickets + 1) if n not in reserved]