
# Create your views here.

from backend.apps.reservation.models import Reservation
from backend.apps.reservation.serializers import ReservationSerializer
from rest_framework import permissions, viewsets

class ReservationViewSet(viewsets.ModelViewSet):
    """api_view cliente"""
    queryset = Reservation.objects.filter(status="active")
    serializer_class = ReservationSerializer
    permission_classes = [permissions.AllowAny]
    http_method_names = ["get", "post"]

class ReservationAdminViewSet(viewsets.ModelViewSet):
    """api_view Admin"""
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]