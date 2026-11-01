import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Eye,
  FileText,
  Lightbulb,
  Lock,
  Search,
  Shield,
  UserRound,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";
import { mysteryAPI } from "../services/api";

const difficultySettings = {
  Easy: { suspects: 3, clues: 5, hints: 2, points: 100 },
  Medium: { suspects: 4, clues: 7, hints: 3, points: 150 },
  Hard: { suspects: 5, clues: 9, hints: 3, points: 200 },
};

export default function InvestigationRoom({ mystery, onAccuse, onBack }) {
  const settings = difficultySettings[mystery.difficulty] || difficultySettings.Medium;
  const [activeTab, setActiveTab] = useState("clues");
  const [discoveredClueIds, setDiscoveredClueIds] = useState(mystery.discoveredClueIds || []);
  const [clueDetails, setClueDetails] = useState(mystery.clues || []);
  const [revealedHints, setRevealedHints] = useState(mystery.revealedHints || []);
  const [selectedSuspect, setSelectedSuspect] = useState(null);
  const [busyAction, setBusyAction] = useState("");
  const [error, setError] = useState("");

  const suspects = useMemo(() => mystery.suspects || [], [mystery.suspects]);
  const clues = useMemo(() => clueDetails, [clueDetails]);
  const score = Math.max(0, (mystery.basePoints || settings.points) + discoveredClueIds.length * 5 - revealedHints.length * 10);
  const hintsRemaining = Math.max(0, settings.hints - revealedHints.length);

  const discoverClue = async (clue) => {
    if (discoveredClueIds.includes(clue.id) || busyAction) return;
    setBusyAction(`clue:${clue.id}`);
    setError("");

    try {
      const response = await mysteryAPI.discoverClue(mystery.id, clue.id);
      setDiscoveredClueIds(response.discoveredClueIds || [...discoveredClueIds, clue.id]);
      setClueDetails((previous) =>
        previous.map((item) => item.id === clue.id ? response.clue : item)
      );
    } catch (err) {
      setError(err.message || "Could not discover this clue.");
    } finally {
      setBusyAction("");
    }
  };

  const revealHint = async () => {
    if (hintsRemaining <= 0 || busyAction) return;
    setBusyAction("hint");
    setError("");

    try {
      const response = await mysteryAPI.revealHint(mystery.id);
      setRevealedHints((previous) => [...previous, response.hint]);
    } catch (err) {
      setError(err.message || "Could not reveal the next hint.");
    } finally {
      setBusyAction("");
    }
  };

  const submitAccusation = async () => {
    if (selectedSuspect === null || busyAction) return;
    setBusyAction("accuse");
    setError("");

    try {
      const response = await mysteryAPI.accuse(mystery.id, selectedSuspect);
      onAccuse?.(response.result);
    } catch (err) {
      setError(err.message || "Could not submit your accusation.");
      setBusyAction("");
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-10 text-white md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div>
          <button onClick={onBack} className="mb-5 flex items-center gap-2 text-sm text-gray-400 hover:text-white">
            <ArrowLeft size={17} /> Exit investigation
          </button>
          <p className="text-xs font-bold tracking-[0.2em] text-violet-400">CLASSIFIED CASE FILE · {mystery.id.slice(0, 8).toUpperCase()}</p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">Investigation Room</h1>
          <p className="mt-3 text-sm text-gray-400">Examine the evidence. Connect the clues. Find the truth.</p>
        </div>
        <div className="rounded-2xl border border-violet-400/30 bg-violet-500/10 px-6 py-4">
          <p className="text-xs text-violet-300">CURRENT SCORE</p>
          <p className="mt-1 text-3xl font-bold">{score}</p>
          <p className="text-xs text-gray-400">Estimated score if correct</p>
        </div>
      </div>

      <section className="mt-8 rounded-2xl border border-violet-400/20 bg-gradient-to-r from-[#211638] to-[#131722] p-6 md:p-8">
        <div className="flex items-center gap-2 text-sm font-semibold text-violet-300"><Lock size={16} /> CASE BRIEFING</div>
        <h2 className="mt-4 text-xl font-bold">{mystery.title}</h2>
        <p className="mt-3 max-w-4xl leading-8 text-gray-300">{mystery.premise}</p>
        <div className="mt-6 flex flex-wrap gap-3 text-xs">
          <span className="rounded-lg bg-white/10 px-4 py-2">{mystery.difficulty} difficulty</span>
          <span className="rounded-lg bg-white/10 px-4 py-2">{mystery.basePoints} base points</span>
          <span className="rounded-lg bg-white/10 px-4 py-2">{suspects.length} suspects</span>
          <span className="rounded-lg bg-white/10 px-4 py-2">{clues.length} clues</span>
        </div>
      </section>

      <section className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Suspects", value: suspects.length, icon: <UserRound /> },
          { label: "Clues discovered", value: `${discoveredClueIds.length}/${clues.length}`, icon: <FileText /> },
          { label: "Hints remaining", value: hintsRemaining, icon: <Lightbulb /> },
          { label: "Investigation score", value: score, icon: <Shield /> },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-white/10 bg-[#131722] p-5">
            <div className="flex items-center justify-between text-violet-300">{item.icon}<span className="text-2xl font-bold">{item.value}</span></div>
            <p className="mt-4 text-xs text-gray-400">{item.label}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 rounded-2xl border border-white/10 bg-[#131722] p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-white">Investigation progress</p>
            <p className="mt-1 text-xs text-gray-500">Evidence examined: {discoveredClueIds.length} of {clues.length}</p>
          </div>
          <span className="text-sm font-bold text-violet-300">{clues.length ? Math.round((discoveredClueIds.length / clues.length) * 100) : 0}%</span>
        </div>
        <div
          className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-label="Clues discovered"
          aria-valuemin={0}
          aria-valuemax={clues.length}
          aria-valuenow={discoveredClueIds.length}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-400 transition-all duration-500"
            style={{ width: `${clues.length ? (discoveredClueIds.length / clues.length) * 100 : 0}%` }}
          />
        </div>
      </section>

      {error && (
        <div role="alert" className="mt-6 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
          <AlertCircle size={18} className="mt-0.5 shrink-0" /> {error}
        </div>
      )}

      <div className="mt-10 flex flex-wrap gap-3 border-b border-white/10 pb-4">
        {[
          { id: "clues", label: "Evidence & Clues", icon: <Search size={17} /> },
          { id: "suspects", label: "Suspects", icon: <UserRound size={17} /> },
          { id: "hints", label: "Hints", icon: <Lightbulb size={17} /> },
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${activeTab === tab.id ? "bg-violet-600 text-white" : "border border-white/10 text-gray-400 hover:bg-white/5 hover:text-white"}`}>
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      {activeTab === "clues" && (
        <section className="mt-8">
          <h2 className="text-2xl font-bold">Evidence Collection</h2>
          <p className="mt-2 text-sm text-gray-400">Discover evidence to earn 5 points per clue.</p>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {clues.map((clue, index) => {
              const discovered = discoveredClueIds.includes(clue.id);
              const loading = busyAction === `clue:${clue.id}`;
              return (
                <article key={clue.id} className="rounded-2xl border border-white/10 bg-[#131722] p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-widest text-violet-400">EVIDENCE {String(index + 1).padStart(2, "0")}</span>
                    {discovered ? <CheckCircle2 className="text-emerald-400" size={20} /> : <Lock className="text-gray-500" size={19} />}
                  </div>
                  <h3 className="mt-6 text-lg font-bold">{discovered ? clue.title : `Undiscovered Evidence ${index + 1}`}</h3>
                  <p className="mt-2 text-xs text-gray-500">{discovered ? clue.category : "Hidden evidence"}</p>
                  <p className="mt-4 min-h-16 text-sm leading-6 text-gray-400">
                    {discovered ? clue.description : "This evidence has not been examined yet. Discover it to reveal its details."}
                  </p>
                  <button
                    onClick={() => discoverClue(clue)}
                    disabled={discovered || Boolean(busyAction)}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold transition hover:bg-violet-500 disabled:bg-emerald-500/10 disabled:text-emerald-400"
                  >
                    {loading ? <><LoaderCircle size={16} className="animate-spin" /> Saving...</> : discovered ? <><Eye size={16} /> Discovered</> : <><Search size={16} /> Discover Clue</>}
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {activeTab === "suspects" && (
        <section className="mt-8">
          <h2 className="text-2xl font-bold">Suspect Profiles</h2>
          <p className="mt-2 text-sm text-gray-400">Review the people connected to this case.</p>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {suspects.map((suspect) => (
              <article key={suspect.id} className="rounded-2xl border border-white/10 bg-[#131722] p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-violet-500/10 text-3xl">🕵️</div>
                  <div>
                    <h3 className="font-bold">{suspect.name}</h3>
                    <p className="mt-1 text-xs text-violet-300">{suspect.role}</p>
                  </div>
                </div>
                <div className="mt-6 space-y-3 text-sm">
                  <p className="text-gray-400">{suspect.description}</p>
                  <div className="rounded-lg bg-white/5 p-3">
                    <p className="text-xs text-gray-500">Possible motive</p>
                    <p className="mt-1 font-medium">{suspect.motive}</p>
                  </div>
                  {suspect.age != null && <p className="text-xs text-gray-500">Age: {suspect.age}</p>}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === "hints" && (
        <section className="mt-8 max-w-3xl">
          <h2 className="text-2xl font-bold">Detective Hints</h2>
          <p className="mt-2 text-sm text-gray-400">Each hint costs 10 points. Use them carefully.</p>
          <div className="mt-6 rounded-2xl border border-violet-400/20 bg-violet-500/5 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3"><Lightbulb className="text-violet-300" size={23} /><span className="font-semibold">Hint system</span></div>
              <span className="text-sm text-violet-300">{hintsRemaining} remaining</span>
            </div>
            <button onClick={revealHint} disabled={hintsRemaining <= 0 || Boolean(busyAction)} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-4 font-semibold hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40">
              {busyAction === "hint" ? <><LoaderCircle size={17} className="animate-spin" /> Loading hint...</> : <><Lightbulb size={17} /> Reveal Next Hint (−10 points)</>}
            </button>
            <div className="mt-6 space-y-3">
              {revealedHints.map((hint) => (
                <div key={hint.index} className="rounded-xl border border-white/10 bg-[#0b0e16] p-5">
                  <p className="text-xs font-bold text-violet-300">HINT {hint.index + 1}</p>
                  <p className="mt-3 text-sm leading-7 text-gray-300">{hint.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mt-12 rounded-2xl border border-violet-400/20 bg-[#151323] p-7 md:flex md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold">Ready to solve the case?</h2>
          <p className="mt-2 text-sm text-gray-400">Review your evidence and select your suspect when you're ready.</p>
          <p className="mt-3 text-xs text-gray-500">{discoveredClueIds.length} clues discovered · {revealedHints.length} hints used</p>
        </div>
        <button onClick={() => setActiveTab("suspects")} className="mt-6 rounded-xl bg-violet-600 px-7 py-4 font-semibold hover:bg-violet-500 md:mt-0">
          Review Suspects <Eye size={17} className="ml-2 inline" />
        </button>
      </section>

      <section className="mt-6 rounded-2xl border border-white/10 bg-[#131722] p-7">
        <h2 className="text-xl font-bold">Make Your Accusation</h2>
        <p className="mt-2 text-sm text-gray-400">Who do you believe is responsible?</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {suspects.map((suspect) => (
            <button
              key={suspect.id}
              onClick={() => setSelectedSuspect(suspect.id)}
              className={`rounded-xl border p-4 text-left transition ${selectedSuspect === suspect.id ? "border-violet-500 bg-violet-500/10" : "border-white/10 bg-[#0b0e16] hover:border-white/30"}`}
            >
              <span className="font-semibold">{suspect.name}</span>
              <p className="mt-1 text-xs text-gray-500">{suspect.role}</p>
            </button>
          ))}
        </div>
        {selectedSuspect !== null && (
          <div className="mt-5 flex items-center gap-2 text-sm text-violet-300"><CheckCircle2 size={17} /> Suspect selected. Ready to submit your accusation.</div>
        )}
        <button onClick={submitAccusation} disabled={selectedSuspect === null || Boolean(busyAction)} className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-4 font-bold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40">
          {busyAction === "accuse" ? <><LoaderCircle size={18} className="animate-spin" /> Checking accusation...</> : "Submit Accusation"}
        </button>
        <div className="mt-4 flex items-start gap-2 text-xs leading-6 text-gray-500">
          <AlertCircle size={16} className="mt-1 shrink-0" />
          Your accusation is verified by the backend. The solution is returned only after submission.
        </div>
      </section>
    </main>
  );
}
