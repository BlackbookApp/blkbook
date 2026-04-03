import type { ComponentType } from './roleSchemas';
import {
  ProfileHeroCentered,
  QuoteBlock,
  TopBio,
  VentureCard,
  ExperienceTimeline,
  PortfolioCard,
  ImagePortfolio,
  ImageGallery,
  ClientList,
  RecognitionList,
  PressStrip,
  AboutSection,
  NowBlock,
  Logo,
  SocialStat,
} from '@/components/profile-components/display';

interface DisplayMapEntry {
  label: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<{ data: any }>;
}

export const DISPLAY_MAP: Record<ComponentType, DisplayMapEntry> = {
  profile_hero_centered: {
    label: 'Profile hero',
    description: 'Your name, photo and intro.',
    component: ProfileHeroCentered,
  },
  quote_block: {
    label: 'Quote',
    description: 'A line that captures how you think.',
    component: QuoteBlock,
  },
  top_bio: {
    label: 'Bio',
    description: 'What you do and who you are.',
    component: TopBio,
  },
  venture_card: {
    label: 'Ventures',
    description: 'Companies or projects you have built.',
    component: VentureCard,
  },
  experience_timeline: {
    label: 'Experience',
    description: 'Your career history.',
    component: ExperienceTimeline,
  },
  portfolio_card: {
    label: 'Portfolio',
    description: 'A visual showcase of your work.',
    component: PortfolioCard,
  },
  image_portfolio: {
    label: 'Image portfolio',
    description: 'A visual portfolio of your work.',
    component: ImagePortfolio,
  },
  image_gallery: {
    label: 'Image gallery',
    description: 'A grid of images.',
    component: ImageGallery,
  },
  client_list: {
    label: 'Clients',
    description: 'Companies you have worked with.',
    component: ClientList,
  },
  recognition_list: {
    label: 'Recognition',
    description: 'Awards and credentials.',
    component: RecognitionList,
  },
  press_strip: {
    label: 'Press',
    description: 'Publications you have appeared in.',
    component: PressStrip,
  },
  about_section: {
    label: 'About',
    description: 'A longer bio with expand toggle.',
    component: AboutSection,
  },
  now_block: {
    label: 'Now',
    description: 'What you are currently focused on.',
    component: NowBlock,
  },
  logo: {
    label: 'Logo',
    description: 'Your company or personal logo.',
    component: Logo,
  },
  social_stat: {
    label: 'Social stats',
    description: 'Your platform reach.',
    component: SocialStat,
  },
};
