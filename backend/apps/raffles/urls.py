"""Rutas de la API de rifas."""

from rest_framework.routers import DefaultRouter

from apps.raffles.views import (
    RaffleViewSet,
    ReservationViewSet,
    SocialAidViewSet,
    WinnerViewSet,
)

router = DefaultRouter()
router.register("raffles", RaffleViewSet, basename="raffle")
router.register("reservations", ReservationViewSet, basename="reservation")
router.register("winners", WinnerViewSet, basename="winner")
router.register("social-aids", SocialAidViewSet, basename="social-aid")

urlpatterns = router.urls
