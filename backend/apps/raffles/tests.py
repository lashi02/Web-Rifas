"""Tests de la API de rifas (pytest + pytest-django)."""

import pytest
from django.test import Client
from rest_framework import status

from apps.core.models import User
from apps.raffles.models import Raffle, Reservation


@pytest.fixture
def raffle(db):
    return Raffle.objects.create(
        title="Test Raffle",
        description="Rifa de prueba",
        ticket_price="50.00",
        total_tickets=100,
        status=Raffle.Status.ACTIVE,
        draw_date="2026-12-31T12:00:00-05:00",
    )


@pytest.fixture
def admin_user(db):
    return User.objects.create_superuser(
        username="admin", email="admin@example.com", password="admin123"
    )


@pytest.fixture
def client():
    return Client(HTTP_ACCEPT="application/json")


@pytest.mark.django_db
def test_health(client):
    resp = client.get("/api/health/")
    assert resp.status_code == status.HTTP_200_OK
    assert resp.json()["status"] == "ok"


@pytest.mark.django_db
def test_raffle_list_has_counters(client, raffle):
    Reservation.objects.create(
        raffle=raffle,
        ticket_numbers=[1, 2, 3],
        buyer_name="Buyer",
        buyer_phone="+53 5555 0000",
        payment_status=Reservation.PaymentStatus.COMPLETED,
        amount="150.00",
    )
    resp = client.get("/api/raffles/")
    assert resp.status_code == status.HTTP_200_OK
    payload = resp.json()["results"][0]
    assert payload["sold_tickets"] == 3
    assert payload["reserved_tickets"] == []
    assert 1 not in payload["free_tickets"]
    assert 4 in payload["free_tickets"]


@pytest.mark.django_db
def test_raffle_numbers_grid(client, raffle):
    Reservation.objects.create(
        raffle=raffle,
        ticket_numbers=[5],
        buyer_name="Buyer",
        buyer_phone="+53 5555 0000",
        payment_status=Reservation.PaymentStatus.COMPLETED,
        amount="50.00",
    )
    resp = client.get(f"/api/raffles/{raffle.pk}/numbers/")
    assert resp.status_code == status.HTTP_200_OK
    numbers = resp.json()["numbers"]
    assert len(numbers) == 100
    by_number = {n["number"]: n for n in numbers}
    assert by_number[5]["status"] == "paid"
    assert by_number[1]["status"] == "available"


@pytest.mark.django_db
def test_reservation_creation(client, raffle):
    resp = client.post(
        "/api/reservations/",
        data={
            "raffle_id": raffle.pk,
            "ticket_numbers": [10, 11],
            "buyer_name": "Ana",
            "buyer_phone": "+53 5555 1111",
            "buyer_country": "CU",
            "payment_method": "zelle",
        },
        content_type="application/json",
    )
    assert resp.status_code == status.HTTP_201_CREATED
    payload = resp.json()
    assert payload["payment_status"] == "pending"
    assert payload["amount"] == "100.00"
    assert payload["expires_at"] is not None


@pytest.mark.django_db
def test_reservation_rejects_taken_number(client, raffle):
    Reservation.objects.create(
        raffle=raffle,
        ticket_numbers=[10],
        buyer_name="Other",
        buyer_phone="+53 5555 2222",
        payment_status=Reservation.PaymentStatus.COMPLETED,
        amount="50.00",
    )
    resp = client.post(
        "/api/reservations/",
        data={
            "raffle_id": raffle.pk,
            "ticket_numbers": [10],
            "buyer_name": "Ana",
            "buyer_phone": "+53 5555 1111",
        },
        content_type="application/json",
    )
    assert resp.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_reservation_list_requires_admin(client, raffle, admin_user):
    resp = client.get("/api/reservations/")
    assert resp.status_code == status.HTTP_401_UNAUTHORIZED

    token_resp = client.post(
        "/api/auth/token/",
        data={"username": "admin", "password": "admin123"},
        content_type="application/json",
    )
    assert token_resp.status_code == status.HTTP_200_OK
    admin_client = Client(
        HTTP_ACCEPT="application/json",
        HTTP_AUTHORIZATION=f"Bearer {token_resp.json()['access']}",
    )
    resp = admin_client.get("/api/reservations/")
    assert resp.status_code == status.HTTP_200_OK
