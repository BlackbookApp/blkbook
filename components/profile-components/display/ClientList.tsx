'use client';

interface ClientItem {
  name: string;
  logo_url: string | null;
}

interface ClientListData {
  items: ClientItem[];
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

export function ClientList({ data }: { data: ClientListData }) {
  if (!data.items || data.items.length === 0) {
    return <EmptyState message="Add clients you have worked with" />;
  }

  return (
    <div className="text-center">
      <p className="font-helvetica text-[9px] uppercase text-bb-muted mb-5 tracking-wide">
        Selected clients
      </p>
      <div className="space-y-1">
        {data.items.map((item, i) => (
          <p
            key={i}
            className="font-granjon text-[15px] uppercase tracking-[0.1em] text-foreground"
          >
            {item.name}
          </p>
        ))}
      </div>
    </div>
  );
}
