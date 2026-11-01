import { useEffect, useState } from "react";
import {
  Fingerprint,
  Mail,
  LockKeyhole,
  Sparkles,
  LoaderCircle,
  ShieldCheck,
  ArrowLeft,
  Copy,
  Eye,
  EyeOff,
  UserRound,
  UserPlus,
  LogIn,
} from "lucide-react";
import { supabase } from "../lib/supabase";

// The demo account must be created once in Supabase Authentication > Users.
const DEMO_EMAIL = "demo@mysteryroom.app";
const DEMO_PASSWORD = "MysteryRoom@2026";

export default function AuthScreen({ initialMode = "login", onBack }) {
  const [mode, setMode] = useState(initialMode === "signup" ? "signup" : "login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(initialMode === "signup" ? "" : DEMO_EMAIL);
  const [password, setPassword] = useState(initialMode === "signup" ? "" : DEMO_PASSWORD);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const nextMode = initialMode === "signup" ? "signup" : "login";
    setMode(nextMode);
    setError("");
    setMessage("");
  }, [initialMode]);

  function switchMode(nextMode) {
    setMode(nextMode);
    setError("");
    setMessage("");
    if (nextMode === "signup") {
      setEmail("");
      setPassword("");
    } else {
      setEmail(DEMO_EMAIL);
      setPassword(DEMO_PASSWORD);
    }
    setConfirmPassword("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (mode === "signup") {
      if (fullName.trim().length < 2) {
        setError("Please enter your name (at least 2 characters).");
        return;
      }
      if (password.length < 8) {
        setError("Use a password with at least 8 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("The passwords do not match.");
        return;
      }
    }

    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: fullName.trim() },
            emailRedirectTo: window.location.origin,
          },
        });
        if (authError) throw authError;
        if (data.session) {
          setMessage("Account created. Opening your detective workspace...");
        } else {
          const registeredEmail = email.trim();
          switchMode("login");
          setEmail(registeredEmail);
          setPassword("");
          setMessage("Account created. Check your email to confirm your account, then sign in.");
        }
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (authError) throw authError;
      }
    } catch (err) {
      const rawMessage = err.message || "Authentication failed.";
      setError(
        rawMessage.toLowerCase().includes("invalid api key")
          ? "Supabase publishable key is invalid. Check client/.env and restart Vite."
          : rawMessage
      );
    } finally {
      setBusy(false);
    }
  }

  function useDemoCredentials() {
    switchMode("login");
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setMessage("Demo credentials filled. Select Enter Demo Room to continue.");
  }

  async function copyDemoCredentials() {
    try {
      await navigator.clipboard.writeText(`Email: ${DEMO_EMAIL}\nPassword: ${DEMO_PASSWORD}`);
      setMessage("Demo credentials copied.");
    } catch {
      setMessage(`Email: ${DEMO_EMAIL} | Password: ${DEMO_PASSWORD}`);
    }
  }

  const isSignup = mode === "signup";

  return (
    <main className="auth-shell flex min-h-screen items-center justify-center px-4 py-10 text-white">
      <div className="auth-glow pointer-events-none fixed inset-0" />
      <section className="auth-card relative z-10 w-full max-w-md rounded-3xl border border-violet-400/20 bg-[#111522]/95 p-7 shadow-2xl shadow-violet-950/30 sm:p-9">
        {onBack && (
          <button type="button" onClick={onBack} className="mb-5 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white">
            <ArrowLeft size={16} /> Back to home
          </button>
        )}

        <div className="mb-7 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 shadow-lg shadow-violet-900/40">
            <Fingerprint size={30} />
          </div>
          <p className="mt-5 text-xs font-bold tracking-[0.25em] text-violet-300">AI-POWERED DETECTIVE EXPERIENCE</p>
          <h1 className="mt-3 text-3xl font-bold">Mystery<span className="text-violet-400">Room</span></h1>
          <p className="mt-2 text-sm text-gray-400">
            {isSignup ? "Create your detective account." : "Welcome back, detective."}
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 rounded-xl border border-white/10 bg-[#090d16] p-1">
          <button type="button" onClick={() => switchMode("login")} className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold ${!isSignup ? "bg-violet-600 text-white" : "text-gray-400 hover:text-white"}`}>
            <LogIn size={16} /> Sign in
          </button>
          <button type="button" onClick={() => switchMode("signup")} className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold ${isSignup ? "bg-violet-600 text-white" : "text-gray-400 hover:text-white"}`}>
            <UserPlus size={16} /> Create account
          </button>
        </div>

        {!isSignup && (
          <div className="mb-5 rounded-2xl border border-violet-400/25 bg-violet-500/10 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold tracking-widest text-violet-200">DEMO ACCESS</p>
                <p className="mt-1 text-xs text-gray-400">For project evaluation and presentation</p>
              </div>
              <button type="button" onClick={copyDemoCredentials} className="rounded-lg border border-white/10 p-2 text-gray-300 hover:bg-white/10" title="Copy demo credentials">
                <Copy size={16} />
              </button>
            </div>
            <div className="mt-3 space-y-1.5 text-sm">
              <p><span className="text-gray-400">Email:</span> <span className="font-semibold text-white">{DEMO_EMAIL}</span></p>
              <p><span className="text-gray-400">Password:</span> <span className="font-semibold text-white">{DEMO_PASSWORD}</span></p>
            </div>
            <button type="button" onClick={useDemoCredentials} className="mt-3 w-full rounded-lg border border-violet-300/20 bg-violet-400/10 py-2 text-sm font-semibold text-violet-100 hover:bg-violet-400/20">
              Use demo credentials
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <label className="block text-sm text-gray-300">
              Full name
              <span className="mt-2 flex items-center gap-3 rounded-xl border border-white/10 bg-[#090d16] px-4 focus-within:border-violet-400/70">
                <UserRound size={18} className="text-gray-500" />
                <input value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="name" required minLength={2} maxLength={80} placeholder="Your name" className="w-full bg-transparent py-3.5 text-white outline-none placeholder:text-gray-600" />
              </span>
            </label>
          )}

          <label className="block text-sm text-gray-300">
            Email address
            <span className="mt-2 flex items-center gap-3 rounded-xl border border-white/10 bg-[#090d16] px-4 focus-within:border-violet-400/70">
              <Mail size={18} className="text-gray-500" />
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required maxLength={254} placeholder="you@example.com" className="w-full bg-transparent py-3.5 text-white outline-none placeholder:text-gray-600" />
            </span>
          </label>

          <label className="block text-sm text-gray-300">
            Password
            <span className="mt-2 flex items-center gap-3 rounded-xl border border-white/10 bg-[#090d16] px-4 focus-within:border-violet-400/70">
              <LockKeyhole size={18} className="text-gray-500" />
              <input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={isSignup ? "new-password" : "current-password"} required minLength={isSignup ? 8 : 1} placeholder={isSignup ? "At least 8 characters" : "Your password"} className="w-full bg-transparent py-3.5 text-white outline-none placeholder:text-gray-600" />
              <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="text-gray-500 hover:text-white" aria-label="Toggle password visibility">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
            </span>
          </label>

          {isSignup && (
            <label className="block text-sm text-gray-300">
              Confirm password
              <span className="mt-2 flex items-center gap-3 rounded-xl border border-white/10 bg-[#090d16] px-4 focus-within:border-violet-400/70">
                <ShieldCheck size={18} className="text-gray-500" />
                <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" required minLength={8} placeholder="Re-enter your password" className="w-full bg-transparent py-3.5 text-white outline-none placeholder:text-gray-600" />
              </span>
            </label>
          )}

          {error && <p role="alert" className="rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
          {message && <p role="status" className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">{message}</p>}

          <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-4 font-bold transition hover:bg-violet-500 disabled:opacity-50">
            {busy ? <LoaderCircle size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {busy ? "Please wait..." : isSignup ? "Create Detective Account" : "Enter Demo Room / Sign In"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
          <ShieldCheck size={15} className="text-emerald-400" /> Secure sign-in powered by Supabase Auth
        </div>
        {!isSignup && <p className="mt-3 text-center text-[11px] leading-5 text-gray-600">Create the demo user once in Supabase Authentication → Users. This shared demo account is for evaluation only.</p>}
      </section>
    </main>
  );
}
