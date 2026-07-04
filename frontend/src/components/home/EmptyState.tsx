import { Sparkles } from "lucide-react";

import kyotoImg from "@/assets/texture-kyoto.jpg";

export function EmptyState() {
  return (
    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
      <div className="space-y-6">
        <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-gold-ink">
          A field journal, reimagined
        </span>
        <h2 className="font-serif text-4xl leading-tight lg:text-5xl">
          Every destination has a
          <span className="italic"> deeper story</span> waiting.
        </h2>
        <p className="max-w-md text-muted-foreground">
          Wayfare draws on cultural histories, local rituals, and the small
          places tourists overlook. Set your intent above and we'll compose a
          journey worth remembering.
        </p>
        <ul className="space-y-3 pt-2 text-sm">
          {[
            "Personalized destinations grounded in cultural context",
            "Hidden gems from a local's perspective",
            "Best season, budget, etiquette — at a glance",
          ].map((t) => (
            <li key={t} className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold-ink" strokeWidth={1.5} />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={kyotoImg}
          alt="Kyoto backstreet at dusk with red lanterns"
          className="h-full w-full object-cover"
          loading="lazy"
          width={1024}
          height={1280}
        />
      </div>
    </div>
  );
}
