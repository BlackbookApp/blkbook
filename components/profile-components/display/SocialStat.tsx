'use client';

import {
  buildSocialStatItems,
  KNOWN_PLATFORMS,
  type RawSocialStatItem,
} from '@/components/public-profile/shared/profile-adapters';

interface SocialStatData {
  items: RawSocialStatItem[];
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

export function SocialStat({ data }: { data: SocialStatData }) {
  if (!data.items || data.items.length === 0) {
    return <EmptyState message="Add your social following" />;
  }

  const allowed = KNOWN_PLATFORMS as readonly string[];
  const resolved = buildSocialStatItems(
    data.items.filter((i) => allowed.includes(i.platform.toLowerCase()))
  );

  return (
    <div className="flex flex-wrap justify-center items-center gap-8">
      {resolved.map((item, i) => {
        const { Icon, url, count } = item;
        const inner = (
          <div className="flex items-center gap-1.5">
            <Icon className="text-bb-muted" />
            {count && (
              <span className="font-helvetica text-[10px] text-bb-muted leading-none translate-y-px">
                {count}
              </span>
            )}
          </div>
        );

        if (url) {
          return (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity"
            >
              {inner}
            </a>
          );
        }
        return <div key={i}>{inner}</div>;
      })}
    </div>
  );
}
