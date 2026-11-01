# MysteryRoom — Deployment and Submission Guide

This guide deploys the existing React/Vite frontend to Vercel and the Express API to Render. Supabase remains the database and authentication provider; Gemini remains the AI provider.

## 1. Before deployment

1. Push the complete project to a private or public GitHub repository.
2. Confirm no `.env` file, Supabase secret key, or Gemini API key is committed.
3. Run the Supabase migrations in order:
   - `server/supabase/migrations/20261101_phase2_database_complete.sql`
   - `server/supabase/migrations/20261101_phase3_auth_profiles.sql`
4. Inspect the existing Supabase table columns before running migrations. The SQL is additive and preserves rows, but existing custom column types should be checked.
5. Create the demo account in Supabase Authentication → Users:
   - Email: `demo@mysteryroom.app`
   - Password: `MysteryRoom@2026`
   - Enable Auto Confirm User for this evaluation account.

## 2. Deploy the backend to Render

1. Create a new Web Service in Render and connect the GitHub repository.
2. Set Root Directory to `server`.
3. Build Command: `npm ci`.
4. Start Command: `npm start`.
5. Add environment variables:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `CLIENT_URL` | Your deployed Vercel frontend origin, e.g. `https://your-app.vercel.app` |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SECRET_KEY` | Supabase server secret key (`sb_secret_...`) |
| `GEMINI_API_KEY` | Your Gemini API key |
| `GEMINI_MODEL` | `gemini-2.5-flash` |

Render supplies `PORT`; do not hardcode a production port.

6. Deploy and wait for the service to become healthy.
7. Verify `https://YOUR-RENDER-SERVICE.onrender.com/api/health` returns JSON with `success: true`.

## 3. Deploy the frontend to Vercel

1. Import the same GitHub repository into Vercel.
2. Set Root Directory to `client`.
3. Framework preset: Vite.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Add environment variables:

| Key | Value |
|---|---|
| `VITE_API_BASE_URL` | `https://YOUR-RENDER-SERVICE.onrender.com/api` |
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase publishable key (`sb_publishable_...`) or legacy anon key |

7. Deploy and copy the exact Vercel production origin.
8. If the Vercel origin changes, update Render's `CLIENT_URL` to that exact origin and redeploy the backend.

## 4. Supabase Auth URL settings

In Supabase Dashboard → Authentication → URL Configuration:

- Set Site URL to the exact deployed Vercel URL.
- Add the Vercel production URL to Redirect URLs.
- Add the local Vite URLs used during development if local auth testing is required.
- Keep email confirmation configured intentionally. If enabled, users must confirm their email before sign-in. The demo account should be auto-confirmed for evaluation.

## 5. Production acceptance checklist

- [ ] Landing page loads from the public Vercel URL.
- [ ] Demo account signs in successfully.
- [ ] New account registration behaves according to email-confirmation settings.
- [ ] Refreshing the page restores a valid session.
- [ ] Sign out returns to the public landing page.
- [ ] API health check is healthy.
- [ ] Easy mystery generates exactly 3 suspects, 5 clues and 2 hints.
- [ ] Medium mystery generates exactly 4 suspects, 7 clues and 3 hints.
- [ ] Hard mystery generates exactly 5 suspects, 9 clues and 3 hints.
- [ ] Clue discovery persists after refresh.
- [ ] Revealed hints persist after refresh and remaining hint count is correct.
- [ ] A case appears in My Cases and can be resumed.
- [ ] A case can be deleted and disappears from the list.
- [ ] An incorrect accusation returns 0 points.
- [ ] A correct accusation uses the server formula and reveals the solution only after submission.
- [ ] A second user cannot read, update or delete the first user's case.
- [ ] No secret keys appear in frontend bundles, Git history, or browser network responses.

## 6. Submission contents

- GitHub repository URL.
- Public Vercel website URL.
- Backend Render health URL.
- Short demo credentials for the evaluator (share only in the submission channel required by the project).
- Project specification (`SPEC.md`) and setup documentation.

Do not claim the app is deployed or fully live-tested until the checklist above has been completed against the production URLs.
