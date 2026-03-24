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

function PressItem({ item }: { item: PressItem }) {
  const content = item.logo_url ? (
    <img src={item.logo_url} alt={item.name} className="h-6 object-contain" />
  ) : (
    <span className="font-granjon text-[20px] leading-none">{item.name}</span>
  );

  if (item.url) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:opacity-100 transition-opacity shrink-0"
      >
        {content}
      </a>
    );
  }
  return <div className="shrink-0">{content}</div>;
}

export function PressStrip({ data }: { data: PressStripData }) {
  if (!data.items || data.items.length === 0) {
    return <EmptyState message="Add press mentions" />;
  }

  // Duplicate items to fill the ticker seamlessly
  const repeated = [...data.items, ...data.items, ...data.items];

  return (
    <div className="overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div
        className="flex items-center gap-12 opacity-60"
        style={{
          animation: 'press-ticker 20s linear infinite',
          width: 'max-content',
        }}
      >
        {repeated.map((item, i) => (
          <PressItem key={i} item={item} />
        ))}
      </div>
      <style>{`
        @keyframes press-ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}
