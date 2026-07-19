# alexagrey — Next.js + Vercel migration guide

What I added:
- Next.js scaffold (pages/, styles/, package.json, next.config.js)
- Dockerfile for optional containerized production
- .env.example and .vercelignore / .gitignore

Quick start (local)
1. Install dependencies:
   - npm ci
2. Run dev server:
   - npm run dev
3. Build locally:
   - npm run build
   - npm start (serves production build on port 3000)

Vercel deployment
- Connect repo to Vercel (if not already connected).
- Vercel auto-detects Next.js — no custom vercel.json needed.
- Add any environment variables in Vercel Project > Settings > Environment Variables (use values from .env.example).
- Push to the branch linked to Vercel (main or your production branch) and Vercel will auto-deploy.

Migrating Python endpoints
- Option A (recommended for speed): Keep Python backend separate (Railway/Fly/Render) and point Next.js frontend to that service with NEXT_PUBLIC_API_BASE.
- Option B: Convert Python endpoints into Node API routes under pages/api/* (rewrite logic from Flask/FastAPI to Express-style handlers).
- Option C: Keep Python serverless functions under /api/*.py — Vercel can still deploy Python serverless functions, but this mixed setup may complicate local dev and cold starts. If you want this, I can produce a vercel.json with multi-build config.

Next actions I can do for you
1. Create a new branch (e.g., nextjs/migrate) and commit these files.
2. Migrate Python endpoints into Node API routes (I can convert a sample endpoint if you paste it).
3. Create a PR with the scaffold and a checklist for full migration.

Questions for you (one-line):
- Do you want me to commit these files into a branch on cdxidigital/alexagrey (I have the repo info you provided), or do you prefer to add them yourself?
