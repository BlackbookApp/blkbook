export type ProfileStyle = 'visual' | 'editorial' | null;
export type ProfilePalette = 'blanc' | 'noir' | null;

export interface SocialFields {
  website: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  email: string;
  phone: string;
}

export interface PortfolioEntry {
  id?: string;
  url: string;
  file?: File;
}

export interface WorkData {
  portfolioImages: PortfolioEntry[];
  logo: string | null;
  testimonialQuote: string;
  testimonialName: string;
  testimonialTitle: string;
  brandStatement: string;
}
