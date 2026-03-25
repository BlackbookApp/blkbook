'use client';

interface PortfolioItem {
  title: string;
  image_url: string | null;
  url: string | null;
}

interface PortfolioCardData {
  items: PortfolioItem[];
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-6 text-center">
      <p className="font-helvetica text-[9px] uppercase tracking-[0.2em] text-bb-muted/40">
        {message}
      </p>
    </div>
  );
}

export function PortfolioCard({ data }: { data: PortfolioCardData }) {
  if (!data.items || data.items.length === 0) {
    return <EmptyState message="Add portfolio work" />;
  }

  return (
    <div className="space-y-4">
      {data.items.map((item, i) => (
        <div key={i} className="border-l border-foreground pl-5">
          {item.image_url && (
            <div className="mb-2 border border-bb-rule overflow-hidden">
              <img src={item.image_url} alt={item.title} className="w-full object-cover" />
            </div>
          )}
          <p className="font-granjon text-[16px] text-foreground">{item.title}</p>
          {item.url && (
            <p className="font-helvetica text-[10px] uppercase text-bb-muted/60 mt-0.5 truncate">
              {item.url}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
