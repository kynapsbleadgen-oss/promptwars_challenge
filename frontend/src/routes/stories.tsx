import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Compass, BookOpen, Clock, MapPin, ArrowRight, Loader2 } from "lucide-react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { api } from "@/lib/api";
import { unsplashUrl } from "@/lib/image-utils";

export const Route = createFileRoute("/stories")({
  component: StoriesPage,
});

type Trip = {
  _id: string;
  title: string;
  location: string;
  intro: string;
  interests: string[];
  destinations: { name: string; region: string; culturalSignificance: string; imageQuery: string }[];
  createdAt: string;
};

function StoriesPage() {
  const { data, isLoading } = useQuery<{ items: Trip[] }>({
    queryKey: ["trips-stories"],
    queryFn: () => api<{ items: Trip[] }>("/trips?limit=12&status=published"),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const trips = data?.items ?? [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />

      <main className="mx-auto max-w-4xl px-6 py-16 lg:py-24">
        {/* Header */}
        <div className="mb-20 text-center space-y-4">
          <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-gold-ink font-sans">
            The Journal
          </span>
          <h1 className="font-serif text-5xl lg:text-6xl tracking-tight">
            Field Stories
          </h1>
          <p className="mx-auto max-w-md text-sm text-muted-foreground leading-relaxed">
            Cultural dispatches from our community — real journeys, real places, curated by AI.
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-gold-ink" />
          </div>
        )}

        {!isLoading && trips.length === 0 && (
          <div className="py-24 text-center space-y-4">
            <Compass className="mx-auto h-10 w-10 text-muted-foreground/30" strokeWidth={1} />
            <p className="text-sm text-muted-foreground">
              No stories published yet.{" "}
              <Link to="/discover" className="text-gold-ink hover:text-foreground">
                Create the first journey →
              </Link>
            </p>
          </div>
        )}

        {!isLoading && trips.length > 0 && (
          <div className="space-y-28">
            {trips.map((trip) => {
              const firstDest = trip.destinations?.[0];
              return (
                <article key={trip._id} className="space-y-6">
                  {/* Cover Image */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                    {firstDest?.imageQuery ? (
                      <img
                        src={unsplashUrl(firstDest.imageQuery, 1600, 900)}
                        alt={trip.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[1500ms] hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Compass className="h-10 w-10 text-muted-foreground/30" strokeWidth={1} />
                      </div>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-[10px] text-muted-foreground uppercase tracking-wider font-sans border-b border-border/60 pb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gold-ink" />
                      {trip.location}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-border" />
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(trip.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    {trip.destinations.length > 0 && (
                      <>
                        <span className="h-1.5 w-1.5 rounded-full bg-border" />
                        <span>{trip.destinations.length} destination{trip.destinations.length !== 1 ? "s" : ""}</span>
                      </>
                    )}
                  </div>

                  {/* Title & Body */}
                  <div className="space-y-4">
                    <h2 className="font-serif text-3xl lg:text-4xl leading-tight">
                      {trip.title}
                    </h2>
                    {trip.intro && (
                      <p className="font-serif text-lg italic text-muted-foreground">
                        "{trip.intro}"
                      </p>
                    )}
                    {firstDest?.culturalSignificance && (
                      <p className="text-base leading-relaxed text-muted-foreground pt-2">
                        {firstDest.culturalSignificance}
                      </p>
                    )}
                    {trip.interests.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {trip.interests.map((i) => (
                          <span key={i} className="border border-border/60 px-2.5 py-1 text-[10px] text-muted-foreground uppercase tracking-widest">
                            {i}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <Link
                      to="/trips/$id"
                      params={{ id: trip._id }}
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-ink hover:text-foreground transition-colors"
                    >
                      <BookOpen className="h-4 w-4" strokeWidth={1.5} />
                      Read Full Story
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
