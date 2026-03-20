'use client';

import { cn } from '@/lib/utils';

interface ImageItem {
  url: string | null;
  caption: string | null;
}

interface ImagePortfolioData {
  text: string | null;
  text_attributed: string | null;
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
  { width: 'w-[70%]', justify: 'justify-start', aspect: 'aspect-[3/4]', textAlign: 'text-left' },
  { width: 'w-[50%]', justify: 'justify-end', aspect: 'aspect-[3/4]', textAlign: 'text-right' },
  { width: 'w-[45%]', justify: 'justify-start', aspect: 'aspect-[4/5]', textAlign: 'text-left' },
  { width: 'w-[55%]', justify: 'justify-center', aspect: 'aspect-[3/4]', textAlign: 'text-center' },
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
          <div key={i}>
            <div className={cn('flex', pos.justify)}>
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
            {img.caption && (
              <p
                className={cn(
                  'font-helvetica text-[9px] uppercase tracking-[0.2em] font-light text-[#bbbbbb] mt-2',
                  pos.textAlign
                )}
              >
                {img.caption}
              </p>
            )}
            {i === 0 && data.text && (
              <div className="py-6 text-center">
                <p className="font-granjon italic text-[15px] leading-[1.8] text-bb-dark/70">
                  &ldquo;{data.text}&rdquo;
                </p>
                {data.text_attributed && (
                  <p className="font-helvetica text-[9px] uppercase tracking-[0.2em] text-[#bbbbbb] mt-3">
                    — {data.text_attributed}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
