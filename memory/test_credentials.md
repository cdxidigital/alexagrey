# Test Credentials — Alexa Grey Landing Page

This application has **no authentication / login**. It is a public single-page
landing site with a public booking-enquiry API.

## Accounts
- None (no user accounts, no admin panel).

## Public API (no auth)
- `GET  {REACT_APP_BACKEND_URL}/api/`            → health check
- `POST {REACT_APP_BACKEND_URL}/api/bookings`    → create a booking enquiry
- `GET  {REACT_APP_BACKEND_URL}/api/bookings`    → list booking enquiries

## Email notifications
- Booking emails via Resend are **NOT configured yet** (RESEND_API_KEY and
  OWNER_EMAIL are empty in backend/.env). Bookings still save to MongoDB and the
  API returns `{"success": true, "email_sent": false}`. This is expected until
  the owner provides a Resend API key + destination email.
