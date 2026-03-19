'use client';

interface PressItem {
  name: string;
  logo_url: string | null;
  url: string | null;
}

interface PressStripData {
  items: PressItem[];
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

export function PressStrip({ data }: { data: PressStripData }) {
  if (!data.items || data.items.length === 0) {
    return <EmptyState message="Add press mentions" />;
  }

  return (
    <div className="flex flex-wrap justify-center items-center gap-8 py-4">
      {data.items.map((item, i) => {
        const content = item.logo_url ? (
          <img src={item.logo_url} alt={item.name} className="h-6 object-contain opacity-70" />
        ) : (
          <span className="font-granjon text-[20px] text-foreground/70">{item.name}</span>
        );

        if (item.url) {
          return (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-100 opacity-70 transition-opacity"
            >
              {content}
            </a>
          );
        }
        return (
          <div key={i} className="opacity-70">
            {content}
          </div>
        );
      })}
    </div>
  );
}
