import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, Sparkles, MapPin, ArrowRight } from "lucide-react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import heroImg from "@/assets/hero-medina.jpg";
import kyotoImg from "@/assets/texture-kyoto.jpg";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const featured = [
    {
      title: "Kyoto, Japan",
      description: "Step away from the crowded temple routes and discover the moss-covered stone statues of Ōtagi Nenbutsu-ji and Fushimi sake breweries.",
      image: kyotoImg,
      tags: ["Temples", "Sake Breweries", "Moss Gardens"]
    },
    {
      title: "Fez, Morocco",
      description: "Lose yourself in the car-free labyrinth of Fez el-Bali, following the scent of cedarwood, spice, and traditional leather workshops.",
      image: heroImg,
      tags: ["Medina", "Artisans", "Architecture"]
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />

      {/* Hero Landing Section */}
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
              Introducing Wayfare
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

          <div className="pt-6">
            <Link
              to="/discover"
              className="inline-flex items-center gap-3 bg-primary px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-all hover:bg-primary/90"
            >
              Start Discovery
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
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

      {/* Featured Destinations */}
      <section className="border-t border-border/60 bg-card py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 border-b border-border pb-6 flex items-end justify-between">
            <div>
              <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-gold-ink">
                Featured
              </span>
              <h2 className="mt-2 font-serif text-3xl lg:text-4xl">Curated Spotlights</h2>
            </div>
            <Link
              to="/discover"
              className="group flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              Curate your own
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            {featured.map((f, i) => (
              <article key={i} className="group space-y-5">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={f.image}
                    alt={f.title}
                    className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                    <MapPin className="h-3 w-3 text-gold-ink" strokeWidth={1.5} />
                    {f.title}
                  </div>
                  <h3 className="font-serif text-2xl group-hover:text-gold-ink transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {f.description}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {f.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-border/70 px-2 py-1 text-[10px] text-muted-foreground uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center space-y-8">
        <h2 className="font-serif text-3xl lg:text-5xl">
          Ready to discover your next story?
        </h2>
        <p className="mx-auto max-w-md text-sm text-muted-foreground leading-relaxed">
          Let our cultural guide craft a journey aligned with your budget, schedule, and interests.
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
