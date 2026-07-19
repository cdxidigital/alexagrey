# Alexa Grey — Perth Companion Landing Page

A dark, luxe single-page landing site for an independent adult companion (18+).
Built with React (frontend) + FastAPI (backend) + MongoDB.

> **Strictly 18+.** This site advertises legal adult services and is intended for
> consenting adults only.

## Tech stack

| Layer     | Tech                                                        |
| --------- | ----------------------------------------------------------- |
| Frontend  | React (CRA), Tailwind CSS, Framer Motion, lucide-react, axios |
| Backend   | FastAPI, Motor (async MongoDB), Resend (email), Pydantic v2 |
| Database  | MongoDB                                                     |

## Project structure

```
/app
├── frontend/          # React app (deployable to Vercel)
│   ├── src/
│   │   ├── App.js
│   │   ├── data.js            # all page content + uploaded media URLs
│   │   └── components/        # AgeGate, Hero, Gallery, BookingForm, ...
│   ├── vercel.json
│   └── .env                   # REACT_APP_BACKEND_URL (not committed)
└── backend/           # FastAPI app (host on Render/Railway/Fly, not Vercel)
    ├── server.py
    ├── requirements.txt
    └── .env                   # MONGO_URL, DB_NAME, RESEND_API_KEY, ... (not committed)
```

## Environment variables

**frontend/.env**

```
REACT_APP_BACKEND_URL=<your backend base url, e.g. https://api.example.com>
```

**backend/.env**

```
MONGO_URL=<mongodb connection string>
DB_NAME=alexa_grey
CORS_ORIGINS=<comma-separated allowed origins, e.g. https://yourdomain.com>
RESEND_API_KEY=<resend api key, optional — enables booking emails>
SENDER_EMAIL=onboarding@resend.dev
OWNER_EMAIL=<where booking enquiries are emailed>
```

## Local development

```bash
# backend
cd backend && pip install -r requirements.txt
uvicorn server:app --reload --port 8001

# frontend
cd frontend && yarn install && yarn start
```

## API

- `GET  /api/`          — health check
- `POST /api/bookings`  — create a booking enquiry (saves to Mongo, emails owner if Resend configured)
- `GET  /api/bookings`  — list booking enquiries

## Deployment

This is a full-stack app, so it deploys as **two pieces**.

### Frontend → Vercel
1. Push this repo to GitHub (use the **"Save to GitHub"** button in Emergent).
2. In Vercel: *New Project* → import the repo.
3. Set **Root Directory = `frontend`** (Vercel auto-detects Create React App).
4. Add env var **`REACT_APP_BACKEND_URL`** = your deployed backend URL.
5. Deploy.

### Backend → Render / Railway / Fly.io (Vercel can't run it as-is)
1. Deploy the `backend/` folder as a Python web service.
   - Start command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
2. Use **MongoDB Atlas** for `MONGO_URL` (local Mongo won't exist in the cloud).
3. Set `CORS_ORIGINS` to your Vercel domain.
4. Add `RESEND_API_KEY` + `OWNER_EMAIL` to enable booking email notifications.

> Alternatively, **Emergent's native deployment** hosts the entire
> React + FastAPI + MongoDB stack as-is with no restructuring.
