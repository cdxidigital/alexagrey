# PRD — Alexa Grey · Perth Companion Landing Page

## Original Problem Statement
Build a landing page / home page for "Alexa Grey", an independent adult
companion (escort) based in Perth, WA, Australia (legal adult services).
Content supplied: quick facts, an "About Me" bio (GFE/PSE), a large list of
services/preferences, availability schedule, rates + extras, and uploaded media
(2 images + 3 videos).

## User Choices (gathered)
- Age-verification gate (18+) on entry.
- Booking enquiry form that emails the owner **and** saves to DB.
- Dark, luxe & sensual visual style (black + gold).
- Use all uploaded media in a gallery, **blurred until the user opts in**.
- Working enquiry that actually saves bookings (backend).

## Architecture
- **Stack:** React (CRA) + Tailwind + Framer Motion + lucide-react (frontend,
  port 3000) · FastAPI (backend, port 8001, `/api` prefix) · MongoDB.
  (Standard Emergent/supervisor stack — the imported Replit `/app/artifacts`
  pnpm/Express/Postgres files are unused.)
- **Design:** Cormorant Garamond (headings) + Manrope (body), #050505 ink /
  #D4AF37 gold palette, film-grain overlay, glassmorphism, bento grids,
  scroll reveals.

## Data Model
- `bookings`: name, email, phone, duration, date, location, extras[], message,
  status, created_at.

## API
- `GET /api/` — health
- `POST /api/bookings` — create enquiry (saves to Mongo; emails owner if Resend
  configured; returns `{success, email_sent, booking}`)
- `GET /api/bookings` — list enquiries

## Implemented (2026-07-19)
- 18+ age gate (blocks scroll, elegant glass overlay).
- Sticky nav, full-bleed hero, Quick Facts bento grid, About Me bio + PSE list,
  Services tag cloud, blurred opt-in Gallery (images + videos) with lightbox,
  Availability schedule, Rates + Extras cards, Booking enquiry form, Footer.
- Booking backend (Mongo persistence) + optional Resend email (graceful skip).
- Verified end-to-end by testing agent: backend 100%, frontend 100%, no bugs.

## Pending / Needs user input
- **Email notifications:** RESEND_API_KEY + OWNER_EMAIL not yet set in
  backend/.env. Bookings save fine; email sending is skipped until provided.

## Backlog (P1/P2)
- P1: Enable Resend email once key + owner email supplied.
- P1: Basic spam protection on POST /api/bookings (rate limit / captcha).
- P2: Simple admin view to browse enquiries.
- P2: Surface server-side (422) validation messages in the form.
- P2: WhatsApp/Telegram click-to-message option.
- P2: Migrate deprecated FastAPI on_event('shutdown') to lifespan handler.
