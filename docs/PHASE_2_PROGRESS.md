# MysteryRoom — Phase 2 Progress Report

## Scope
Complete database persistence in the same Phase 1 codebase: create/read/update/delete investigations, per-user ownership, saved progress, and refresh/resume behavior.

## Work completed in this preparation pass
- Audited the existing Supabase database model and controller paths.
- Added a comprehensive, rerunnable Supabase migration that creates the `mysteries` table if missing and adds the fields required by the current application if absent.
- Added per-user and status/timestamp indexes.
- Enabled Row Level Security and added owner-scoped select/insert/update/delete policies for authenticated users.
- Kept the existing Express API's authenticated `user_id` filters; the backend secret key must remain server-side.
- Fixed the active-case resume pointer so newly generated cases are saved to local storage, active cases restore after refresh, completed cases clear the active pointer, and deleting/resetting a case clears the pointer.
- Updated the setup guide and backend README to describe the actual Supabase architecture rather than the old MongoDB starter notes.
- Added automated checks for migration fields/RLS and saved-case lifecycle hooks.

## Automated checks
- Backend unit/static tests: 8 passed, 0 failed.
- Backend JavaScript syntax: passed.
- Frontend JSX parsing/transpile and relative imports: passed.
- Live Supabase migration execution and CRUD verification: not run from this environment. It requires access to the user's private Supabase project.

## Open items before Phase 2 live acceptance
- Run the new migration in the target Supabase project after checking the existing `mysteries` column types.
- Verify create, clue update, hint update, list, resume, delete, and completed-case history against the live database.
- Verify two authenticated users cannot read or modify one another's cases.

## Status
**Phase 2 source and migration preparation are complete; live database acceptance is pending.** No existing rows are intentionally deleted or reassigned by the migration.
