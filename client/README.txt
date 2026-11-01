MYSTERYROOM — REACT FRONTEND

This React + Vite frontend connects to the MysteryRoom Express API and Supabase Auth.

SETUP (WINDOWS POWERSHELL)

1. Open this client folder in VS Code.
2. Install dependencies:
   npm install
3. Create client/.env from .env.example and set:
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
4. Start the frontend:
   npm run dev
5. Open the localhost URL printed by Vite.

BUILD CHECK
   npm run build

IMPORTANT
- Run the backend in a separate terminal.
- Only the Supabase publishable/anon key belongs in this frontend environment file.
- Never put the Supabase secret key or Gemini API key in client/.env.
- The backend owns scoring and keeps the mystery solution private until an accusation is submitted.
- For the full workflow and requirements, see the root SPEC.md.
