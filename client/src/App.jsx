import { useEffect, useState } from "react";
import MysteryApp from "./MysteryApp";
import AuthScreen from "./components/AuthScreen";
import LandingPage from "./components/LandingPage";
import { supabase } from "./lib/supabase";
import { LoaderCircle } from "lucide-react";

export default function App() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [authMode, setAuthMode] = useState(null);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) console.error("Session restore failed:", error.message);
      setSession(data.session);
      setChecking(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user) setAuthMode(null);
      setChecking(false);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090b10] text-violet-300">
        <div className="flex items-center gap-3">
          <LoaderCircle className="animate-spin" />
          Restoring your detective session...
        </div>
      </main>
    );
  }

  // Public visitors see the landing page first. Authentication is required
  // only when they choose to enter the investigation workspace.
  if (!session?.user) {
    if (authMode) {
      return (
        <AuthScreen
          initialMode={authMode}
          onBack={() => setAuthMode(null)}
        />
      );
    }

    return (
      <LandingPage
        onLogin={() => setAuthMode("login")}
        onGetStarted={() => setAuthMode("signup")}
      />
    );
  }

  return (
    <MysteryApp
      user={session.user}
      onSignOut={async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error("Sign out failed:", error.message);
      }}
    />
  );
}
