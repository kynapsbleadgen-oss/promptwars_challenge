import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Compass, MapPin, Plus, Loader2, Calendar } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

type Trip = {
  _id: string;
  title: string;
  location: string;
  interests: string[];
  duration: string;
  budget: string;
  status: string;
  intro: string;
  destinations: { name: string; region: string; imageQuery: string }[];
  createdAt: string;
};

type TripsResponse = {
  items: Trip[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery<TripsResponse>({
    queryKey: ["trips"],
    queryFn: () => api<TripsResponse>("/trips"),
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      <Nav />

      <main className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
        <div className="flex items-end justify-between border-b border-border pb-6">
          <div>
            <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-gold-ink">
              Your Journeys
            </span>
            <h1 className="mt-2 font-serif text-4xl tracking-tight lg:text-5xl">
              Welcome, {user?.name?.split(" ")[0]}
            </h1>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 bg-primary px-5 py-3 text-xs font-medium uppercase tracking-[0.18em] text-primary-foreground transition-all hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            New Discovery
          </Link>
        </div>

        {isLoading && (
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[4/3] animate-pulse bg-muted" />
                <div className="h-4 w-2/3 animate-pulse bg-muted" />
                <div className="h-3 w-full animate-pulse bg-muted" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="mt-16 text-center">
            <p className="text-muted-foreground">Failed to load trips. Please try again.</p>
          </div>
        )}

        {data && data.items.length === 0 && (
          <div className="mt-24 text-center">
            <Compass className="mx-auto h-12 w-12 text-muted-foreground/40" strokeWidth={1} />
            <h2 className="mt-6 font-serif text-2xl">No journeys yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Start a discovery above and your curated trips will appear here.
            </p>
            <Link
              to="/"
              className="mt-8 inline-flex items-center gap-2 bg-primary px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-primary-foreground transition-all hover:bg-primary/90"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
              Start Discovering
            </Link>
          </div>
        )}

        {data && data.items.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {data.items.map((trip) => (
              <TripCard key={trip._id} trip={trip} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function TripCard({ trip }: { trip: Trip }) {
  return (
    <Link to="/trips/$id" params={{ id: trip._id }} className="group block space-y-4">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {trip.destinations[0]?.imageQuery ? (
          <img
            src={`https://loremflickr.com/800/600/${encodeURIComponent(trip.destinations[0].imageQuery)}?lock=${trip._id.slice(-6)}`}
            alt={trip.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <MapPin className="h-8 w-8 text-muted-foreground/30" />
          </div>
        )}
        <span
          className={
            "absolute right-3 top-3 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] backdrop-blur " +
            (trip.status === "published"
              ? "bg-[color:var(--gold-soft)] text-gold-ink"
              : "bg-background/90 text-muted-foreground")
          }
        >
          {trip.status}
        </span>
      </div>
      <div>
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
          <MapPin className="h-3 w-3" strokeWidth={1.5} />
          {trip.location}
        </div>
        <h3 className="mt-1 font-serif text-xl leading-tight group-hover:text-gold-ink transition-colors">
          {trip.title}
        </h3>
      </div>
      <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" strokeWidth={1.5} />
          {new Date(trip.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <span>
          {trip.destinations.length} destination{trip.destinations.length !== 1 ? "s" : ""}
        </span>
      </div>
    </Link>
  );
}
