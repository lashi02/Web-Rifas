from django.contrib import admin

from .models import Raffle, Reservation, SocialAid, Winner


@admin.register(Raffle)
class RaffleAdmin(admin.ModelAdmin):
    list_display = ("title", "status", "ticket_price", "total_tickets", "draw_date")
    list_filter = ("status", "featured")
    search_fields = ("title", "description")


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ("buyer_name", "raffle", "payment_status", "amount", "expires_at")
    list_filter = ("payment_status",)
    search_fields = ("buyer_name", "buyer_phone", "buyer_province")


@admin.register(Winner)
class WinnerAdmin(admin.ModelAdmin):
    list_display = ("winner_name", "raffle", "ticket_number", "prize", "delivered")
    list_filter = ("delivered",)


@admin.register(SocialAid)
class SocialAidAdmin(admin.ModelAdmin):
    list_display = ("title", "location", "amount", "date", "published")
    list_filter = ("published",)
