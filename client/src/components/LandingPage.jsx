import {
  ArrowRight, BrainCircuit, Fingerprint, LockKeyhole,
  Search, ShieldCheck, Sparkles, Target, WandSparkles
} from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI-generated mysteries",
    description: "Turn a story premise into an original case with suspects, clues and hidden motives."
  },
  {
    icon: Search,
    title: "Investigate every detail",
    description: "Explore evidence, examine suspect profiles and reveal hints when you need them."
  },
  {
    icon: Target,
    title: "Make your accusation",
    description: "Connect the evidence, identify the culprit and see how your investigation scores."
  }
];

const steps = [
  ["01", "Create a case", "Choose a premise and difficulty to generate your mystery."],
  ["02", "Investigate", "Discover clues, study suspects and decide when to use hints."],
  ["03", "Solve it", "Submit your accusation and reveal the truth behind the case."]
];

export default function LandingPage({ onLogin, onGetStarted }) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#090b10] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_15%_10%,rgba(124,58,237,.18),transparent_35%),radial-gradient(ellipse_at_85%_55%,rgba(79,70,229,.13),transparent_32%)]" />

      <header className="relative z-10 border-b border-white/10 bg-[#090b10]/75 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="#home" className="flex items-center gap-3" aria-label="MysteryRoom home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 shadow-lg shadow-violet-950/50">
              <Fingerprint size={23} />
            </span>
            <span className="text-xl font-extrabold tracking-tight">
              Mystery<span className="text-violet-400">Room</span>
            </span>
          </a>

          <div className="hidden items-center gap-8 text-sm text-gray-400 md:flex">
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#how-it-works" className="transition hover:text-white">How it works</a>
            <a href="#about" className="transition hover:text-white">About</a>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={onLogin} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-white/5 hover:text-white">
              Log in
            </button>
            <button onClick={onGetStarted} className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold shadow-lg shadow-violet-950/40 transition hover:bg-violet-500">
              Get started
            </button>
          </div>
        </nav>
      </header>

      <section id="home" className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:py-28">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-4 py-2 text-xs font-bold tracking-[.16em] text-violet-200">
            <Sparkles size={14} /> AI-POWERED DETECTIVE EXPERIENCE
          </div>
          <h1 className="max-w-3xl text-5xl font-black leading-[1.06] tracking-tight sm:text-6xl lg:text-7xl">
            Every clue tells a story.
            <span className="mt-2 block bg-gradient-to-r from-violet-300 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Can you solve it?
            </span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-gray-400">
            Step into an AI-powered investigation room. Uncover evidence, question the suspects and solve original mysteries crafted around your choices.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button onClick={onGetStarted} className="inline-flex items-center justify-center gap-3 rounded-xl bg-violet-600 px-7 py-4 font-bold shadow-xl shadow-violet-950/40 transition hover:-translate-y-0.5 hover:bg-violet-500">
              Start investigating <ArrowRight size={19} />
            </button>
            <a href="#how-it-works" className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[.03] px-7 py-4 font-semibold text-gray-200 transition hover:bg-white/[.07]">
              Explore how it works
            </a>
          </div>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-500">
            <span className="inline-flex items-center gap-2"><ShieldCheck size={16} className="text-emerald-400" /> Secure accounts</span>
            <span className="inline-flex items-center gap-2"><WandSparkles size={16} className="text-violet-300" /> AI-generated cases</span>
            <span className="inline-flex items-center gap-2"><LockKeyhole size={16} className="text-violet-300" /> Saved progress</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-5 rounded-[2rem] bg-violet-600/15 blur-3xl" />
          <div className="relative rounded-[2rem] border border-violet-300/20 bg-gradient-to-br from-[#1b1b32] via-[#111522] to-[#0d1019] p-5 shadow-2xl shadow-black/50 sm:p-7">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <p className="text-xs font-bold tracking-[.2em] text-violet-300">CASE FILE / 001</p>
                <h2 className="mt-2 text-xl font-bold">The Midnight Gallery</h2>
              </div>
              <span className="rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">Unsolved</span>
            </div>
            <div className="my-6 rounded-2xl border border-white/10 bg-black/25 p-5">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300"><Fingerprint size={21}/></span>
                <div><p className="text-sm font-semibold">Investigation overview</p><p className="text-xs text-gray-500">Evidence collected · 03 / 07</p></div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[43%] rounded-full bg-gradient-to-r from-violet-500 to-indigo-400"/></div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/[.03] p-4"><p className="text-xs text-gray-500">Suspects</p><p className="mt-1 text-2xl font-black">04</p></div>
                <div className="rounded-xl border border-white/10 bg-white/[.03] p-4"><p className="text-xs text-gray-500">Clues found</p><p className="mt-1 text-2xl font-black">03</p></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.03] p-3"><span className="text-xl">🗝️</span><div className="min-w-0 flex-1"><p className="text-sm font-semibold">A key without fingerprints</p><p className="text-xs text-gray-500">Physical evidence</p></div><span className="text-emerald-300">✓</span></div>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.03] p-3"><span className="text-xl">🕰️</span><div className="min-w-0 flex-1"><p className="text-sm font-semibold">The clock stopped at 11:47</p><p className="text-xs text-gray-500">Timeline evidence</p></div><span className="text-emerald-300">✓</span></div>
            </div>
            <p className="mt-5 text-center text-xs tracking-wide text-gray-600">ILLUSTRATIVE CASE PREVIEW</p>
          </div>
        </div>
      </section>

      <section id="features" className="relative z-10 border-y border-white/10 bg-white/[.02] px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold tracking-[.22em] text-violet-300">YOUR INVESTIGATION STARTS HERE</p>
            <h2 className="mt-4 text-3xl font-black sm:text-4xl">Think like a detective</h2>
            <p className="mt-4 leading-7 text-gray-400">Everything you need to move from the first clue to the final reveal.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-2xl border border-white/10 bg-[#111522]/80 p-7 transition hover:-translate-y-1 hover:border-violet-400/30">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300"><Icon size={23}/></span>
                <h3 className="mt-6 text-lg font-bold">{title}</h3>
                <p className="mt-3 leading-7 text-gray-400">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="text-center">
          <p className="text-xs font-bold tracking-[.22em] text-violet-300">THREE STEPS TO THE TRUTH</p>
          <h2 className="mt-4 text-3xl font-black sm:text-4xl">How MysteryRoom works</h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map(([number, title, description]) => (
            <div key={number} className="rounded-2xl border border-white/10 bg-white/[.025] p-7">
              <p className="text-4xl font-black text-violet-400/70">{number}</p>
              <h3 className="mt-5 text-xl font-bold">{title}</h3>
              <p className="mt-3 leading-7 text-gray-400">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="relative z-10 px-5 pb-20 sm:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-950/60 to-[#111522] px-6 py-12 text-center sm:px-12">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600"><Fingerprint size={25}/></span>
          <h2 className="mt-5 text-3xl font-black">Ready to crack your first case?</h2>
          <p className="mt-4 max-w-xl leading-7 text-gray-400">Create your detective account and step into your own mystery investigation.</p>
          <button onClick={onGetStarted} className="mt-7 inline-flex items-center gap-3 rounded-xl bg-violet-600 px-7 py-4 font-bold transition hover:bg-violet-500">Create free account <ArrowRight size={18}/></button>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 px-5 py-7 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} MysteryRoom. Every clue matters.
      </footer>
    </main>
  );
}
