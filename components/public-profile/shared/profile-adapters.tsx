import type { SocialLinks } from '@/lib/data/profiles';
import {
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
  GlobeIcon,
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
      href: `https://instagram.com/${links.instagram}`,
      label: `@${links.instagram}`,
      count: '5k',
    });
  }

  if (links.linkedin) {
    socials.push({
      icon: <LinkedInIcon className={iconClass} />,
      href: links.linkedin.startsWith('http')
        ? links.linkedin
        : `https://linkedin.com/in/${links.linkedin}`,
      label: 'LinkedIn',
      count: '5k',
    });
  }

  if (links.twitter) {
    socials.push({
      icon: <TwitterIcon className={iconClass} />,
      href: `https://x.com/${links.twitter}`,
      label: `@${links.twitter}`,
      count: '5k',
    });
  }

  if (links.website) {
    socials.push({
      icon: <GlobeIcon className={iconClass} />,
      href: links.website.startsWith('http') ? links.website : `https://${links.website}`,
      label: links.website,
      count: '5k',
    });
  }

  if (links.email) {
    socials.push({
      icon: <MailIcon className={iconClass} />,
      href: `mailto:${links.email}`,
      label: links.email,
      count: '5k',
    });
  }

  if (links.phone) {
    socials.push({
      icon: <PhoneIcon className={iconClass} />,
      href: `tel:${links.phone}`,
      label: links.phone,
      count: '5k',
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

  if (links.phone) {
    halfItems.push({
      label: 'WhatsApp',
      href: `https://wa.me/${links.phone.replace(/\D/g, '')}`,
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

  // If odd number of half items, last one becomes full-width
  methods.push(...halfItems);

  methods.push({
    label: 'Exchange Details',
    onClick: callbacks.onExchangeDetails,
    variant: 'secondary',
  });

  return methods;
}
