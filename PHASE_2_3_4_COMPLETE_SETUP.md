# MysteryRoom — Complete Phase 2 + Phase 3 + Phase 4 Source Package

This package is based on the uploaded MysteryRoom frontend and backend source archives and the previously prepared Phase 3/4 implementation. It excludes `node_modules`, local `.env` files, and machine-specific files. Your existing Gemini generation and scoring rules are retained.

## Included phases

### Phase 2 — Database and application improvements
- Investigation progress is persisted in Supabase after clue discovery, hint reveal, and accusation.
- The active investigation ID is stored in browser local storage per signed-in user.
- An active investigation is automatically restored after a refresh or reopening the app.
- My Investigations dashboard lists the signed-in user's cases.
- Active cases can be resumed.
- Cases can be permanently deleted, with ownership enforced by the backend.
- Previously revealed hint text is returned only for hints already revealed by that user.
- Undiscovered clue content and the solution remain server-side.

### Phase 3 — Authentication and ownership
- Supabase Auth email/password registration and sign-in.
- Persistent Supabase browser session and sign-out.
- Express validates the Supabase access token on all mystery routes.
- New mysteries are associated with `auth.users.id`.
- Reads, updates, listing, and deletion are scoped to the authenticated user.

### Phase 4 — UI/UX
- Responsive sign-in and registration experience.
- Account identity and sign-out in the header.
- Saved investigation dashboard.
- Accessible progress and focus styles, reduced-motion support, loading/error feedback, and mobile refinements.
- Existing dark MysteryRoom styling and core investigation/results experience retained.

## 1. Back up first

Copy your existing `mystery room` folder before replacing files. Do not delete your current `.env` files.

## 2. Apply the Supabase migration

Open Supabase Dashboard → SQL Editor → New query. Copy and run the complete contents of:

`server/supabase/migrations/20261101_phase2_database_complete.sql`

The migration is safe to run more than once. It creates the full `mysteries` table if missing, adds any missing fields, creates per-user indexes, enables RLS, and creates owner-scoped policies. Existing rows are preserved; rows with `user_id = NULL` remain unassigned and are not automatically exposed to any user. If your existing table uses different column types, inspect the Supabase schema before running this migration.

In Supabase → Authentication → Providers, enable Email. For local testing, you may disable email confirmation in Authentication settings. For production, keep email confirmation enabled and configure email delivery.

## 3. Copy source files

Extract this ZIP. Copy its `client` folder and `server` folder into your existing project root, merging/replacing matching source files. Keep your existing `server/.env`. Do not copy any `.env.example` over `.env`.

## Phase 3 — Authentication and profiles

Run `server/supabase/migrations/20261101_phase3_auth_profiles.sql` in Supabase SQL Editor. It creates/updates the `profiles` table, enables owner-only RLS policies, synchronizes new/updated Auth users into profiles, and backfills existing users.

The login screen supports both account registration and sign-in. The demo credentials are displayed on the sign-in tab:

```text
Email: demo@mysteryroom.app
Password: MysteryRoom@2026
```

Create this demo account once in Supabase Dashboard → Authentication → Users → Add user, and enable Auto Confirm User for the demo account. The demo credentials are not a built-in bypass; Supabase Auth must have this user. Keep the demo account for evaluation only.

## 4. Environment variables

`server/.env` must retain your working values and include:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173,http://localhost:5174
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SECRET_KEY=YOUR_CURRENT_SERVER_SECRET_KEY
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
GEMINI_MODEL=gemini-2.5-flash
```

Create `client/.env` from `client/.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
```

Only the publishable/anon key belongs in the frontend. Never put the Supabase secret/service-role key in `client/.env` or frontend source code.

## 5. Install dependencies (Windows PowerShell)

Terminal 1:

```powershell
cd "C:\Users\devan\OneDrive\Desktop\mystery room\server"
npm install
npm run dev
```

Terminal 2:

```powershell
cd "C:\Users\devan\OneDrive\Desktop\mystery room\client"
npm install
npm run dev
```

Open the exact Vite URL printed in Terminal 2. If port 5173 is occupied, Vite may select 5174; that is why both local origins are listed in `CLIENT_URL` above. Restart the backend after changing `.env`.

## 6. Test in this order

1. Register a new account and confirm email if required by Supabase settings.
2. Sign in.
3. Generate a mystery; confirm the row has the signed-in user's `user_id`.
4. Discover a clue and reveal a hint.
5. Refresh the browser. The active investigation should restore automatically.
6. Open My Investigations and verify the case appears with its saved progress.
7. Resume an active case from the dashboard.
8. Create a second test account. Verify it cannot see or fetch the first account's case.
9. Delete a test case and verify it disappears from the dashboard and Supabase.
10. Submit an accusation and verify the final score is unchanged from the existing scoring rule.

## 7. Important security and data notes

- The backend uses `SUPABASE_SECRET_KEY` and validates user tokens with Supabase Auth. The key bypasses RLS; ownership filters in the backend are therefore mandatory.
- The migration intentionally does not create public RLS policies.
- Existing mysteries created before authentication have a NULL owner and will not appear in any user's case list. If you need to keep one, do not delete it; an administrator can decide how to assign it safely.
- Rotate any API keys or database credentials that were exposed in chat, screenshots, archives, or source control.
- Before production deployment, configure exact production CORS origins, HTTPS, email confirmation, backups, and rate limits.

## Source completeness

This ZIP includes the project source/configuration files needed for Phases 2–4, including frontend, backend, SQL migration, package manifests/lockfiles, and this setup guide. `node_modules` and real `.env` files are intentionally excluded. No claim is made that the application has been tested against your live Supabase project; complete the test checklist before marking the phases finished.
