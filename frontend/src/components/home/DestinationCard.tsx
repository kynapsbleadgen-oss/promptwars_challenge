import { useState } from "react";
import { Bookmark, MapPin } from "lucide-react";
import { toast } from "sonner";

import type { DiscoveryResult } from "@/lib/discovery.schemas";
import { unsplashUrl } from "@/lib/image-utils";
import { MetaRow } from "@/components/shared/MetaRow";
import { useAuth } from "@/contexts/AuthContext";

export function DestinationCard({
  d,
  index,
  saved,
  onSave,
}: {
  d: DiscoveryResult["destinations"][number];
  index: number;
  saved: boolean;
  onSave: () => void;
}) {
  const { isAuthenticated } = useAuth();

  const handleBookmarkClick = () => {
    if (!isAuthenticated) {
      toast.error("Sign in to save this journey to your dashboard!");
      return;
    }
    if (!saved) {
      onSave();
    }
  };

  return (
    <article className="group space-y-5">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={unsplashUrl(d.imageQuery)}
          alt={d.name}
          loading="lazy"
          width={1200}
          height={1500}
          className="h-full w-full object-cover transition-transform duration-[1500ms] group-hover:scale-[1.04]"
        />
        <button
          type="button"
          onClick={handleBookmarkClick}
          className="absolute right-3 top-3 rounded-full bg-background/90 p-2 backdrop-blur transition hover:bg-background"
          aria-label="Save destination"
        >
          <Bookmark
            className={`h-4 w-4 ${saved ? "text-gold-ink" : ""}`}
            strokeWidth={1.5}
            fill={saved ? "currentColor" : "none"}
          />
        </button>
        <span className="absolute left-3 top-3 bg-background/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] backdrop-blur">
          №{String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
            <MapPin className="h-3 w-3" strokeWidth={1.5} />
            {d.region}
          </div>
          <h4 className="mt-1 font-serif text-2xl leading-tight">{d.name}</h4>
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
  );
}
