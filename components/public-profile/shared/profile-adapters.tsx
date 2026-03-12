import type { SocialLinks } from '@/lib/data/profiles';
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
