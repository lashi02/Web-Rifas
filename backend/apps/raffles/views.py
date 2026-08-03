"""Views de la API de rifas."""
from rest_framework import permissions, viewsets

from apps.raffles.models import Raffle
from apps.raffles.serializers import RaffleSerializer

# vista del cliente
class RaffleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Raffle.objects.filter(status="active")
    serializer_class = RaffleSerializer
    permission_classes = [permissions.AllowAny]

#vista del admin
class RaffleAdminViewSet(viewsets.ModelViewSet):
    queryset = Raffle.objects.all()
    serializer_class = RaffleSerializer
    permission_classes = [permissions.IsAuthenticated]