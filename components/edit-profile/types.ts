export type ProfileStyle = 'visual' | 'editorial' | null;
export type ProfilePalette = 'blanc' | 'noir' | null;

export interface SocialFields {
  website: string;
  instagram: string;
  linkedin: string;
  email: string;
  phone: string;
}

export interface WorkData {
  portfolioImages: string[];
  logo: string | null;
  testimonialQuote: string;
  testimonialName: string;
  testimonialTitle: string;
  brandStatement: string;
}
