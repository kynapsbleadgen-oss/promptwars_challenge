import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Compass, Loader2, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { api } from "@/lib/api";
import { unsplashUrl } from "@/lib/image-utils";
import { MetaRow } from "@/components/shared/MetaRow";

export const Route = createFileRoute("/hidden-gems")({
  component: HiddenGemsPage,
});

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
  location: string;
  hiddenGems: HiddenGem[];
};

function HiddenGemsPage() {
  const [activeDifficulty, setActiveDifficulty] = useState<string>("All");

  const { data, isLoading } = useQuery<{ items: Trip[] }>({
    queryKey: ["trips-gems"],
    queryFn: () => api<{ items: Trip[] }>("/trips?limit=20&status=published"),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  // Flatten all hidden gems from all trips
  const allGems: (HiddenGem & { location: string; tripId: string })[] =
    (data?.items ?? []).flatMap((trip) =>
      (trip.hiddenGems ?? []).map((g) => ({
        ...g,
        location: trip.location,
        tripId: trip._id,
      }))
    );

  const filtered =
    activeDifficulty === "All"
      ? allGems
      : allGems.filter((g) => g.difficulty === activeDifficulty);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />

      <main className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="mb-16 border-b border-border pb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-gold-ink">
              Secret Spaces
            </span>
            <h1 className="mt-2 font-serif text-4xl tracking-tight lg:text-5xl">
              Hidden Gems
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              Curated local secrets discovered by our Wayfare community — places typical tourists overlook.
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            {["All", "Easy", "Moderate", "Hard"].map((diff) => (
              <button
                key={diff}
                onClick={() => setActiveDifficulty(diff)}
                className={
                  "px-4 py-2 text-xs border transition-all " +
                  (activeDifficulty === diff
                    ? "border-[color:var(--gold)] bg-[color:var(--gold-soft)] text-foreground font-semibold"
                    : "border-border hover:border-foreground/40 text-muted-foreground")
                }
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-gold-ink" />
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="py-24 text-center space-y-4">
            <Compass className="mx-auto h-10 w-10 text-muted-foreground/30" strokeWidth={1} />
            <p className="text-sm text-muted-foreground">
              No hidden gems discovered yet.{" "}
              <Link to="/discover" className="text-gold-ink hover:text-foreground">
                Create the first journey →
              </Link>
            </p>
          </div>
        )}

        {!isLoading && filtered.length > 0 && (
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {filtered.map((g, idx) => (
              <article
                key={`${g.tripId}-${idx}`}
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
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-gold-ink">
                      {g.category}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-border" />
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <MapPin className="h-2.5 w-2.5" />
                      {g.location}
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl leading-tight group-hover:text-gold-ink transition-colors">
                    {g.name}
                  </h2>
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
                  <Link
                    to="/trips/$id"
                    params={{ id: g.tripId }}
                    className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-gold-ink hover:text-foreground transition-colors mt-1"
                  >
                    View full trip
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
