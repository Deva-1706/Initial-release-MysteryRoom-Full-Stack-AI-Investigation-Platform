import { useEffect, useState } from "react";
import InvestigationRoom from "./components/InvestigationRoom";
import { mysteryAPI } from "./services/api";
import {
  Search,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  Brain,
  FileText,
  Eye,
  Clock3,
  Lock,
  Fingerprint,
  Plus,
  AlertCircle,
} from "lucide-react";

const cases = [
  {
    title: "AI-generated cases",
    category: "CREATE YOUR OWN MYSTERY",
    description: "Create a fresh investigation with Gemini AI and save it to your case database.",
    difficulty: "Choose your level",
    time: "Dynamic",
    icon: "🕵️",
  },
  {
    title: "Persistent investigations",
    category: "SAVED CASES",
    description: "Your clues, revealed hints, and investigation status are stored by the backend.",
    difficulty: "Database-backed",
    time: "Anytime",
    icon: "🔎",
  },
];

const difficulties = [
  { name: "Easy", suspects: 3, clues: 5, hints: 2, points: 100 },
  { name: "Medium", suspects: 4, clues: 7, hints: 3, points: 150 },
  { name: "Hard", suspects: 5, clues: 9, hints: 3, points: 200 },
];

function MysteryApp({ user, onSignOut }) {
  const [page, setPage] = useState("home");
  const [difficulty, setDifficulty] = useState("Medium");
  const [story, setStory] = useState("");
  const [mystery, setMystery] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedMysteries, setSavedMysteries] = useState([]);
  const [isLoadingCases, setIsLoadingCases] = useState(false);
  const [caseError, setCaseError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const lastMysteryStorageKey = `mysteryroom:last-active:${user.id}`;

  useEffect(() => {
    let cancelled = false;
    const lastId = window.localStorage.getItem(lastMysteryStorageKey);
    if (!lastId) return undefined;

    mysteryAPI.get(lastId)
      .then((response) => {
        if (cancelled || !response.mystery) return;
        if (response.mystery.status !== "active") {
          window.localStorage.removeItem(lastMysteryStorageKey);
          return;
        }
        setMystery(response.mystery);
        setPage("investigation");
      })
      .catch(() => {
        if (!cancelled) window.localStorage.removeItem(lastMysteryStorageKey);
      });

    return () => { cancelled = true; };
  }, [lastMysteryStorageKey]);

  const loadSavedMysteries = async () => {
    setPage("cases");
    setIsLoadingCases(true);
    setCaseError("");
    try {
      const response = await mysteryAPI.list();
      setSavedMysteries(response.mysteries || []);
      setPage("cases");
    } catch (err) {
      setCaseError(err.message || "Could not load your investigations.");
    } finally {
      setIsLoadingCases(false);
    }
  };

  const resumeMystery = async (id) => {
    setCaseError("");
    try {
      const response = await mysteryAPI.get(id);
      if (!response.mystery) throw new Error("Saved investigation was not found.");
      setMystery(response.mystery);
      setResult(null);
      if (response.mystery.status === "active") {
        window.localStorage.setItem(lastMysteryStorageKey, response.mystery.id);
        setPage("investigation");
      } else {
        window.localStorage.removeItem(lastMysteryStorageKey);
        setPage("cases");
      }
    } catch (err) {
      setCaseError(err.message || "Could not resume this investigation.");
    }
  };

  const removeSavedMystery = async (id) => {
    if (!window.confirm("Permanently delete this investigation? This cannot be undone.")) return;
    setDeletingId(id);
    setCaseError("");
    try {
      await mysteryAPI.delete(id);
      setSavedMysteries((items) => items.filter((item) => item.id !== id));
      if (window.localStorage.getItem(lastMysteryStorageKey) === id) {
        window.localStorage.removeItem(lastMysteryStorageKey);
      }
    } catch (err) {
      setCaseError(err.message || "Could not delete this investigation.");
    } finally {
      setDeletingId("");
    }
  };

  const selectedDifficulty =
    difficulties.find((item) => item.name === difficulty) || difficulties[1];

  const startGeneration = async () => {
    setError("");

    if (story.trim().length < 20) {
      setError("Please enter at least 20 characters for your mystery premise.");
      return;
    }

    setIsGenerating(true);
    setPage("loading");

    try {
      const response = await mysteryAPI.create(story.trim(), difficulty);

      if (!response.mystery?.id) {
        throw new Error("The API did not return a valid mystery.");
      }

      setMystery(response.mystery);
      setResult(null);
      window.localStorage.setItem(lastMysteryStorageKey, response.mystery.id);
      setPage("investigation");
    } catch (err) {
      setError(err.message || "Unable to generate your mystery.");
      setPage("create");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAccusation = (apiResult) => {
    if (mystery?.id) window.localStorage.removeItem(lastMysteryStorageKey);
    setResult(apiResult);
    setPage("results");
  };

  const resetToCreate = () => {
    window.localStorage.removeItem(lastMysteryStorageKey);
    setMystery(null);
    setResult(null);
    setError("");
    setStory("");
    setPage("create");
  };

  return (
    <div className="min-h-screen bg-[#090b10] text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#090b10]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
          <button onClick={() => setPage("home")} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">
              <Fingerprint size={23} />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Mystery<span className="text-violet-400">Room</span>
            </span>
          </button>

          <nav className="hidden items-center gap-8 text-sm text-gray-400 md:flex">
            <button onClick={() => setPage("home")} className="hover:text-white">Home</button>
            <a href="#cases" className="hover:text-white">Explore</a>
            <a href="#how-it-works" className="hover:text-white">How it works</a>
          </nav>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <div className="hidden text-right lg:block">
              <p className="text-xs text-gray-500">SIGNED IN</p>
              <p className="max-w-40 truncate text-sm font-medium text-gray-200">{user?.user_metadata?.full_name || user?.email}</p>
            </div>
            <button onClick={loadSavedMysteries} aria-label="My investigations" className="rounded-xl border border-white/10 px-2.5 py-2.5 text-xs text-gray-300 transition hover:border-violet-400/50 hover:text-white sm:px-3 sm:text-sm">My Cases</button>
            <button onClick={onSignOut} className="rounded-xl border border-white/10 px-2.5 py-2.5 text-xs text-gray-300 transition hover:border-violet-400/50 hover:text-white sm:px-3 sm:text-sm">
              Sign out
            </button>
            <button
              onClick={resetToCreate}
              className="rounded-xl bg-violet-600 px-3 py-2.5 text-xs font-semibold transition hover:bg-violet-500 sm:px-4 sm:text-sm"
            >
              Create <Plus className="ml-1 inline" size={15} />
            </button>
          </div>
        </div>
      </header>

      {page === "home" ? (
        <main>
          <section className="relative overflow-hidden">
            <div className="pointer-events-none absolute left-1/2 top-10 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-700/20 blur-[120px]" />
            <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 md:grid-cols-2 md:py-32">
              <div>
                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-xs font-semibold tracking-widest text-violet-300">
                  <Sparkles size={14} /> AI-POWERED MYSTERY EXPERIENCE
                </div>
                <h1 className="max-w-2xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
                  Every clue tells a story.
                  <span className="block text-violet-400">Find the truth.</span>
                </h1>
                <p className="mt-7 max-w-lg text-lg leading-8 text-gray-400">
                  Step into an interactive investigation. Discover hidden clues,
                  examine suspects, and solve mysteries generated by AI.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <button
                    onClick={resetToCreate}
                    className="rounded-xl bg-violet-600 px-7 py-4 font-semibold transition hover:bg-violet-500"
                  >
                    Create a Mystery <ChevronRight className="ml-2 inline" size={18} />
                  </button>
                  <a href="#cases" className="rounded-xl border border-white/15 px-7 py-4 font-semibold transition hover:bg-white/5">
                    Explore Features
                  </a>
                </div>
                <div className="mt-12 flex gap-10 text-sm">
                  <div><p className="text-2xl font-bold">AI</p><p className="mt-1 text-gray-500">Generated stories</p></div>
                  <div><p className="text-2xl font-bold">3</p><p className="mt-1 text-gray-500">Difficulty levels</p></div>
                  <div><p className="text-2xl font-bold">∞</p><p className="mt-1 text-gray-500">Possibilities</p></div>
                </div>
              </div>

              <div className="relative">
                <div className="rounded-3xl border border-violet-400/20 bg-gradient-to-br from-[#201638] via-[#151326] to-[#10131c] p-8 shadow-2xl shadow-violet-950/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-[0.2em] text-violet-300">CLASSIFIED CASE FILE</span>
                    <Lock size={17} className="text-violet-300" />
                  </div>
                  <div className="my-10 flex items-center justify-center">
                    <div className="flex h-48 w-48 items-center justify-center rounded-full border border-violet-400/30 bg-violet-500/10">
                      <div className="flex h-32 w-32 items-center justify-center rounded-full border border-violet-400/30 bg-violet-500/10">
                        <Fingerprint size={75} strokeWidth={1} className="text-violet-300" />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs tracking-widest text-gray-500">LIVE AI CASE GENERATION</p>
                  <h2 className="mt-2 text-2xl font-bold">Your next mystery</h2>
                  <p className="mt-3 leading-7 text-gray-400">A unique case, generated from your premise and difficulty selection.</p>
                  <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5 text-sm text-gray-400">
                    <span className="flex items-center gap-2"><Eye size={16} /> AI suspects</span>
                    <span className="flex items-center gap-2"><FileText size={16} /> AI clues</span>
                    <span className="flex items-center gap-2"><Clock3 size={16} /> Live case</span>
                  </div>
                </div>
                <div className="absolute -bottom-5 -right-4 rounded-xl border border-white/10 bg-[#171522] px-5 py-3 text-sm shadow-xl">
                  <span className="text-violet-300">✦</span> Your investigation begins here
                </div>
              </div>
            </div>
          </section>

          <section id="cases" className="border-t border-white/10 bg-[#0d1018] px-6 py-24">
            <div className="mx-auto max-w-7xl">
              <div className="mb-12">
                <p className="text-sm font-semibold tracking-widest text-violet-400">INVESTIGATE</p>
                <h2 className="mt-3 text-3xl font-bold md:text-4xl">MysteryRoom features</h2>
                <p className="mt-3 text-gray-400">A real AI-powered investigation backed by your database.</p>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {cases.map((item) => (
                  <article key={item.title} className="rounded-2xl border border-white/10 bg-[#141823] p-7 transition hover:-translate-y-1 hover:border-violet-400/40">
                    <div className="flex items-start justify-between">
                      <span className="text-5xl">{item.icon}</span>
                      <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300">{item.difficulty}</span>
                    </div>
                    <p className="mt-7 text-xs font-bold tracking-widest text-violet-400">{item.category}</p>
                    <h3 className="mt-2 text-2xl font-bold">{item.title}</h3>
                    <p className="mt-3 leading-7 text-gray-400">{item.description}</p>
                    <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5 text-sm text-gray-500">
                      <span>{item.time}</span>
                      <button onClick={resetToCreate} className="font-semibold text-violet-300 hover:text-white">
                        Start <ChevronRight className="ml-1 inline" size={16} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-24">
            <div className="text-center">
              <p className="text-sm font-semibold tracking-widest text-violet-400">THE PROCESS</p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">How it works</h2>
            </div>
            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {[
                { icon: <Sparkles />, title: "Create a Mystery", text: "Choose a story premise and difficulty level." },
                { icon: <Search />, title: "Investigate", text: "Explore AI-generated suspects, discover clues, and reveal hints." },
                { icon: <Brain />, title: "Solve the Case", text: "Submit your accusation and receive the backend-verified result." },
              ].map((step, index) => (
                <div key={step.title} className="rounded-2xl border border-white/10 bg-[#121620] p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">{step.icon}</div>
                  <p className="mt-7 text-sm text-violet-400">STEP 0{index + 1}</p>
                  <h3 className="mt-2 text-xl font-bold">{step.title}</h3>
                  <p className="mt-3 leading-7 text-gray-400">{step.text}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      ) : page === "loading" ? (
        <main className="flex min-h-[75vh] flex-col items-center justify-center px-6 text-center">
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-violet-400/30 bg-violet-500/10">
            <Fingerprint size={65} className="animate-pulse text-violet-300" />
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-violet-400" />
          </div>
          <p className="mt-10 text-sm font-bold tracking-[0.25em] text-violet-400">AI INVESTIGATION SYSTEM</p>
          <h1 className="mt-4 text-3xl font-bold">Preparing your mystery...</h1>
          <p className="mt-4 max-w-md leading-7 text-gray-400">Gemini is generating your case, suspects, clues, hints, and hidden solution.</p>
          <div className="mt-8 h-1.5 w-64 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-full origin-left animate-pulse rounded-full bg-violet-500" />
          </div>
          <p className="mt-4 text-xs text-gray-500">PLEASE WAIT · GENERATING CASE FILE</p>
        </main>
      ) : page === "cases" ? (
        <main className="mx-auto max-w-7xl px-6 py-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold tracking-widest text-violet-400">YOUR CASE ARCHIVE</p>
              <h1 className="mt-3 text-4xl font-bold">My Investigations</h1>
              <p className="mt-3 text-gray-400">Resume active cases or review completed investigations.</p>
            </div>
            <button onClick={resetToCreate} className="rounded-xl bg-violet-600 px-5 py-3 font-semibold hover:bg-violet-500">Create Mystery</button>
          </div>
          {caseError && <div role="alert" className="mt-6 rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">{caseError}</div>}
          {isLoadingCases ? <p className="mt-10 text-gray-400">Loading your investigations...</p> : savedMysteries.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-white/10 bg-[#131722] p-10 text-center">
              <Fingerprint className="mx-auto text-violet-300" size={42} />
              <h2 className="mt-4 text-xl font-bold">No saved investigations yet</h2>
              <p className="mt-2 text-gray-400">Create your first mystery and it will appear here.</p>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {savedMysteries.map((item) => (
                <article key={item.id} className="rounded-2xl border border-white/10 bg-[#131722] p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300">{item.difficulty}</span>
                    <span className={`text-xs font-semibold ${item.status === "completed" ? "text-emerald-300" : "text-amber-300"}`}>{item.status === "completed" ? "Completed" : "In progress"}</span>
                  </div>
                  <h2 className="mt-5 text-xl font-bold">{item.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-400">{item.premise}</p>
                  <div className="mt-5 flex flex-wrap gap-4 text-xs text-gray-500">
                    <span>{(item.discoveredClueIds || []).length} clues found</span>
                    <span>{(item.revealedHintIndexes || []).length} hints used</span>
                    {item.finalScore !== null && <span>Score: {item.finalScore}</span>}
                  </div>
                  <div className="mt-6 flex gap-2">
                    <button disabled={item.status === "completed"} onClick={() => resumeMystery(item.id)} className="flex-1 rounded-lg bg-violet-600 px-3 py-2.5 text-sm font-semibold hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40">Resume</button>
                    <button onClick={() => removeSavedMystery(item.id)} disabled={deletingId === item.id} className="rounded-lg border border-red-400/20 px-3 py-2.5 text-sm text-red-300 hover:bg-red-500/10 disabled:opacity-50">{deletingId === item.id ? "Deleting..." : "Delete"}</button>
                  </div>
                  {item.status === "completed" && <p className="mt-3 text-xs text-gray-500">This case has already been submitted.</p>}
                </article>
              ))}
            </div>
          )}
        </main>
      ) : page === "investigation" && mystery ? (
        <InvestigationRoom
          mystery={mystery}
          onBack={() => setPage("home")}
          onAccuse={handleAccusation}
        />
      ) : page === "results" && result ? (
        <main className="mx-auto max-w-4xl px-6 py-16">
          <div className="rounded-3xl border border-violet-400/20 bg-gradient-to-br from-[#201638] to-[#10131c] p-8 text-center md:p-12">
            <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full border text-4xl ${result.isCorrect ? "border-emerald-400/30 bg-emerald-500/10" : "border-red-400/30 bg-red-500/10"}`}>
              {result.isCorrect ? "✓" : "✕"}
            </div>
            <p className="mt-7 text-xs font-bold tracking-[0.25em] text-violet-300">CASE REVIEW COMPLETE</p>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">Investigation Results</h1>
            <p className="mt-4 text-gray-400">
              {result.isCorrect ? "Excellent detective work. You identified the culprit." : "Your accusation was incorrect. Review the case explanation below."}
            </p>

            <div className="mt-8 rounded-2xl border border-white/10 bg-[#0b0e16] p-6 text-left">
              <p className="text-xs font-bold tracking-widest text-gray-500">YOUR ACCUSATION</p>
              <p className="mt-2 text-xl font-bold">{result.accusedSuspect?.name || "Selected suspect"}</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div><p className="text-xs text-gray-500">Final score</p><p className="mt-1 text-3xl font-bold text-violet-300">{result.finalScore}</p></div>
                <div><p className="text-xs text-gray-500">Correct accusation</p><p className={`mt-1 text-xl font-bold ${result.isCorrect ? "text-emerald-300" : "text-red-300"}`}>{result.isCorrect ? "Yes" : "No"}</p></div>
                <div><p className="text-xs text-gray-500">Clues discovered</p><p className="mt-1 font-bold">{result.cluesDiscovered}</p></div>
                <div><p className="text-xs text-gray-500">Hints used</p><p className="mt-1 font-bold">{result.hintsUsed}</p></div>
              </div>
              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-xs font-bold tracking-widest text-violet-300">THE ACTUAL CULPRIT</p>
                <p className="mt-2 text-xl font-bold">{result.culprit?.name || "Not provided"}</p>
                <p className="mt-4 text-xs font-bold tracking-widest text-gray-500">CASE EXPLANATION</p>
                <p className="mt-2 leading-7 text-gray-300">{result.explanation || "No explanation was returned."}</p>
                {result.method && (
                  <>
                    <p className="mt-4 text-xs font-bold tracking-widest text-gray-500">METHOD</p>
                    <p className="mt-2 leading-7 text-gray-300">{result.method}</p>
                  </>
                )}
              </div>
              <div className="mt-6 border-t border-white/10 pt-5 text-sm text-gray-400">
                <p>Base points: {result.basePoints}</p>
                <p className="mt-1">Clue bonus: +{result.clueBonus}</p>
                <p className="mt-1">Hint penalty: −{result.hintPenalty}</p>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button onClick={resetToCreate} className="rounded-xl bg-violet-600 px-6 py-3 font-semibold transition hover:bg-violet-500">Create Another Mystery</button>
              <button onClick={() => { setMystery(null); setResult(null); setPage("home"); }} className="rounded-xl border border-white/15 px-6 py-3 font-semibold text-gray-300 transition hover:bg-white/5">Back to Home</button>
            </div>
          </div>
        </main>
      ) : (
        <main className="mx-auto max-w-4xl px-6 py-16">
          <button onClick={() => { setError(""); setPage("home"); }} className="mb-10 flex items-center gap-2 text-sm text-gray-400 hover:text-white">
            <ArrowLeft size={17} /> Back to Home
          </button>
          <div className="mb-10">
            <p className="text-sm font-bold tracking-widest text-violet-400">NEW INVESTIGATION</p>
            <h1 className="mt-3 text-4xl font-bold md:text-5xl">Create your Mystery</h1>
            <p className="mt-4 leading-7 text-gray-400">Set the scene. Choose your challenge. Let the investigation begin.</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#131722] p-7 md:p-9">
            <label className="text-lg font-semibold">Your mystery premise</label>
            <p className="mt-2 text-sm text-gray-500">Describe the mystery you want Gemini to generate.</p>
            <textarea
              value={story}
              onChange={(event) => setStory(event.target.value)}
              placeholder="Example: A famous painting disappears from a locked museum during a private event..."
              className="mt-5 min-h-40 w-full resize-y rounded-xl border border-white/10 bg-[#0b0e16] p-5 text-white outline-none placeholder:text-gray-600 focus:border-violet-500"
            />

            <div className="mt-10">
              <h2 className="text-lg font-semibold">Select difficulty</h2>
              <p className="mt-2 text-sm text-gray-500">Choose how challenging your investigation will be.</p>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {difficulties.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setDifficulty(item.name)}
                    className={`rounded-xl border p-5 text-left transition ${difficulty === item.name ? "border-violet-500 bg-violet-500/10" : "border-white/10 bg-[#0b0e16] hover:border-white/30"}`}
                  >
                    <span className="text-lg font-bold">{item.name}</span>
                    <p className="mt-3 text-sm text-gray-400">{item.suspects} suspects</p>
                    <p className="mt-1 text-sm text-gray-400">{item.clues} clues</p>
                    <p className="mt-1 text-sm text-gray-400">{item.hints} hints</p>
                    <p className="mt-4 font-semibold text-violet-300">{item.points} base points</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-violet-400/20 bg-violet-500/5 p-5">
              <p className="text-sm font-semibold text-violet-300">INVESTIGATION SUMMARY</p>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                <div><p className="text-gray-500">Difficulty</p><p className="mt-1 font-bold">{selectedDifficulty.name}</p></div>
                <div><p className="text-gray-500">Suspects</p><p className="mt-1 font-bold">{selectedDifficulty.suspects}</p></div>
                <div><p className="text-gray-500">Clues</p><p className="mt-1 font-bold">{selectedDifficulty.clues}</p></div>
                <div><p className="text-gray-500">Base score</p><p className="mt-1 font-bold">{selectedDifficulty.points}</p></div>
              </div>
            </div>

            {error && (
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
                <AlertCircle size={18} className="mt-0.5 shrink-0" /> {error}
              </div>
            )}

            <button
              onClick={startGeneration}
              disabled={isGenerating || story.trim().length < 20}
              className="mt-8 w-full rounded-xl bg-violet-600 py-4 font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Sparkles className="mr-2 inline" size={18} /> Generate Mystery
            </button>
          </div>
        </main>
      )}

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-gray-500">
        <p>© 2026 MysteryRoom · Every clue tells a story.</p>
        <p className="mt-2">An AI-powered detective experience.</p>
      </footer>
    </div>
  );
}

export default MysteryApp;
