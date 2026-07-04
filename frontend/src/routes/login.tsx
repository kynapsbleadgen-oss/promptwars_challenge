import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Compass, Loader2, Eye, EyeOff, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

const DEMO_EMAIL = "demo@wayfare.dev";
const DEMO_PASSWORD = "demo1234";

function LoginPage() {
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  if (isAuthenticated) {
    navigate({ to: "/dashboard" });
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
      toast.success("Welcome back!");
      navigate({ to: "/dashboard" });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleDemoLogin() {
    setDemoLoading(true);
    try {
      // Try to login with demo credentials first
      await login(DEMO_EMAIL, DEMO_PASSWORD);
      toast.success("Welcome! You're exploring as Demo Traveller.");
      navigate({ to: "/dashboard" });
    } catch {
      // Demo account doesn't exist yet — auto-create it
      try {
        await register("Demo Traveller", DEMO_EMAIL, DEMO_PASSWORD);
        toast.success("Demo account created! Welcome to Wayfare.");
        navigate({ to: "/dashboard" });
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Demo login failed. Try again.");
      }
    } finally {
      setDemoLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Toaster />
      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-gold-ink" strokeWidth={1.5} />
            <span className="font-serif text-xl tracking-tight">Wayfare</span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="font-serif text-4xl tracking-tight">Welcome Back</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to continue your cultural journey.
            </p>
          </div>

          {/* Demo Login Banner */}
          <div className="mb-6 border border-[color:var(--gold)]/30 bg-[color:var(--gold-soft)] p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-4 w-4 text-gold-ink mt-0.5 shrink-0" strokeWidth={1.5} />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-foreground">Try without signing up</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Explore all features instantly with a demo account.
                </p>
              </div>
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={demoLoading}
                className="flex shrink-0 items-center gap-1.5 border border-[color:var(--gold)] bg-background px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-gold-ink transition-all hover:bg-[color:var(--gold)] hover:text-background disabled:opacity-60"
              >
                {demoLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3" strokeWidth={2} />
                )}
                {demoLoading ? "Loading…" : "Demo Login"}
              </button>
            </div>
          </div>

          <div className="relative mb-6 flex items-center gap-3">
            <div className="flex-1 border-t border-border/60" />
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              or sign in with your account
            </span>
            <div className="flex-1 border-t border-border/60" />
          </div>

          <form
            onSubmit={onSubmit}
            className="border border-border bg-card p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]"
          >
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-tighter text-muted-foreground">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border-b border-border bg-transparent py-3 text-sm placeholder:text-muted-foreground/50 focus:border-[color:var(--gold)] focus:outline-none"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-tighter text-muted-foreground">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border-b border-border bg-transparent py-3 pr-10 text-sm placeholder:text-muted-foreground/50 focus:border-[color:var(--gold)] focus:outline-none"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" strokeWidth={1.5} />
                    ) : (
                      <Eye className="h-4 w-4" strokeWidth={1.5} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 flex w-full items-center justify-center gap-3 bg-primary py-4 text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-gold-ink hover:text-foreground"
            >
              Create one
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
