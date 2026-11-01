import test from "node:test";
import assert from "node:assert/strict";
import { DIFFICULTY_RULES, calculateFinalScore } from "../src/utils/difficulty.js";
import { toPublicMystery } from "../src/utils/publicMystery.js";
import { validateGeneratedMystery } from "../src/services/gemini.service.js";

function sampleMystery(difficulty = "Easy") {
  const rules = DIFFICULTY_RULES[difficulty];
  return {
    title: "The Silent Gallery",
    premise: "A valuable painting disappears during a locked-room exhibition.",
    suspects: Array.from({ length: rules.suspects }, (_, index) => ({
      id: index + 1,
      name: `Suspect ${index + 1}`,
      role: "Gallery staff",
      age: 30,
      description: "A profile description.",
      motive: "A possible motive.",
    })),
    clues: Array.from({ length: rules.clues }, (_, index) => ({
      id: `clue-${index + 1}`,
      title: `Evidence ${index + 1}`,
      category: "Physical",
      description: "Evidence description.",
      hint: "Private interpretation.",
    })),
    hints: Array.from({ length: rules.hints }, (_, index) => `Hint ${index + 1}`),
    solution: { culpritSuspectId: 1, explanation: "The evidence identifies the culprit.", method: "A concealed access route." },
  };
}

test("difficulty rules match the project specification", () => {
  assert.deepEqual(DIFFICULTY_RULES.Easy, { suspects: 3, clues: 5, hints: 2, basePoints: 100 });
  assert.deepEqual(DIFFICULTY_RULES.Medium, { suspects: 4, clues: 7, hints: 3, basePoints: 150 });
  assert.deepEqual(DIFFICULTY_RULES.Hard, { suspects: 5, clues: 9, hints: 3, basePoints: 200 });
});

test("score applies base points, clue bonuses and hint penalties", () => {
  assert.equal(calculateFinalScore({ correct: true, basePoints: 100, discoveredCount: 5, hintsUsed: 2 }), 105);
  assert.equal(calculateFinalScore({ correct: true, basePoints: 100, discoveredCount: 0, hintsUsed: 20 }), 0);
  assert.equal(calculateFinalScore({ correct: false, basePoints: 200, discoveredCount: 9, hintsUsed: 0 }), 0);
});

test("generated mystery meets the selected difficulty requirements", () => {
  for (const difficulty of ["Easy", "Medium", "Hard"]) {
    const data = sampleMystery(difficulty);
    assert.doesNotThrow(() => validateGeneratedMystery(data, DIFFICULTY_RULES[difficulty]));
  }
});

test("generated mystery rejects duplicate clue identifiers", () => {
  const data = sampleMystery("Easy");
  data.clues[1].id = data.clues[0].id;
  assert.throws(() => validateGeneratedMystery(data, DIFFICULTY_RULES.Easy), /clue IDs are invalid or duplicated/);
});

test("generated mystery rejects an invalid culprit reference", () => {
  const data = sampleMystery("Easy");
  data.solution.culpritSuspectId = 99;
  assert.throws(() => validateGeneratedMystery(data, DIFFICULTY_RULES.Easy), /solution is incomplete/);
});

test("public mystery hides undiscovered clue contents and the solution", () => {
  const data = sampleMystery("Easy");
  const publicCase = toPublicMystery({
    _id: "case-id",
    ...data,
    difficulty: "Easy",
    basePoints: 100,
    discoveredClueIds: [],
    revealedHintIndexes: [],
    status: "active",
    createdAt: new Date().toISOString(),
  });
  assert.equal(publicCase.clues[0].title, undefined);
  assert.equal(publicCase.clues[0].description, undefined);
  assert.equal("solution" in publicCase, false);
  assert.equal("hints" in publicCase, false);
});

test("Phase 2 migration defines persistence, ownership, indexes, and RLS policies", async () => {
  const { readFile } = await import("node:fs/promises");
  const { fileURLToPath } = await import("node:url");
  const { dirname, resolve } = await import("node:path");
  const here = dirname(fileURLToPath(import.meta.url));
  const sql = await readFile(resolve(here, "../supabase/migrations/20261101_phase2_database_complete.sql"), "utf8");
  for (const column of ["user_id", "title", "premise", "difficulty", "base_points", "suspects", "clues", "hints", "solution", "discovered_clue_ids", "revealed_hint_indexes", "status", "accusation", "created_at", "updated_at"]) {
    assert.match(sql, new RegExp(`add column if not exists ${column}\\b`, "i"));
  }
  assert.match(sql, /enable row level security/i);
  assert.match(sql, /auth\.uid\(\) = user_id/i);
});

test("new investigations are registered for resume after refresh", async () => {
  const { readFile } = await import("node:fs/promises");
  const { fileURLToPath } = await import("node:url");
  const { dirname, resolve } = await import("node:path");
  const here = dirname(fileURLToPath(import.meta.url));
  const appSource = await readFile(resolve(here, "../../client/src/MysteryApp.jsx"), "utf8");
  assert.match(appSource, /setItem\(lastMysteryStorageKey, response\.mystery\.id\)/);
  assert.match(appSource, /mysteryAPI\.get\(lastId\)/);
  assert.match(appSource, /mysteryAPI\.list\(\)/);
  assert.match(appSource, /mysteryAPI\.delete\(id\)/);
});

test("Phase 3 authentication supports registration, sign-in, session restore, and profile sync", async () => {
  const { readFile } = await import("node:fs/promises");
  const { fileURLToPath } = await import("node:url");
  const { dirname, resolve } = await import("node:path");
  const here = dirname(fileURLToPath(import.meta.url));
  const authScreen = await readFile(resolve(here, "../../client/src/components/AuthScreen.jsx"), "utf8");
  const appSource = await readFile(resolve(here, "../../client/src/App.jsx"), "utf8");
  const middleware = await readFile(resolve(here, "../src/middleware/requireAuth.js"), "utf8");
  const migration = await readFile(resolve(here, "../supabase/migrations/20261101_phase3_auth_profiles.sql"), "utf8");
  assert.match(authScreen, /supabase\.auth\.signUp/);
  assert.match(authScreen, /supabase\.auth\.signInWithPassword/);
  assert.match(appSource, /supabase\.auth\.getSession/);
  assert.match(appSource, /supabase\.auth\.onAuthStateChange/);
  assert.match(appSource, /supabase\.auth\.signOut/);
  assert.match(middleware, /supabase\.auth\.getUser\(token\)/);
  assert.match(migration, /create trigger on_auth_user_created_mysteryroom/i);
  assert.match(migration, /enable row level security/i);
});

test("Phase 4 UI includes responsive navigation, focus visibility, and reduced-motion support", async () => {
  const { readFile } = await import("node:fs/promises");
  const { fileURLToPath } = await import("node:url");
  const { dirname, resolve } = await import("node:path");
  const here = dirname(fileURLToPath(import.meta.url));
  const css = await readFile(resolve(here, "../../client/src/index.css"), "utf8");
  const landing = await readFile(resolve(here, "../../client/src/components/LandingPage.jsx"), "utf8");
  const auth = await readFile(resolve(here, "../../client/src/components/AuthScreen.jsx"), "utf8");
  const app = await readFile(resolve(here, "../../client/src/MysteryApp.jsx"), "utf8");
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(landing, /onGetStarted/);
  assert.match(landing, /id="features"/);
  assert.match(auth, /role="alert"/);
  assert.match(app, /My Cases/);
  assert.match(app, /flex-wrap/);
});

test("Phase 5 deployment configuration and security defaults are present", async () => {
  const { readFile } = await import("node:fs/promises");
  const { fileURLToPath } = await import("node:url");
  const { dirname, resolve } = await import("node:path");
  const here = dirname(fileURLToPath(import.meta.url));
  const root = resolve(here, "../..");
  const render = await readFile(resolve(root, "render.yaml"), "utf8");
  const vercel = await readFile(resolve(root, "client/vercel.json"), "utf8");
  const workflow = await readFile(resolve(root, ".github/workflows/ci.yml"), "utf8");
  const deployment = await readFile(resolve(root, "DEPLOYMENT_GUIDE.md"), "utf8");
  const app = await readFile(resolve(here, "../src/app.js"), "utf8");
  assert.match(render, /healthCheckPath: \/api\/health/);
  assert.match(vercel, /index\.html/);
  assert.match(workflow, /npm test/);
  assert.match(workflow, /npm run build/);
  assert.match(deployment, /SUPABASE_SECRET_KEY/);
  assert.match(app, /app\.set\("trust proxy", 1\)/);
});
