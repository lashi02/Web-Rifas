"""Rutas de la API de rifas."""

from rest_framework.routers import DefaultRouter

from apps.raffles.views import (
    RaffleAdminViewSet,
    RaffleViewSet
)

router = DefaultRouter()
router.register("raffles", RaffleViewSet, basename="raffle")
router.register("raffles-admin", RaffleAdminViewSet, basename="raffles-admin")

urlpatterns = router.urls
