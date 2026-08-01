"""Modelos del dominio de rifas.

Diseño clave: los números disponibles / reservados / vendidos de una rifa NO se
guardan como arrays duplicados. Se calculan a partir de las reservas
(Reservation.ticket_numbers), por lo que la única fuente de verdad es la tabla
de reservas. Esto evita inconsistencias entre `sold_tickets`, `reserved_tickets`
y `free_tickets`.
"""

from decimal import Decimal

from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models


class Raffle(models.Model):
    """Una rifa o sorteo."""

    class Status(models.TextChoices):
        ACTIVE = "active", "Activa"
        FINISHED = "finished", "Finalizada"
        CANCELLED = "cancelled", "Cancelada"

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    image_url = models.URLField(blank=True)
    images = models.JSONField(default=list, blank=True)
    ticket_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.01"))],
    )
    total_tickets = models.PositiveIntegerField(default=1)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
        db_index=True,
    )
    draw_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Reglas de la rifa: draw_method, reservation_limit_minutes,
    # delivery_method y conditions[] (ver types del frontend).
    rules = models.JSONField(default=dict, blank=True)
    featured = models.BooleanField(default=False)
    social_aid_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal("0"),
    )
    # Métodos de pago: zelle / transfer / other.
    payment_methods = models.JSONField(default=list, blank=True)

    # Sorteo resuelto.
    winner = models.ForeignKey(
        "raffles.Winner",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="won_raffles",
    )
    winner_ticket_number = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Rifa"
        verbose_name_plural = "Rifas"

    def __str__(self) -> str:
        return self.title

    def reservation_limit_minutes(self) -> int:
        """Minutos de vigencia de una reserva según las reglas."""
        rules = self.rules or {}
        try:
            return int(rules.get("reservation_limit_minutes", 30))
        except (TypeError, ValueError):
            return 30

    def active_reservations(self):
        """Reservas que aún cuentan (pending o completed)."""
        return self.reservations.filter(payment_status__in=(
            Reservation.PaymentStatus.PENDING,
            Reservation.PaymentStatus.COMPLETED,
        ))

    @property
    def completed_numbers(self) -> list[int]:
        """Números con pago confirmado (vendidos), únicos y ordenados."""
        numbers: set[int] = set()
        for res in self.active_reservations().filter(
            payment_status=Reservation.PaymentStatus.COMPLETED
        ):
            numbers.update(res.ticket_numbers or [])
        return sorted(numbers)

    @property
    def reserved_numbers(self) -> list[int]:
        """Números reservados (pending) no vencidos, sin contar los vendidos."""
        sold = set(self.completed_numbers)
        numbers: set[int] = set()
        for res in self.active_reservations().filter(
            payment_status=Reservation.PaymentStatus.PENDING
        ):
            if not res.is_expired():
                numbers.update(res.ticket_numbers or [])
        return sorted(numbers - sold)

    @property
    def sold_count(self) -> int:
        return len(self.completed_numbers)

    @property
    def reserved_count(self) -> int:
        return len(self.reserved_numbers)

    @property
    def free_numbers(self) -> list[int]:
        """Números libres para comprar."""
        taken = set(self.completed_numbers) | set(self.reserved_numbers)
        all_numbers = set(range(1, self.total_tickets + 1))
        return sorted(all_numbers - taken)


class Reservation(models.Model):
    """Reserva de uno o más números por un participante."""

    class PaymentStatus(models.TextChoices):
        PENDING = "pending", "Pendiente"
        COMPLETED = "completed", "Confirmado"
        EXPIRED = "expired", "Vencido"

    class Country(models.TextChoices):
        CU = "CU", "Cuba"
        US = "US", "EE.UU."

    raffle = models.ForeignKey(
        Raffle,
        on_delete=models.CASCADE,
        related_name="reservations",
    )
    ticket_numbers = models.JSONField(default=list)
    buyer_name = models.CharField(max_length=200)
    buyer_phone = models.CharField(max_length=50)
    buyer_country = models.CharField(
        max_length=2,
        choices=Country.choices,
        default=Country.CU,
    )
    buyer_province = models.CharField(max_length=100, blank=True)
    beneficiary_name = models.CharField(max_length=200, blank=True)
    payment_status = models.CharField(
        max_length=20,
        choices=PaymentStatus.choices,
        default=PaymentStatus.PENDING,
        db_index=True,
    )
    payment_method = models.CharField(max_length=100, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0"))
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    admin_notes = models.TextField(blank=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Reserva"
        verbose_name_plural = "Reservas"

    def __str__(self) -> str:
        return f"{self.buyer_name} - {self.raffle.title}"

    def is_expired(self) -> bool:
        from django.utils import timezone

        return (
            self.payment_status == self.PaymentStatus.PENDING
            and self.expires_at is not None
            and timezone.now() > self.expires_at
        )


class Winner(models.Model):
    """Ganador de un sorteo, con evidencia de entrega."""

    raffle = models.ForeignKey(
        Raffle,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="winners",
    )
    ticket_number = models.PositiveIntegerField()
    winner_name = models.CharField(max_length=200)
    winner_phone = models.CharField(max_length=50, blank=True)
    winner_province = models.CharField(max_length=100, blank=True)
    prize = models.CharField(max_length=200, blank=True)
    drawn_at = models.DateTimeField()
    delivered = models.BooleanField(default=False)
    delivered_at = models.DateTimeField(null=True, blank=True)
    delivery_photo = models.URLField(blank=True)
    delivery_video = models.URLField(blank=True)

    class Meta:
        ordering = ["-drawn_at"]
        verbose_name = "Ganador"
        verbose_name_plural = "Ganadores"

    def __str__(self) -> str:
        return f"{self.winner_name} (#{self.ticket_number})"


class SocialAid(models.Model):
    """Ayuda social documentada."""

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    image = models.URLField(blank=True)
    date = models.DateField()
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0"))
    location = models.CharField(max_length=100, blank=True)
    published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date"]
        verbose_name = "Ayuda social"
        verbose_name_plural = "Ayudas sociales"

    def __str__(self) -> str:
        return self.title
