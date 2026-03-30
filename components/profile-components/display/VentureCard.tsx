'use client';

import { cn } from '@/lib/utils';

interface VentureItem {
  name: string;
  years: string | null;
  role: string | null;
  description: string | null;
  detail: string | null;
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
    <div className="space-y-8">
      <p className="text-[10px] tracking-[0.2em] uppercase mb-8 font-helvetica text-[#888] ">
        Ventures
      </p>

      {data.items.map((item, i) => (
        <div key={i} className={cn('border-l pl-5', i === 0 ? 'border-bb-dark' : 'border-bb-rule')}>
          <div className="flex items-baseline justify-between mb-1">
            <span className="font-granjon text-[16px] tracking-[0.01em] text-bb-dark">
              {item.name}
            </span>
            {item.years && (
              <span className="font-helvetica text-[10px] tracking-[0.1em] uppercase font-light text-bb-muted">
                {item.years}
              </span>
            )}
          </div>
          {item.role && (
            <p className="font-helvetica text-[10px] tracking-[0.1em] uppercase mb-3 text-bb-muted">
              {item.role}
            </p>
          )}
          {item.description && (
            <p className="font-granjon text-[13px] leading-[1.8] tracking-tight mb-2 text-[#555]">
              {item.description}
            </p>
          )}
          {item.detail && (
            <p className="font-helvetica text-[10px] tracking-[0.08em] font-light text-bb-muted">
              {item.detail}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
