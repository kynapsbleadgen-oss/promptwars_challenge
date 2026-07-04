import type { DiscoveryResult } from "@/lib/discovery.schemas";
import { unsplashUrl } from "@/lib/image-utils";
import { MetaRow } from "@/components/shared/MetaRow";

export function HiddenGemCard({ g }: { g: DiscoveryResult["hiddenGems"][number] }) {
  return (
    <article className="group grid grid-cols-5 gap-6 border-t border-border pt-8">
      <div className="col-span-2 aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={unsplashUrl(g.imageQuery, 900, 1200)}
          alt={g.name}
          loading="lazy"
          width={900}
          height={1200}
          className="h-full w-full object-cover transition-transform duration-[1500ms] group-hover:scale-[1.04]"
        />
      </div>
      <div className="col-span-3 space-y-3">
        <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-gold-ink">
          {g.category}
        </span>
        <h4 className="font-serif text-2xl leading-tight">{g.name}</h4>
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
  );
}
