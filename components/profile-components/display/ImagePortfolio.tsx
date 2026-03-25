'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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
  { blockClass: 'mb-16', imgClass: 'mx-auto w-[78%]', textAlign: 'text-center' },
  { blockClass: 'mb-20', imgClass: 'mr-auto w-[52%]', textAlign: 'text-left' },
  { blockClass: 'mb-20', imgClass: 'w-full', textAlign: 'text-left' },
  { blockClass: 'mb-20', imgClass: 'ml-auto w-[48%]', textAlign: 'text-right' },
  { blockClass: '', imgClass: 'mx-auto w-[65%]', textAlign: 'text-center' },
];

const ScrollReveal = ({
  children,
  yOffset = 32,
}: {
  children: React.ReactNode;
  yOffset?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hiddenY, setHiddenY] = useState(yOffset);

  return (
    <motion.div
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      custom={hiddenY}
      variants={{
        hidden: (y: number) => ({
          opacity: 0,
          y,
          transition: { duration: 0 },
        }),
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] },
        },
      }}
      onViewportEnter={() => setIsVisible(true)}
      onViewportLeave={(entry) => {
        setHiddenY(entry && entry.boundingClientRect.top < 0 ? -yOffset : yOffset);
        setIsVisible(false);
      }}
      viewport={{ margin: '-60px' }}
    >
      {children}
    </motion.div>
  );
};

export function ImagePortfolio({ data }: { data: ImagePortfolioData }) {
  if (!data.images || data.images.length === 0) {
    return <EmptyState message="Upload portfolio images" />;
  }

  return (
    <div className="mb-6">
      {data.images.map((img, i) => {
        const pos = POSITIONS[i % POSITIONS.length];
        return (
          <div key={i} className={pos.blockClass}>
            <ScrollReveal>
              <div className={pos.imgClass}>
                {img.url ? (
                  <img
                    src={img.url}
                    alt={img.caption ?? `Image ${i + 1}`}
                    className="w-full aspect-[3/4] object-cover block border border-bb-rule"
                  />
                ) : (
                  <div className="w-full aspect-[3/4] bg-bb-rule/30 border border-bb-rule" />
                )}
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
              </div>
            </ScrollReveal>
            {i === 1 && data.text && (
              <ScrollReveal yOffset={20}>
                <div className="text-center py-8 mb-16">
                  <p className="font-granjon italic text-[15px] leading-relaxed max-w-[260px] mx-auto">
                    &ldquo;{data.text}&rdquo;
                  </p>
                  {data.text_attributed && (
                    <p className="font-granjon text-[11px] mt-3 uppercase tracking-[0.12em] text-[#999]">
                      — {data.text_attributed}
                    </p>
                  )}
                </div>
              </ScrollReveal>
            )}
          </div>
        );
      })}
    </div>
  );
}
