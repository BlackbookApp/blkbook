import type { Profile, SocialLinks } from '@/lib/data/profiles';
import type {
  ProfileData,
  PortfolioItem,
  Testimonial,
} from '@/components/public-profile/public-profile-visual';
import type { SocialFields, WorkData } from '@/components/edit-profile/types';
import {
  InstagramIcon,
  TikTokIcon,
  YouTubeIcon,
  LinkedInIcon,
  TwitterIcon,
  GlobeIcon,
  MailIcon,
  PhoneIcon,
  WhatsAppIcon,
} from './social-icons';
import type { SocialEntry } from './social-block';
import type { ComponentType } from 'react';

const iconClass = 'text-[var(--pg-muted-fg)] w-3 h-3';

/** Build SocialEntry[] from profile social_links */
export function buildSocials(links: SocialLinks): SocialEntry[] {
  const socials: SocialEntry[] = [];

  if (links.instagram) {
    const handle = links.instagram.replace(/^@/, '');
    socials.push({
      icon: <InstagramIcon className={iconClass} />,
      href: `https://instagram.com/${handle}`,
      label: `@${handle}`,
    });
  }

  if (links.tiktok) {
    const handle = links.tiktok.replace(/^@/, '');
    socials.push({
      icon: <TikTokIcon className={iconClass} />,
      href: `https://tiktok.com/@${handle}`,
      label: `@${handle}`,
    });
  }

  if (links.linkedin) {
    socials.push({
      icon: <LinkedInIcon className={iconClass} />,
      href: links.linkedin.startsWith('http')
        ? links.linkedin
        : `https://linkedin.com/in/${links.linkedin}`,
      label: 'LinkedIn',
    });
  }

  if (links.twitter) {
    const handle = links.twitter.replace(/^@/, '');
    socials.push({
      icon: <TwitterIcon className={iconClass} />,
      href: `https://x.com/${handle}`,
      label: `@${handle}`,
    });
  }

  if (links.email) {
    socials.push({
      icon: <MailIcon className={iconClass} />,
      href: `mailto:${links.email}`,
      label: links.email,
    });
  }

  if (links.phone) {
    socials.push({
      icon: <PhoneIcon className={iconClass} />,
      href: `tel:${links.phone}`,
      label: links.phone,
    });
  }

  return socials;
}

export const KNOWN_PLATFORMS = [
  'instagram',
  'tiktok',
  'youtube',
  'linkedin',
  'twitter',
  'website',
  'email',
  'phone',
  'whatsapp',
] as const;
export type KnownPlatform = (typeof KNOWN_PLATFORMS)[number];

export interface RawSocialStatItem {
  platform: string;
  handle: string | null;
  count: string | null;
  url: string | null;
}

export interface ResolvedSocialItem {
  Icon: ComponentType<{ className?: string }>;
  url: string | null;
  count: string | null;
}

/** Resolve raw social_stat items into display-ready items with icons and URLs */
export function buildSocialStatItems(items: RawSocialStatItem[]): ResolvedSocialItem[] {
  return items.map((item) => {
    const p = item.platform.toLowerCase();
    const handle = item.handle?.replace(/^@/, '') ?? null;

    if (p === 'instagram') {
      return {
        Icon: InstagramIcon,
        url: handle ? `https://instagram.com/${handle}` : null,
        count: item.count,
      };
    }
    if (p === 'tiktok') {
      return {
        Icon: TikTokIcon,
        url: handle ? `https://tiktok.com/@${handle}` : null,
        count: item.count,
      };
    }
    if (p === 'youtube') {
      return {
        Icon: YouTubeIcon,
        url: handle ? `https://youtube.com/@${handle}` : null,
        count: item.count,
      };
    }
    if (p === 'linkedin') {
      return {
        Icon: LinkedInIcon,
        url: handle
          ? handle.startsWith('http')
            ? handle
            : `https://linkedin.com/in/${handle}`
          : null,
        count: item.count,
      };
    }
    if (p === 'twitter' || p === 'x') {
      return {
        Icon: TwitterIcon,
        url: handle ? `https://x.com/${handle}` : null,
        count: item.count,
      };
    }
    if (p === 'website') {
      return {
        Icon: GlobeIcon,
        url: handle ? (handle.startsWith('http') ? handle : `https://${handle}`) : null,
        count: item.count,
      };
    }
    if (p === 'email') {
      return { Icon: MailIcon, url: handle ? `mailto:${handle}` : null, count: item.count };
    }
    if (p === 'phone') {
      return { Icon: PhoneIcon, url: handle ? `tel:${handle}` : null, count: item.count };
    }
    if (p === 'whatsapp') {
      return {
        Icon: WhatsAppIcon,
        url: handle ? `https://wa.me/${handle.replace(/\D/g, '')}` : null,
        count: item.count,
      };
    }
    // Custom platform — pass URL through, use globe icon
    return { Icon: GlobeIcon, url: item.url, count: null };
  });
}

/** Extract SocialLinks from the social_stat component in a profile's component list */
export function extractContactsFromComponents(
  components: { type: string; data: unknown }[]
): SocialLinks {
  const socialStat = components.find((c) => c.type === 'social_stat');
  if (!socialStat) return {};

  const items = (socialStat.data as { items?: RawSocialStatItem[] })?.items ?? [];
  const result: SocialLinks = {};

  for (const item of items) {
    const p = item.platform.toLowerCase();
    const value = item.handle?.replace(/^@/, '');
    if (!value) continue;
    if (p === 'email') result.email = value;
    else if (p === 'phone') result.phone = value;
    else if (p === 'whatsapp') result.whatsapp = value;
    else if (p === 'website')
      result.website = value.startsWith('http') ? value : `https://${value}`;
    else if (p === 'instagram') result.instagram = value;
    else if (p === 'tiktok') result.tiktok = value;
    else if (p === 'linkedin') result.linkedin = value;
    else if (p === 'twitter' || p === 'x') result.twitter = value;
  }

  return result;
}

export interface PublicProfileProps {
  profile: ProfileData;
  portfolio: PortfolioItem[];
  testimonials: Testimonial[];
}

/** Build props for PublicProfileVisual/Editorial from a DB Profile */
export function profileFromDB(profile: Profile): PublicProfileProps {
  return {
    profile: {
      name: profile.full_name ?? profile.username ?? '',
      bio: profile.bio,
      role: profile.role,
      location: profile.location,
      portraitSrc: profile.avatar_url,
      logoSrc: profile.logo_url,
      socialLinks: profile.social_links,
      brandStatement: profile.brand_statement,
      recommendedBy: profile.recommended_by ?? [],
    },
    portfolio: profile.portfolio_images.map((img) => ({ imageSrc: img.url })),
    testimonials: profile.testimonials.map((t) => ({
      quote: t.quote,
      author: t.author ? `${t.author}${t.title ? `, ${t.title}` : ''}` : undefined,
    })),
  };
}

/** Build props for PublicProfileVisual/Editorial from edit-profile state */
export function profileFromEditState(params: {
  name: string;
  bio: string;
  role: string;
  location: string;
  avatarPreview: string | null;
  socials: SocialFields;
  work: WorkData;
}): PublicProfileProps {
  const { name, bio, role, location, avatarPreview, socials, work } = params;
  return {
    profile: {
      name,
      bio,
      role,
      location,
      portraitSrc: avatarPreview,
      logoSrc: work.logo,
      socialLinks: socials,
      brandStatement: work.brandStatement,
      recommendedBy: work.recommendedBy,
    },
    portfolio: work.portfolioImages.map((img) => ({ imageSrc: img.url })),
    testimonials: work.testimonials
      .filter((t) => t.quote.trim())
      .map((t) => ({
        quote: t.quote,
        author: t.author ? `${t.author}${t.title ? `, ${t.title}` : ''}` : undefined,
      })),
  };
}
