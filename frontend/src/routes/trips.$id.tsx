import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MapPin, ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { tripApi } from "@/api/tripApi";
import { extractErrorMessage } from "@/api/client";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { unsplashUrl } from "@/lib/image-utils";
import { MetaRow } from "@/components/shared/MetaRow";
import { useState } from "react";

export const Route = createFileRoute("/trips/$id")({
  component: TripDetailPage,
});

type Destination = {
  name: string;
  region: string;
  culturalSignificance: string;
  bestSeason: string;
  estimatedBudget: string;
  suggestedDuration: string;
  localEtiquette: string;
  transportationTip: string;
  imageQuery: string;
};

type HiddenGem = {
  name: string;
  category: string;
  whySpecial: string;
  localStory: string;
  bestTimeToVisit: string;
  visitingTip: string;
  difficulty: string;
  imageQuery: string;
};

type Trip = {
  _id: string;
  title: string;
  location: string;
  interests: string[];
  duration: string;
  budget: string;
  intro: string;
  destinations: Destination[];
  hiddenGems: HiddenGem[];
  status: string;
  notes: string;
  tags: string[];
  createdAt: string;
};

function TripDetailPage() {
  const { id } = Route.useParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const { data: trip, isLoading, error } = useQuery<Trip>({
    queryKey: ["trip", id],
    queryFn: () => tripApi.get(id),
    enabled: isAuthenticated,
  });

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-gold-ink" />
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate({ to: "/login" });
    return null;
  }

  async function handleDelete() {
    if (!confirm("Delete this trip? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await tripApi.delete(id);
      toast.success("Trip deleted.");
      navigate({ to: "/dashboard" });
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err, "Delete failed"));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      <Nav />

      <main className="mx-auto max-w-6xl px-6 py-16">
        <Link
          to="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          Back to journeys
        </Link>

        {isLoading && (
          <div className="space-y-8">
            <div className="h-8 w-2/3 animate-pulse bg-muted" />
            <div className="h-4 w-1/3 animate-pulse bg-muted" />
            <div className="h-32 w-full animate-pulse bg-muted" />
          </div>
        )}

        {error && (
          <div className="mt-16 text-center">
            <p className="text-muted-foreground">Failed to load trip. It may have been deleted.</p>
          </div>
        )}

        {trip && (
          <div className="space-y-20">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-border pb-8">
              <div>
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
                  <MapPin className="h-3 w-3" strokeWidth={1.5} />
                  {trip.location}
                </div>
                <h1 className="mt-2 font-serif text-4xl tracking-tight lg:text-5xl">
                  {trip.title}
                </h1>
                {trip.interests.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {trip.interests.map((i) => (
                      <span
                        key={i}
                        className="border border-border px-3 py-1 text-[11px] text-muted-foreground"
                      >
                        {i}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 border border-border px-4 py-2 text-xs text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>

            {/* Intro */}
            {trip.intro && (
              <div className="max-w-3xl">
                <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-gold-ink">
                  Your curated journey
                </span>
                <p className="mt-4 font-serif text-2xl leading-snug italic lg:text-3xl">
                  "{trip.intro}"
                </p>
              </div>
            )}

            {/* Destinations */}
            {trip.destinations.length > 0 && (
              <div>
                <div className="flex items-end justify-between border-b border-border pb-6">
                  <div>
                    <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-gold-ink">
                      Destinations
                    </span>
                    <h2 className="mt-2 font-serif text-3xl lg:text-4xl">
                      Places to Wander
                    </h2>
                  </div>
                </div>
                <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2">
                  {trip.destinations.map((d, idx) => (
                    <article key={idx} className="group space-y-5">
                      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                        <img
                          src={unsplashUrl(d.imageQuery)}
                          alt={d.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-[1500ms] group-hover:scale-[1.04]"
                        />
                        <span className="absolute left-3 top-3 bg-background/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] backdrop-blur">
                          №{String(idx + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
                            <MapPin className="h-3 w-3" strokeWidth={1.5} />
                            {d.region}
                          </div>
                          <h3 className="mt-1 font-serif text-2xl leading-tight">
                            {d.name}
                          </h3>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {d.culturalSignificance}
                        </p>
                        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-t border-border pt-4 text-[13px]">
                          <MetaRow label="Best season" value={d.bestSeason} />
                          <MetaRow label="Budget" value={d.estimatedBudget} />
                          <MetaRow label="Duration" value={d.suggestedDuration} />
                          <MetaRow label="Etiquette" value={d.localEtiquette} />
                        </dl>
                        <p className="text-xs italic text-muted-foreground">
                          Getting there — {d.transportationTip}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* Hidden Gems */}
            {trip.hiddenGems.length > 0 && (
              <div>
                <div className="flex items-end justify-between border-b border-border pb-6">
                  <div>
                    <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-gold-ink">
                      Hidden Gems
                    </span>
                    <h2 className="mt-2 font-serif text-3xl lg:text-4xl">
                      Places Only Locals Whisper About
                    </h2>
                  </div>
                </div>
                <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
                  {trip.hiddenGems.map((g, idx) => (
                    <article
                      key={idx}
                      className="group grid grid-cols-5 gap-6 border-t border-border pt-8"
                    >
                      <div className="col-span-2 aspect-[3/4] overflow-hidden bg-muted">
                        <img
                          src={unsplashUrl(g.imageQuery, 900, 1200)}
                          alt={g.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-[1500ms] group-hover:scale-[1.04]"
                        />
                      </div>
                      <div className="col-span-3 space-y-3">
                        <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-gold-ink">
                          {g.category}
                        </span>
                        <h3 className="font-serif text-2xl leading-tight">
                          {g.name}
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {g.whySpecial}
                        </p>
                        <blockquote className="border-l-2 border-[color:var(--gold)] pl-4 text-sm italic text-foreground/80">
                          {g.localStory}
                        </blockquote>
                        <div className="grid grid-cols-2 gap-4 pt-2 text-[12px]">
                          <MetaRow label="Best time" value={g.bestTimeToVisit} />
                          <MetaRow label="Difficulty" value={g.difficulty} />
                        </div>
                        <p className="text-xs italic text-muted-foreground">
                          Tip — {g.visitingTip}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
