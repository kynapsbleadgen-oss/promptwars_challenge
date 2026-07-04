import { Compass } from "lucide-react";

export function Footer() {
  return (
    <footer id="stories" className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-12 md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <Compass className="h-4 w-4 text-gold-ink" strokeWidth={1.5} />
          <span className="font-serif text-lg">Wayfare</span>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Wayfare. Cultural travel, considered.
        </p>
      </div>
    </footer>
  );
}
