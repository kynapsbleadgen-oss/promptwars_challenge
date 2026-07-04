export function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="flex items-end justify-between border-b border-border pb-6">
      <div>
        <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-gold-ink">
          {eyebrow}
        </span>
        <h3 className="mt-2 font-serif text-3xl lg:text-4xl">{title}</h3>
      </div>
    </div>
  );
}
