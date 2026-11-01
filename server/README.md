# MysteryRoom API

Express backend for MysteryRoom. It integrates Gemini mystery generation with Supabase PostgreSQL persistence and Supabase Auth token validation.

## Requirements

- Node.js 20 or newer recommended
- npm
- Supabase project with the `public.mysteries` table and required migrations
- Gemini API key

## Setup (Windows PowerShell)

```powershell
npm install
Copy-Item .env.example .env
```

Fill `server/.env` with your own values:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173,http://localhost:5174
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SECRET_KEY=YOUR_SUPABASE_SECRET_KEY
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
GEMINI_MODEL=gemini-2.5-flash
```

Never put `SUPABASE_SECRET_KEY` or `GEMINI_API_KEY` in the frontend or commit `.env` files.

## Run

```powershell
npm run dev
```

Health check: `http://localhost:5000/api/health`

## Tests

```powershell
npm test
```

## API

All `/api/mysteries` endpoints require `Authorization: Bearer <Supabase access token>`.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/mysteries` | Generate and save a mystery |
| GET | `/api/mysteries` | List current user's mysteries |
| GET | `/api/mysteries/:id` | Get an owned mystery |
| DELETE | `/api/mysteries/:id` | Delete an owned mystery |
| POST | `/api/mysteries/:id/clues/:clueId/discover` | Discover a clue |
| POST | `/api/mysteries/:id/hints/reveal` | Reveal next hint |
| POST | `/api/mysteries/:id/accuse` | Submit accusation and reveal result |

## Security

- Gemini and Supabase secret credentials remain server-side.
- Supabase Auth access tokens are validated by the backend.
- Database operations are scoped to the authenticated user ID.
- Undiscovered clue details, private clue interpretations, unused hints, and the solution are not returned in ordinary mystery responses.
- The solution and final score are returned only after a valid accusation.
