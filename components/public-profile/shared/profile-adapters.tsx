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
  LinkedInIcon,
  TwitterIcon,
  MailIcon,
  PhoneIcon,
} from './social-icons';
import type { SocialEntry } from './social-block';

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
