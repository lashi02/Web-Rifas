from apps.raffles.models import Raffle


def verify_featured(instancia):
    featured = Raffle.objects.filter(featured=True).exclude(id=instancia.id)
    if featured:
        return False
    return True