# Alexa Grey

Booking site and admin inbox for an independent Perth companion. Strictly 18+.

## Local

```bash
cp .env.example .env
# set INBOX_ACCESS_CODE and INBOX_TOKEN_SECRET in .env
npm install
npm run dev
```

The public booking form saves enquiries. The admin inbox is at `/admin` and opens only with the access code from `.env`. Leaving the inbox locks it.

Do not commit `.env`. On a host, set `INBOX_ACCESS_CODE` and `INBOX_TOKEN_SECRET` as environment variables.
