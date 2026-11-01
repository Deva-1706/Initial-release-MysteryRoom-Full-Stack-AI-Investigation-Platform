# MysteryRoom

An AI-powered detective mystery experience built with React, Vite, Express, Gemini, Supabase PostgreSQL, and Supabase Auth.

## Project structure

- `client/` — React/Vite user interface.
- `server/` — Express API, Gemini integration, Supabase data access, and tests.
- `server/supabase/migrations/` — SQL migrations for the Supabase project.
- `SPEC.md` — product requirements, user flow, API contract, data model, scoring, and security requirements.
- `docs/` — phase progress and project documentation.

## Current implementation

The existing project contains a core mystery creation/investigation flow, Gemini generation, clue discovery, hints, accusation, and server-side scoring. Supabase Auth and persistence code are included in the current working source. The five-phase completion process is being carried out sequentially; do not treat later-phase functionality as accepted until its tests and live checks are complete.

## Requirements

- Node.js 20 or newer recommended.
- npm.
- Supabase project with the required `mysteries` table and migrations applied.
- Gemini API key.

## Environment files

Create `server/.env` from `server/.env.example` and `client/.env` from `client/.env.example`. Never commit real `.env` files.

The backend uses the Supabase secret key and Gemini API key. The frontend uses only the Supabase publishable/anon key.

## Local development

Backend terminal:

```powershell
cd server
npm install
npm run dev
```

Frontend terminal:

```powershell
cd client
npm install
npm run dev
```

Open the Vite URL printed in the frontend terminal. The API health endpoint is `http://localhost:5000/api/health`.

## Backend tests

```powershell
cd server
npm test
```

## Before submission

Follow `SPEC.md` and the current phase progress report. Complete a fresh frontend production build and test the complete user journey against the configured Supabase and Gemini services before deployment.
