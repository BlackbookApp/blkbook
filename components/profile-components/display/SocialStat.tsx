'use client';

import {
  InstagramIcon,
  TikTokIcon,
  YouTubeIcon,
  LinkedInIcon,
  TwitterIcon,
  GlobeIcon,
} from '@/components/public-profile/shared/social-icons';

interface SocialStatItem {
  platform: string;
  handle: string | null;
  count: string | null;
  url: string | null;
}

interface SocialStatData {
  items: SocialStatItem[];
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

function getPlatformIcon(platform: string) {
  const p = platform.toLowerCase();
  if (p === 'instagram') return InstagramIcon;
  if (p === 'tiktok') return TikTokIcon;
  if (p === 'youtube') return YouTubeIcon;
  if (p === 'linkedin') return LinkedInIcon;
  if (p === 'twitter' || p === 'x') return TwitterIcon;
  return GlobeIcon;
}

export function SocialStat({ data }: { data: SocialStatData }) {
  if (!data.items || data.items.length === 0) {
    return <EmptyState message="Add your social following" />;
  }

  return (
    <div className="flex flex-wrap justify-center items-center gap-8">
      {data.items.map((item, i) => {
        const Icon = getPlatformIcon(item.platform);
        const inner = (
          <div className="flex items-center gap-1.5">
            <Icon className="text-bb-muted" />
            {item.count && (
              <span className="font-helvetica text-[10px] text-bb-muted">{item.count}</span>
            )}
          </div>
        );

        if (item.url) {
          return (
            <a
              key={i}
              href={item.url}
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
