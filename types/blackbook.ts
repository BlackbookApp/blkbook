export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  city?: string;
  context?: string;
  bio?: string;
  photo?: string;
  portfolioImages?: string[];
  instagram?: string;
  website?: string;
  notes?: string;
  createdAt: Date;
  type: 'person' | 'note' | 'place';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  bio?: string;
  photo?: string;
  portfolioImages?: string[];
  links?: {
    instagram?: string;
    website?: string;
    twitter?: string;
    linkedin?: string;
  };
  membershipType: 'guest' | 'member';
  createdAt: Date;
}

export type TabType = 'all' | 'people' | 'notes' | 'places';
