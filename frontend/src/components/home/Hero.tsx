import { ArrowRight, Loader2 } from "lucide-react";

import heroImg from "@/assets/hero-medina.jpg";
import { INTERESTS, DURATIONS, BUDGETS } from "@/lib/constants";
import { Stat } from "@/components/shared/Stat";
import { Field } from "@/components/shared/Field";

export type HeroProps = {
  location: string;
  setLocation: (s: string) => void;
  selectedInterests: string[];
  toggleInterest: (i: string) => void;
  duration: string;
  setDuration: (s: string) => void;
  budget: string;
  setBudget: (s: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
};

export function Hero(props: HeroProps) {
  return (
    <section
      id="discover"
      className="relative overflow-hidden border-b border-border/60"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "saturate(0.7)",
        }}
      />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-12 lg:py-28">
        <div className="space-y-8 lg:col-span-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--gold)]/25 bg-[color:var(--gold-soft)] px-3 py-1">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[color:var(--gold)]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-gold-ink">
              Powered by Gemini AI
            </span>
          </span>

          <h1 className="font-serif text-5xl leading-[1.05] tracking-tight lg:text-7xl xl:text-8xl">
            Unveil the <br />
            <span className="italic text-gold-ink">Hidden</span> Stories.
          </h1>

          <p className="max-w-md text-lg font-light leading-relaxed text-muted-foreground">
            Escape the tourist trails. Wayfare synthesizes centuries of cultural
            heritage to curate a journey as unique as your own signature.
          </p>

          <div className="flex gap-8 pt-4">
            <Stat label="Curation" value="Editorial-grade guides" />
            <div className="h-10 w-px bg-border" />
            <Stat label="Intelligence" value="Gemini Cultural Analysis" />
          </div>
        </div>

        <div className="lg:col-span-6">
          <form
            onSubmit={props.onSubmit}
            className="relative overflow-hidden border border-border bg-card p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] lg:p-10"
          >
            <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-[color:var(--gold-soft)]" />

            <h2 className="mb-8 border-b border-border/70 pb-4 text-xl font-medium tracking-tight">
              Start Your Discovery
            </h2>

            <div className="space-y-6">
              <Field label="Where are you drawn to?">
                <input
                  value={props.location}
                  onChange={(e) => props.setLocation(e.target.value)}
                  type="text"
                  placeholder="e.g. Kyoto, Fez, or the Alentejo"
                  className="w-full border-b border-border bg-transparent py-3 font-serif text-lg italic placeholder:text-muted-foreground/50 focus:border-[color:var(--gold)] focus:outline-none"
                />
              </Field>

              <Field label="Primary Interests">
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((i) => {
                    const active = props.selectedInterests.includes(i);
                    return (
                      <button
                        type="button"
                        key={i}
                        onClick={() => props.toggleInterest(i)}
                        className={
                          "rounded-sm border px-4 py-2 text-xs transition-all " +
                          (active
                            ? "border-[color:var(--gold)] bg-[color:var(--gold-soft)] text-foreground"
                            : "border-border hover:border-[color:var(--gold)] hover:bg-[color:var(--gold-soft)]")
                        }
                      >
                        {i}
                      </button>
                    );
                  })}
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-6">
                <Field label="Duration">
                  <select
                    value={props.duration}
                    onChange={(e) => props.setDuration(e.target.value)}
                    className="w-full cursor-pointer appearance-none border-b border-border bg-transparent py-2 text-sm focus:border-[color:var(--gold)] focus:outline-none"
                  >
                    {DURATIONS.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Investment">
                  <select
                    value={props.budget}
                    onChange={(e) => props.setBudget(e.target.value)}
                    className="w-full cursor-pointer appearance-none border-b border-border bg-transparent py-2 text-sm focus:border-[color:var(--gold)] focus:outline-none"
                  >
                    {BUDGETS.map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <button
                type="submit"
                disabled={props.loading}
                className="mt-6 flex w-full items-center justify-center gap-3 bg-primary py-4 text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-70"
              >
                {props.loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Curating…
                  </>
                ) : (
                  <>
                    Curate Journey
                    <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
