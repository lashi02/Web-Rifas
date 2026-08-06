import pytest
from django.test import Client
from rest_framework import status

from apps.participants.models import Participant
from apps.raffles.models import Raffle


@pytest.fixture
def client():
	return Client(HTTP_ACCEPT="application/json")


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


@pytest.mark.django_db
def test_raffle_assigning_winner_marks_it_finished(raffle):
	participant = Participant.objects.create(
		name="Winner",
		phone="+53 5555 9999",
		email="winner@example.com",
		country="CU",
	)

	raffle.winnner = participant
	raffle.save()

	raffle.refresh_from_db()
	assert raffle.winnner == participant
	assert raffle.status == Raffle.Status.FINISHED


@pytest.mark.django_db
def test_reservation_rejects_raffle_with_winner(client, raffle):
	participant = Participant.objects.create(
		name="Winner",
		phone="+53 5555 9999",
		email="winner@example.com",
		country="CU",
	)
	raffle.winnner = participant
	raffle.save()

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

	assert resp.status_code == status.HTTP_400_BAD_REQUEST
	assert "raffle_id" in resp.json()
