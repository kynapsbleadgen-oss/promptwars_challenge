import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Compass, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
      if (email.trim() === "demo@wayfare.dev" && password === "demo1234") {
        try {
          await register("Demo Traveller", "demo@wayfare.dev", "demo1234");
          await login("demo@wayfare.dev", "demo1234");
          toast.success("Demo account created! Welcome to Wayfare.");
          navigate({ to: "/dashboard" });
          return;
        } catch {
          // ignore registration error and show original login error
        }
      }
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
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

          {/* Demo Credentials Box */}
          <div className="mb-6 border border-[color:var(--gold)]/30 bg-[color:var(--gold-soft)] p-4 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-ink">Demo Account</p>
            <div className="mt-2 flex flex-col gap-1 text-xs">
              <p>Email: <span className="font-mono bg-background/50 px-2 py-0.5 rounded border border-border select-all">demo@wayfare.dev</span></p>
              <p>Password: <span className="font-mono bg-background/50 px-2 py-0.5 rounded border border-border select-all">demo1234</span></p>
            </div>
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
