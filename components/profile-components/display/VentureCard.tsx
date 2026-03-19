'use client';

import { cn } from '@/lib/utils';

interface VentureItem {
  name: string;
  description: string | null;
  url: string | null;
  logo_url: string | null;
}

interface VentureCardData {
  items: VentureItem[];
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

export function VentureCard({ data }: { data: VentureCardData }) {
  if (!data.items || data.items.length === 0) {
    return <EmptyState message="Add your ventures or projects" />;
  }

  return (
    <div className="space-y-4">
      {data.items.map((item, i) => (
        <div
          key={i}
          className={cn('border-l pl-5', i === 0 ? 'border-foreground' : 'border-bb-rule')}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-granjon text-[16px] text-foreground">{item.name}</span>
          </div>
          {item.description && (
            <p className="font-granjon italic text-[13px] text-foreground/60 leading-[1.8]">
              {item.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
