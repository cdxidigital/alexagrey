"""
Backend tests for Alexa Grey booking API.

Endpoints under test:
- GET  /api/          - health
- POST /api/bookings  - create booking (persists to Mongo, tries email via Resend)
- GET  /api/bookings  - list bookings (sorted desc by created_at)
"""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL")
if not BASE_URL:
    # Fallback: read from frontend/.env directly (tests need the public URL)
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip()
                break

BASE_URL = BASE_URL.rstrip("/")


@pytest.fixture(scope="session")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Health ----------
class TestHealth:
    def test_root_status_ok(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/")
        assert r.status_code == 200, r.text
        data = r.json()
        assert data.get("status") == "ok"


# ---------- Booking create + persistence ----------
class TestBookings:
    def _payload(self, tag: str):
        return {
            "name": f"TEST_{tag}",
            "email": f"test_{tag}@example.com",
            "phone": "+61 400 000 000",
            "duration": "1 hour — $800",
            "date": "Fri 9pm",
            "location": "Perth CBD Hotel",
            "extras": ["COB", "BBBJ"],
            "message": f"Automated pytest booking {tag}",
        }

    def test_create_booking_returns_success(self, api_client):
        tag = uuid.uuid4().hex[:8]
        payload = self._payload(tag)
        r = api_client.post(f"{BASE_URL}/api/bookings", json=payload)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["success"] is True
        # email_sent False is EXPECTED (Resend not configured)
        assert "email_sent" in body
        assert body["email_sent"] is False
        booking = body["booking"]
        assert booking["name"] == payload["name"]
        assert booking["email"] == payload["email"]
        assert booking["phone"] == payload["phone"]
        assert booking["location"] == payload["location"]
        assert booking["extras"] == payload["extras"]
        assert booking["status"] == "new"
        assert booking.get("id"), "booking.id should be present"
        assert booking.get("created_at"), "booking.created_at should be present"
        # Mongo _id must NOT leak
        assert "_id" not in booking

    def test_create_booking_persists_in_list(self, api_client):
        tag = uuid.uuid4().hex[:8]
        payload = self._payload(tag)
        create_r = api_client.post(f"{BASE_URL}/api/bookings", json=payload)
        assert create_r.status_code == 200
        created = create_r.json()["booking"]

        list_r = api_client.get(f"{BASE_URL}/api/bookings")
        assert list_r.status_code == 200
        items = list_r.json()
        assert isinstance(items, list)
        assert len(items) >= 1
        # Find our record
        match = next((b for b in items if b.get("id") == created["id"]), None)
        assert match is not None, "Newly-created booking should appear in GET /api/bookings"
        assert match["email"] == payload["email"]
        assert match["extras"] == payload["extras"]
        assert "_id" not in match

    def test_create_booking_missing_email_returns_422(self, api_client):
        payload = self._payload("no_email")
        payload.pop("email")
        r = api_client.post(f"{BASE_URL}/api/bookings", json=payload)
        assert r.status_code == 422

    def test_create_booking_invalid_email_returns_422(self, api_client):
        payload = self._payload("bad_email")
        payload["email"] = "not-an-email"
        r = api_client.post(f"{BASE_URL}/api/bookings", json=payload)
        assert r.status_code == 422

    def test_create_booking_missing_name_returns_422(self, api_client):
        payload = self._payload("no_name")
        payload.pop("name")
        r = api_client.post(f"{BASE_URL}/api/bookings", json=payload)
        assert r.status_code == 422

    def test_create_booking_missing_location_returns_422(self, api_client):
        payload = self._payload("no_loc")
        payload.pop("location")
        r = api_client.post(f"{BASE_URL}/api/bookings", json=payload)
        assert r.status_code == 422
