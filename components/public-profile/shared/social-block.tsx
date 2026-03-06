import React from 'react';

export type SocialEntry = {
  icon: React.ReactNode;
  /** Follower count label, e.g. "12.5K" */
  count?: string;
  /** Makes the entry a clickable link */
  href?: string;
  /** Screen-reader / tooltip label */
  label?: string;
};

interface SocialBlockProps {
  socials: SocialEntry[];
}

export const SocialBlock = ({ socials }: SocialBlockProps) => {
  if (!socials.length) return null;
  return (
    <div className="flex justify-center items-center gap-8 mb-6">
      {socials.map((s, i) => {
        const inner = (
          <div className="flex items-center gap-1.5">
            {s.icon}
            {s.count && (
              <span className="text-[11px] tracking-[0.02em] font-light font-canela-deck text-[var(--pg-muted-fg)]">
                {s.count}
              </span>
            )}
          </div>
        );

        if (s.href) {
          return (
            <a
              key={i}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="text-[var(--pg-muted-fg)] hover:text-[var(--pg-fg)] transition-colors"
            >
              {inner}
            </a>
          );
        }

        return <div key={i}>{inner}</div>;
      })}
    </div>
  );
};
