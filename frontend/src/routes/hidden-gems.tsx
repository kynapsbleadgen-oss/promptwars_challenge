import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Compass, Sparkles, MapPin, Eye } from "lucide-react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { unsplashUrl } from "@/lib/image-utils";
import { MetaRow } from "@/components/shared/MetaRow";

export const Route = createFileRoute("/hidden-gems")({
  component: HiddenGemsPage,
});

const CURATED_GEMS = [
  {
    name: "Ōtagi Nenbutsu-ji",
    location: "Arashiyama, Kyoto",
    category: "Sacred Site",
    whySpecial: "Tucked into the Arashiyama hills, this temple features 1,200 whimsical stone statues carved by amateur visitors, each bearing a unique facial expression.",
    localStory: "Carved during the 1980s reconstruction, the statues represent ordinary people: one holds a tennis racket, others laugh or whisper.",
    bestTimeToVisit: "Early morning at sunrise",
    difficulty: "Easy",
    visitingTip: "Walk from the Saga-Toriimoto preserved street to experience historic Kyoto.",
    imageQuery: "Otagi Nenbutsu-ji moss stone statues"
  },
  {
    name: "Chouara Tannery Terraces",
    location: "Fez Medina, Morocco",
    category: "Artisan Workshop",
    whySpecial: "The tanneries of Fez have operated continuously since the 11th century. Surrounding terraces offer a bird's-eye view of stone vats full of natural dyes.",
    localStory: "The leather masters use pigeon dung and salt for softening before coloring with saffron, poppy, and indigo.",
    bestTimeToVisit: "Mid-morning for direct sunlight",
    difficulty: "Easy",
    visitingTip: "Hold a sprig of fresh mint (offered by shopkeepers) to mask the smell.",
    imageQuery: "Fez Chouara tannery colourful vats aerial"
  },
  {
    name: "Cabo de São Vicente Clifftops",
    location: "Sagres, Portugal",
    category: "Scenic Viewpoint",
    whySpecial: "The southwesternmost point of continental Europe. Dramatic 75-meter cliffs face the Atlantic, surrounded by wild sage and migratory eagles.",
    localStory: "Ancient Romans believed this was the edge of the flat earth where the sun hissed as it sank into the ocean.",
    bestTimeToVisit: "Sunset",
    difficulty: "Moderate",
    visitingTip: "Bring a thick wool sweater — the Atlantic winds are fierce even in summer.",
    imageQuery: "Sagres Cabo de Sao Vicente cliffs lighthouse Portugal"
  },
  {
    name: "Nishiki Market Back Alleys",
    location: "Downtown, Kyoto",
    category: "Food Rituals",
    whySpecial: "While the central aisle is touristy, the narrow cross-lanes hide family-owned knife shops, handmade tsukemono (pickles), and charcoal tea roasters.",
    localStory: "Aritsugu knife shop was founded by a master swordsmith in 1560, later pivoting to kitchen blades.",
    bestTimeToVisit: "11am–1pm on weekdays",
    difficulty: "Easy",
    visitingTip: "Look for small wooden signs indicating family-operated counters.",
    imageQuery: "Kyoto Aritsugu knife shop artisan"
  }
];

function HiddenGemsPage() {
  const [activeDifficulty, setActiveDifficulty] = useState<string>("All");

  const filteredGems = activeDifficulty === "All"
    ? CURATED_GEMS
    : CURATED_GEMS.filter(g => g.difficulty === activeDifficulty);

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
              A curated collection of cultural highlights, artisan guilds, and quiet locations typical tourists overlook.
            </p>
          </div>

          <div className="flex gap-2">
            {["All", "Easy", "Moderate"].map((diff) => (
              <button
                key={diff}
                onClick={() => setActiveDifficulty(diff)}
                className={
                  "px-4 py-2 text-xs rounded-sm border transition-all " +
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

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {filteredGems.map((g, idx) => (
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
                <div className="flex items-center gap-2">
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
                <p className="text-xs italic text-muted-foreground">Tip — {g.visitingTip}</p>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
