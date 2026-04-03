import type { ComponentType } from './roleSchemas';
import type { ProfileComponent } from '@/lib/data/components';
import {
  ProfileHeroCenteredEditor,
  QuoteBlockEditor,
  TopBioEditor,
  VentureCardEditor,
  ExperienceTimelineEditor,
  PortfolioCardEditor,
  ImagePortfolioEditor,
  ImageGalleryEditor,
  ClientListEditor,
  RecognitionListEditor,
  PressStripEditor,
  AboutSectionEditor,
  NowBlockEditor,
  LogoEditor,
  SocialStatEditor,
} from '@/components/profile-components/editors';

interface EditorMapEntry {
  label: string;
  description: string;
  component: React.ComponentType<{ component: ProfileComponent }>;
}

export const EDITOR_MAP: Record<ComponentType, EditorMapEntry> = {
  profile_hero_centered: {
    label: 'Profile hero',
    description: 'Your name, photo and intro.',
    component: ProfileHeroCenteredEditor,
  },
  quote_block: {
    label: 'Quote',
    description: 'A line that captures how you think.',
    component: QuoteBlockEditor,
  },
  top_bio: {
    label: 'Bio',
    description: 'What you do and who you are.',
    component: TopBioEditor,
  },
  venture_card: {
    label: 'Ventures',
    description: 'Companies or projects you have built.',
    component: VentureCardEditor,
  },
  experience_timeline: {
    label: 'Experience',
    description: 'Your career history.',
    component: ExperienceTimelineEditor,
  },
  portfolio_card: {
    label: 'Portfolio',
    description: 'A visual showcase of your work.',
    component: PortfolioCardEditor,
  },
  image_portfolio: {
    label: 'Image portfolio',
    description: 'A visual portfolio of your work.',
    component: ImagePortfolioEditor,
  },
  image_gallery: {
    label: 'Image gallery',
    description: 'A grid of images.',
    component: ImageGalleryEditor,
  },
  client_list: {
    label: 'Clients',
    description: 'Companies you have worked with.',
    component: ClientListEditor,
  },
  recognition_list: {
    label: 'Recognition',
    description: 'Awards and credentials.',
    component: RecognitionListEditor,
  },
  press_strip: {
    label: 'Press',
    description: 'Publications you have appeared in.',
    component: PressStripEditor,
  },
  about_section: {
    label: 'About',
    description: 'A longer bio with expand toggle.',
    component: AboutSectionEditor,
  },
  now_block: {
    label: 'Now',
    description: 'What you are currently focused on.',
    component: NowBlockEditor,
  },
  logo: {
    label: 'Logo',
    description: 'Your company or personal logo.',
    component: LogoEditor,
  },
  social_stat: {
    label: 'Social stats',
    description: 'Your platform reach.',
    component: SocialStatEditor,
  },
};
