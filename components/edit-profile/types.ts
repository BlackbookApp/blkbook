export type ProfileStyle = 'visual' | 'editorial' | null;
export type ProfilePalette = 'blanc' | 'noir' | null;

export interface SocialFields {
  website: string;
  instagram: string;
  tiktok: string;
  linkedin: string;
  twitter: string;
  email: string;
  phone: string;
  whatsapp: string;
}

export interface PortfolioEntry {
  id?: string;
  url: string;
  file?: File;
}

export interface TestimonialDraft {
  quote: string;
  author: string;
  title: string;
}

export interface WorkData {
  portfolioImages: PortfolioEntry[];
  logo: string | null;
  testimonials: TestimonialDraft[];
  brandStatement: string;
}
