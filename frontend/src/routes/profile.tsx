import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { userApi } from "@/api/userApi";
import { extractErrorMessage } from "@/api/client";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading, updateUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setBio(user.bio ?? "");
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-gold-ink" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    navigate({ to: "/login" });
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }
    if (!user) return;
    setSaving(true);
    try {
      const updated = await userApi.update(user._id, {
        name: name.trim(),
        bio: bio.trim(),
      });
      updateUser(updated);
      toast.success("Profile updated successfully.");
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, "Failed to update profile"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      <Nav />

      <main className="mx-auto max-w-2xl px-6 py-16 lg:py-20">
        <div className="mb-8 border-b border-border pb-6">
          <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-gold-ink">
            Settings
          </span>
          <h1 className="mt-2 font-serif text-4xl tracking-tight">Your Profile</h1>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-tighter text-muted-foreground">
              Email Address
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full border-b border-border/50 bg-transparent py-3 text-sm text-muted-foreground focus:outline-none cursor-not-allowed"
            />
            <p className="text-[11px] text-muted-foreground/60 italic">Email address cannot be changed.</p>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-tighter text-muted-foreground">
              Role
            </label>
            <input
              type="text"
              value={user.role.toUpperCase()}
              disabled
              className="w-full border-b border-border/50 bg-transparent py-3 text-sm text-muted-foreground focus:outline-none cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-tighter text-muted-foreground">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full border-b border-border bg-transparent py-3 text-sm placeholder:text-muted-foreground/50 focus:border-[color:var(--gold)] focus:outline-none"
              autoComplete="name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-tighter text-muted-foreground">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
              className="w-full border border-border bg-transparent p-3 text-sm placeholder:text-muted-foreground/50 focus:border-[color:var(--gold)] focus:outline-none"
              maxLength={500}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-3 bg-primary py-4 px-8 text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-70"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
