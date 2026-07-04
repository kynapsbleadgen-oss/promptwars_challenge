import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MapPin, ArrowRight, Compass, Loader2 } from "lucide-react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { api } from "@/lib/api";
import { unsplashUrl } from "@/lib/image-utils";
import heroImg from "@/assets/hero-medina.jpg";
import kyotoImg from "@/assets/texture-kyoto.jpg";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

type Trip = {
  _id: string;
  title: string;
  location: string;
  intro: string;
  interests: string[];
  destinations: { name: string; imageQuery: string }[];
};

function LandingPage() {
  const { data } = useQuery<{ items: Trip[] }>({
    queryKey: ["public-trips"],
    queryFn: () => api<{ items: Trip[] }>("/trips?limit=4&status=published"),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const liveTrips = data?.items ?? [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/60 py-24 lg:py-36">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `url(${heroImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-6 text-center space-y-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--gold)]/25 bg-[color:var(--gold-soft)] px-3 py-1">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[color:var(--gold)]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-gold-ink font-sans">
              Powered by Gemini AI
            </span>
          </span>

          <h1 className="font-serif text-5xl leading-[1.05] tracking-tight lg:text-7xl xl:text-8xl">
            Travel, <br />
            <span className="italic text-gold-ink">considered.</span>
          </h1>

          <p className="mx-auto max-w-xl text-lg font-light leading-relaxed text-muted-foreground">
            Escape the tourist traps. Wayfare synthesizes centuries of cultural
            heritage and local history to curate journeys worth remembering.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4 flex-wrap">
            <Link
              to="/discover"
              className="inline-flex items-center gap-3 bg-primary px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-all hover:bg-primary/90"
            >
              Start Discovery
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-3 border border-border px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-all hover:border-foreground hover:text-foreground"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="mx-auto max-w-5xl px-6 py-24 lg:py-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 space-y-6">
            <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-gold-ink">
              Our Philosophy
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl">
              Every destination has a <span className="italic">deeper story</span> waiting.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We believe travel is not about checking sights off a list, but about understanding
              the soil you walk on. Wayfare draws on local rituals, hidden artisan workshops, and
              the small neighborhoods tourists overlook to create personal itineraries of substance.
            </p>
            <Link
              to="/discover"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-ink hover:text-foreground transition-colors"
            >
              Start your journey
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="md:col-span-5 relative aspect-[4/5] overflow-hidden bg-muted">
            <img
              src={kyotoImg}
              alt="Kyoto backstreet lanterns"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Live Community Journeys */}
      <section className="border-t border-border/60 bg-card py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 border-b border-border pb-6 flex items-end justify-between">
            <div>
              <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-gold-ink">
                Community
              </span>
              <h2 className="mt-2 font-serif text-3xl lg:text-4xl">
                Recent Journeys
              </h2>
            </div>
            <Link
              to="/discover"
              className="group flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              Create yours
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {liveTrips.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <Compass className="mx-auto h-10 w-10 text-muted-foreground/30" strokeWidth={1} />
              <p className="text-sm text-muted-foreground">
                No journeys published yet.{" "}
                <Link to="/discover" className="text-gold-ink hover:text-foreground">
                  Start the first one →
                </Link>
              </p>
            </div>
          )}

          {liveTrips.length > 0 && (
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              {liveTrips.map((trip) => (
                <Link
                  key={trip._id}
                  to="/trips/$id"
                  params={{ id: trip._id }}
                  className="group block space-y-4"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {trip.destinations[0]?.imageQuery ? (
                      <img
                        src={unsplashUrl(trip.destinations[0].imageQuery)}
                        alt={trip.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Compass className="h-8 w-8 text-muted-foreground/30" strokeWidth={1} />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                      <MapPin className="h-2.5 w-2.5 text-gold-ink" strokeWidth={1.5} />
                      {trip.location}
                    </div>
                    <h3 className="font-serif text-xl group-hover:text-gold-ink transition-colors">
                      {trip.title}
                    </h3>
                    {trip.intro && (
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed italic">
                        "{trip.intro}"
                      </p>
                    )}
                    {trip.interests.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {trip.interests.slice(0, 3).map((i) => (
                          <span key={i} className="border border-border/60 px-2 py-0.5 text-[10px] text-muted-foreground">
                            {i}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center space-y-8">
        <h2 className="font-serif text-3xl lg:text-5xl">
          Ready to discover your next story?
        </h2>
        <p className="mx-auto max-w-md text-sm text-muted-foreground leading-relaxed">
          Let our Gemini-powered cultural guide craft a journey aligned with your budget, schedule, and interests.
        </p>
        <div className="pt-2">
          <Link
            to="/discover"
            className="inline-flex items-center gap-3 bg-primary px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-all hover:bg-primary/90"
          >
            Start Curation
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
