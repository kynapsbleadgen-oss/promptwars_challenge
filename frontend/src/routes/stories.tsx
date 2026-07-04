import { createFileRoute } from "@tanstack/react-router";
import { Compass, BookOpen, Clock, Calendar } from "lucide-react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { unsplashUrl } from "@/lib/image-utils";

export const Route = createFileRoute("/stories")({
  component: StoriesPage,
});

const ARTICLES = [
  {
    id: 1,
    title: "The Sake Masters of Fushimi",
    subtitle: "How pure mountain water and centuries of dedication brew Kyoto’s finest sake.",
    author: "Elena Vance",
    date: "June 24, 2026",
    readTime: "6 min read",
    imageQuery: "Kyoto sake brewery wood vats barrels",
    paragraph: "In Fushimi, southern Kyoto, sake brewing is not merely a manufacturing process — it is a winter ritual. As the temperature drops, the toji (master brewers) gather at Fushimi’s historic wooden breweries. Using soft spring water filtering down from the surrounding mountains, they wash, steam, and ferment rice with clockwork precision. The sound of wood paddles stirring the vats echoes through the morning mist, preserving a method unchanged since the Edo period."
  },
  {
    id: 2,
    title: "Labyrinths of Indigo and Cedar",
    subtitle: "Finding historic craft guilds deep within Fez’s ancient medieval walls.",
    author: "Amine El-Fassi",
    date: "May 12, 2026",
    readTime: "8 min read",
    imageQuery: "Fez medina blue tiles copper workshop Morocco",
    paragraph: "Fez el-Bali is the world’s largest car-free urban zone, a living medieval city of 9,400 streets. To navigate it is to walk through history. Following the distinct aroma of cedarwood shavings leads to the Carpenter’s Souk, while the rhythmic metallic clanging guides you to copper beaters in Seffarine Square. Here, master craftsmen hammer platters under the hot sun, passing down methods to apprentices just as their families did a millennium ago."
  },
  {
    id: 3,
    title: "Silence and Cork Oaks in Alentejo",
    subtitle: "A journey through Portugal's slow, sun-drenched southern heartland.",
    author: "Mateo Silva",
    date: "April 05, 2026",
    readTime: "5 min read",
    imageQuery: "Alentejo cork forest countryside whitewashed village Portugal",
    paragraph: "The Alentejo region covers a third of Portugal, yet it holds only a fraction of its population. It is a land of space, heat, and oak groves. In the summer heat, villages of whitewashed houses with yellow-bordered doors seem completely silent. But step into a local tasca, and you hear the quiet murmur of local gossip, accompanied by olive oil, sheep's cheese, and rich red wines. Here, time is measured not in hours, but in seasons."
  }
];

function StoriesPage() {
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
            Long-form dispatches, local profiles, and cultural heritage reviews from our editors on the road.
          </p>
        </div>

        {/* Article Feed */}
        <div className="space-y-28">
          {ARTICLES.map((article) => (
            <article key={article.id} className="space-y-6">
              {/* Cover Image */}
              <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                <img
                  src={unsplashUrl(article.imageQuery, 1600, 900)}
                  alt={article.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1500ms] hover:scale-[1.02]"
                />
              </div>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-[10px] text-muted-foreground uppercase tracking-wider font-sans border-b border-border/60 pb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {article.date}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-border" />
                <span>By {article.author}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-border" />
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {article.readTime}
                </span>
              </div>

              {/* Title & Body */}
              <div className="space-y-4">
                <h2 className="font-serif text-3xl lg:text-4xl leading-tight">
                  {article.title}
                </h2>
                <p className="font-serif text-lg italic text-muted-foreground">
                  {article.subtitle}
                </p>
                <p className="text-base leading-relaxed text-muted-foreground pt-2">
                  {article.paragraph}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => alert("Subscribers only — this article requires premium access.")}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-ink hover:text-foreground transition-colors"
                >
                  <BookOpen className="h-4 w-4" strokeWidth={1.5} />
                  Read Story
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
