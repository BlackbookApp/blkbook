'use client';

import { cn } from '@/lib/utils';

interface ImageItem {
  url: string | null;
  caption: string | null;
}

interface ImagePortfolioData {
  images: ImageItem[];
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

const POSITIONS = [
  { width: 'w-[70%]', justify: 'justify-start', aspect: 'aspect-[3/4]' },
  { width: 'w-[50%]', justify: 'justify-end', aspect: 'aspect-[3/4]' },
  { width: 'w-[45%]', justify: 'justify-start', aspect: 'aspect-[4/5]' },
  { width: 'w-[55%]', justify: 'justify-center', aspect: 'aspect-[3/4]' },
];

export function ImagePortfolio({ data }: { data: ImagePortfolioData }) {
  if (!data.images || data.images.length === 0) {
    return <EmptyState message="Upload portfolio images" />;
  }

  return (
    <div className="space-y-3">
      {data.images.map((img, i) => {
        const pos = POSITIONS[i % POSITIONS.length];
        return (
          <div key={i} className={cn('flex', pos.justify)}>
            <div className={cn(pos.width, pos.aspect, 'overflow-hidden border border-bb-rule')}>
              {img.url ? (
                <img
                  src={img.url}
                  alt={img.caption ?? `Image ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-bb-rule/30" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
