from django.db import models


class Status(models.TextChoices):
    """Estados reutilizables para entidades con ciclo de vida simple."""
    ACTIVE = "Activa"
    FINISHED = "Finalizada"
    CANCELLED = "Cancelada"

class PaymentStatus(models.TextChoices):
    """Estados de pago."""
    PENDING = "Pendiente"
    COMPLETED = "Confirmado"
    EXPIRED = "Vencido"

class Country(models.TextChoices):
    CU = "CU", "Cuba"
    US = "US", "EE.UU."