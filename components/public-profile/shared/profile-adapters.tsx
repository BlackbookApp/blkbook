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
import type { ContactMethod } from './contact-block';

const iconClass = 'text-[var(--pg-muted-fg)] w-3 h-3';

/** Build SocialEntry[] from profile social_links */
export function buildSocials(links: SocialLinks): SocialEntry[] {
  const socials: SocialEntry[] = [];

  if (links.instagram) {
    socials.push({
      icon: <InstagramIcon className={iconClass} />,
      href: `https://instagram.com/${links.instagram.replace(/^@/, '')}`,
      label: `@${links.instagram}`,
    });
  }

  if (links.tiktok) {
    socials.push({
      icon: <TikTokIcon className={iconClass} />,
      href: `https://tiktok.com/@${links.tiktok.replace(/^@/, '')}`,
      label: `@${links.tiktok}`,
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
    socials.push({
      icon: <TwitterIcon className={iconClass} />,
      href: `https://x.com/${links.twitter}`,
      label: `@${links.twitter}`,
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

/** Build ContactMethod[] from profile social_links + action callbacks */
export function buildContactMethods(
  links: SocialLinks,
  callbacks: {
    onSaveContact: () => void;
    onExchangeDetails: () => void;
  }
): ContactMethod[] {
  const methods: ContactMethod[] = [
    { label: 'Save Contact', onClick: callbacks.onSaveContact, variant: 'primary' },
  ];

  const halfItems: ContactMethod[] = [];

  if (links.whatsapp) {
    halfItems.push({
      label: 'WhatsApp',
      href: `https://wa.me/${links.whatsapp.replace(/\D/g, '')}`,
      variant: 'secondary',
      layout: 'half',
    });
  }

  if (links.website) {
    halfItems.push({
      label: 'Website',
      href: links.website.startsWith('http') ? links.website : `https://${links.website}`,
      variant: 'secondary',
      layout: 'half',
    });
  }

  methods.push(...halfItems);

  methods.push({
    label: 'Exchange Details',
    onClick: callbacks.onExchangeDetails,
    variant: 'secondary',
  });

  return methods;
}
