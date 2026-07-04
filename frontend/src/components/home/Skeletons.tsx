export function Skeletons() {
  return (
    <div className="space-y-16">
      <div className="space-y-6">
        <div className="h-3 w-40 animate-pulse bg-muted" />
        <div className="h-10 w-2/3 animate-pulse bg-muted" />
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="aspect-[4/5] animate-pulse bg-muted" />
            <div className="h-4 w-1/2 animate-pulse bg-muted" />
            <div className="h-3 w-full animate-pulse bg-muted" />
            <div className="h-3 w-4/5 animate-pulse bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
