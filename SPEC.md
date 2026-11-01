# MysteryRoom — Product Specification

**Project:** MysteryRoom — AI-powered detective investigation platform  
**Status:** Phase 1 specification and core-flow baseline  
**Primary objective:** Deliver a complete, playable mystery-solving experience in which Gemini generates a fair-play case and the player investigates evidence before making an accusation.

## 1. Product overview

MysteryRoom is a browser-based detective experience. A player describes a mystery premise, selects a difficulty, receives an AI-generated case, examines suspects and evidence, optionally requests hints, and submits one accusation. The server validates the generated case, stores the solution privately, calculates the final score, and returns the verdict only after the accusation.

### Problem and value

The application turns open-ended AI story generation into a structured, interactive investigation. It combines generative AI with deterministic validation, persistent case state, and a transparent scoring model.

### Target users

- Students and evaluators reviewing an AI-integrated full-stack project.
- Casual players who enjoy detective puzzles and interactive stories.
- Demonstration users accessing the application through a configured demo account.

## 2. Scope

### Core requirements

1. Create a mystery from a user-provided premise.
2. Support Easy, Medium, and Hard difficulty.
3. Generate a title, case briefing, suspects, clues, hints, and a secret solution.
4. Validate AI output before saving or showing it.
5. Reveal clue details only after the player discovers them.
6. Reveal hints one at a time and enforce the available hint count.
7. Accept one accusation per case.
8. Calculate the score on the backend.
9. Reveal the culprit, explanation, and method only after accusation submission.
10. Provide clear loading, validation, success, and error feedback.

### Difficulty and scoring

| Difficulty | Suspects | Clues | Hints | Base points |
|---|---:|---:|---:|---:|
| Easy | 3 | 5 | 2 | 100 |
| Medium | 4 | 7 | 3 | 150 |
| Hard | 5 | 9 | 3 | 200 |

For a correct accusation:

`finalScore = max(0, basePoints + (discoveredClues × 5) − (hintsUsed × 10))`

For an incorrect accusation, `finalScore = 0`.

All score calculations must happen on the backend. The frontend may display an estimate, but the server response is authoritative.

## 3. User journey

1. The user opens the public MysteryRoom landing page.
2. The user enters the application using the configured authentication/demo access flow.
3. The user opens Create Mystery.
4. The user enters a premise of at least 20 characters and selects a difficulty.
5. The backend asks Gemini for structured JSON and validates every required field and count.
6. The backend stores the case and secret solution; the client receives only public case data.
7. The user reviews the case briefing and suspect profiles.
8. The user discovers clues. Each successful discovery is saved.
9. The user may reveal hints, subject to the difficulty limit and score penalty.
10. The user selects one suspect and submits an accusation.
11. The backend checks the culprit, calculates the score, marks the case completed, and returns the result.
12. The user reviews the verdict and can create another case.

## 4. User interface requirements

### Public landing page
- Explain the MysteryRoom concept and core features.
- Provide clear Login and Get Started actions.
- Work on desktop and mobile widths.

### Authentication entry
- Present the demo access information where configured.
- Provide understandable invalid-credential and configuration errors.
- Never expose server credentials in the browser.

### Application home/dashboard
- Show the create-mystery action and key workflow information.
- Provide access to saved investigations.
- Display empty, loading, and failure states.

### Create Mystery
- Premise text area with minimum/maximum length validation.
- Easy, Medium, and Hard selection with counts and base score.
- Disable generation while the request is in progress.
- Show actionable API/AI errors.

### Investigation Room
- Case briefing, difficulty, base score, suspect profiles, and progress.
- Locked undiscovered clues; discovered clues show their title/category/description.
- Hints are revealed in sequence and show remaining count.
- Suspect selection and one-time accusation submission.
- Never render the secret solution before submission.

### Results
- Correct/incorrect verdict.
- Accused suspect, actual culprit, explanation, method, final score, clue bonus, and hint penalty.
- Action to create another mystery or return home.

## 5. Technology architecture

### Current implementation stack

- Frontend: React 18, Vite, Tailwind CSS 4, lucide-react.
- Backend: Node.js, Express, Zod validation.
- AI: Google Gemini through `@google/genai`.
- Persistence: Supabase PostgreSQL and Supabase Auth.
- Browser authentication: `@supabase/supabase-js`.

**Implementation note:** The supplied project guide suggests MongoDB/Mongoose. The current working project and database setup use Supabase PostgreSQL. This specification records the actual implementation so the project does not accidentally mix two database systems. Do not migrate to MongoDB unless the project owner explicitly requests that change.

### High-level data flow

`React UI → Express API → Supabase Auth token validation → Gemini (generation only) → Supabase PostgreSQL → sanitized API response → React UI`

The browser never receives the Supabase secret key, Gemini API key, full hidden clue data, or solution before accusation.

## 6. API contract

Base URL: `/api`

All mystery endpoints require `Authorization: Bearer <Supabase access token>`.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | API health check |
| POST | `/mysteries` | Generate and save a mystery |
| GET | `/mysteries` | List the signed-in user's cases |
| GET | `/mysteries/:id` | Retrieve one owned case with sanitized data |
| DELETE | `/mysteries/:id` | Delete one owned case |
| POST | `/mysteries/:id/clues/:clueId/discover` | Reveal and save one clue |
| POST | `/mysteries/:id/hints/reveal` | Reveal the next hint |
| POST | `/mysteries/:id/accuse` | Submit an accusation and return the result |

### Request validation

- Premise: trimmed string, 20–2,000 characters.
- Difficulty: exactly `Easy`, `Medium`, or `Hard`.
- Suspect ID: positive integer belonging to the current case.
- Case ID: valid UUID.
- Clue ID: must belong to the current case.
- Completed cases cannot accept further clues, hints, or accusations.

### Error behavior

- `400`: invalid input or malformed identifier.
- `401`: missing, invalid, or expired authentication token.
- `404`: case/clue not found or not owned by the current user.
- `409`: case already completed or no hints remain.
- `502/503`: invalid AI response or missing AI configuration.
- `500`: unexpected server error with a generic client-safe message.

## 7. Data model

The `public.mysteries` table stores:

- `id` — UUID primary key.
- `user_id` — UUID owner referencing `auth.users(id)`.
- `title`, `premise`, `difficulty`, `base_points`.
- `suspects` — JSONB public suspect profiles.
- `clues` — JSONB clue records, including private interpretation fields.
- `hints` — JSONB ordered hint strings.
- `solution` — JSONB secret culprit, explanation, and method.
- `discovered_clue_ids` — text array/JSON-compatible progress collection.
- `revealed_hint_indexes` — integer array/JSON-compatible progress collection.
- `status` — `active` or `completed`.
- `accusation` — JSONB submitted suspect, correctness, score, and timestamp.
- `created_at`, `updated_at` — timestamps.

The actual existing table column types must be verified against the Supabase project before any schema changes are applied.

## 8. AI response contract

Gemini must return JSON with:

- `title`, `premise`.
- `suspects[]`: `id`, `name`, `role`, optional `age`, `description`, `motive`.
- `clues[]`: `id`, `title`, `category`, `description`, private `hint`.
- `hints[]`: ordered strings.
- `solution`: `culpritSuspectId`, `explanation`, `method`.

Validation must enforce exact difficulty counts, unique IDs, valid field types, non-empty required strings, a culprit ID matching one suspect, and a complete solution. Invalid AI output must not be saved.

## 9. Security and privacy

- Keep Gemini and Supabase secret keys in backend environment variables only.
- Use only the Supabase publishable/anon key in the frontend.
- Validate Supabase access tokens on protected backend routes.
- Scope every database read, update, and delete by the authenticated user ID.
- Do not return hidden clue details, private clue interpretations, unused hints, or the solution in public mystery responses.
- Return the solution only after a valid accusation.
- Apply request size limits, security headers, CORS allow-listing, and API rate limiting.
- Never commit `.env` files or real credentials.

## 10. Phase 1 acceptance criteria

- [ ] This specification is complete and usable as the project blueprint.
- [ ] The project structure and technology stack are documented accurately.
- [ ] All three difficulty configurations match the required counts.
- [ ] The core mystery generation and investigation workflow is documented.
- [ ] The API contract and validation rules are documented.
- [ ] Scoring rules are unambiguous and backend-authoritative.
- [ ] The hidden-solution security requirement is explicit.
- [ ] The Phase 1 source-level tests pass.
- [ ] The frontend production build succeeds in the target Windows environment.
- [ ] A full local end-to-end mystery is generated and solved successfully.

## 11. Delivery checklist

- Complete frontend and backend source.
- `SPEC.md` and project setup documentation.
- Environment examples with placeholders only.
- Database migration scripts.
- Automated source-level tests.
- Local run and end-to-end test instructions.
- Deployment instructions and final live URL (to be completed in the deployment phase).
