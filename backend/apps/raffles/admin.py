from django.contrib import admin

from .models import Raffle


@admin.register(Raffle)
class RaffleAdmin(admin.ModelAdmin):
    list_display = ("title", "status", "winnner", "ticket_price", "total_tickets", "draw_date")
    list_filter = ("status", "featured")
    search_fields = ("title", "description")