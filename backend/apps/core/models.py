"""Modelos de la app core."""

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Usuario del panel administrativo con rol."""

    class Roles(models.TextChoices):
        ADMIN = "admin", "Administrador"
        OPERATOR = "operator", "Operador"
        EDITOR = "editor", "Editor"

    role = models.CharField(
        max_length=20,
        choices=Roles.choices,
        default=Roles.OPERATOR,
    )

    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"

    def __str__(self) -> str:
        return self.username


class AuditLog(models.Model):
    """Registro de acciones administrativas (aprobaciones, cancelaciones…)."""

    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="audit_logs",
    )
    action = models.CharField(max_length=200)
    details = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]
        verbose_name = "Registro de auditoría"
        verbose_name_plural = "Registros de auditoría"

    def __str__(self) -> str:
        return f"{self.action} ({self.timestamp:%Y-%m-%d %H:%M})"
