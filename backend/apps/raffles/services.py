from apps.raffles.models import Raffle


def verify_featured(instancia=None):
    """Devuelve True si no existe otra rifa destacada"""
    queryset = Raffle.objects.filter(featured=True)
    if instancia is not None and instancia.pk:
        queryset = queryset.exclude(pk=instancia.pk)
    return not queryset.exists()
