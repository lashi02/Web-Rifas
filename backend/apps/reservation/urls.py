from rest_framework.routers import DefaultRouter

from apps.reservation.views import (
    ReservationAdminViewSet,
    ReservationViewSet,
)

router = DefaultRouter()
router.register("reservations", ReservationViewSet, basename="reservation")
router.register("reservations-admin", ReservationAdminViewSet, basename="reservations-admin")

urlpatterns = router.urls
