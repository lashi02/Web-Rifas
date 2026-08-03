from django.db import models

from backend.apps.enums.status import PaymentStatus

# Create your models here.

class Reservation(models.Model):
    raffle_fk = models.ForeignKey("raffles", on_delete=models.SET_NULL,
                                                null=False,
                                                blank=True,
                                                related_name="raffle_fk",)
    
    participants_fk = models.ForeignKey("participants", on_delete=models.SET_NULL,
                                                null=False,
                                                blank=True,
                                                related_name="raffle_fk",)
    numbers = models.JSONField(default=list, blank=True)
    status = models.CharField(choices=PaymentStatus.choices,
                              default=PaymentStatus.PENDING,
                              db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Reservacion"
        verbose_name_plural = "Reservaciones"