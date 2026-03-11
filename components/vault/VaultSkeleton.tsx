export function VaultSkeleton() {
  return (
    <div className="space-y-6 mt-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-border/40 rounded animate-pulse" />
            <div className="flex-1 h-px bg-border/40" />
          </div>
          {Array.from({ length: 2 }).map((_, j) => (
            <div key={j} className="py-3.5 space-y-1.5">
              <div className="h-4 bg-border/30 rounded w-2/3 animate-pulse" />
              <div className="h-3 bg-border/20 rounded w-1/2 animate-pulse" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
