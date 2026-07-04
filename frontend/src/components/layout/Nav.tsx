import { Compass, User, LogOut, Settings } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { useState } from "react";

export function Nav() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    try {
      await logout();
      toast.success("Signed out successfully.");
      navigate({ to: "/" });
    } catch {
      toast.error("Failed to sign out.");
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <Compass className="h-4 w-4 text-gold-ink" strokeWidth={1.5} />
          <span className="font-serif text-xl tracking-tight">Wayfare</span>
        </Link>
        
        <nav className="hidden gap-8 text-[13px] font-medium text-muted-foreground md:flex">
          <Link to="/discover" className="hover:text-foreground">Discover</Link>
          <Link to="/hidden-gems" className="hover:text-foreground">Hidden Gems</Link>
          <Link to="/stories" className="hover:text-foreground">Stories</Link>
        </nav>

        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground hover:text-foreground focus:outline-none"
              >
                <span className="font-serif">{user.name.split(" ")[0]}</span>
                <User className="h-4 w-4" strokeWidth={1.5} />
              </button>
              
              {menuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 border border-border bg-card p-2 shadow-[0_8px_16px_-4px_rgba(0,0,0,0.08)] z-50">
                    <Link
                      to="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] hover:bg-[color:var(--gold-soft)]"
                    >
                      <Compass className="h-3.5 w-3.5" />
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] hover:bg-[color:var(--gold-soft)]"
                    >
                      <Settings className="h-3.5 w-3.5" />
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="text-[13px] font-medium text-muted-foreground hover:text-foreground"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
