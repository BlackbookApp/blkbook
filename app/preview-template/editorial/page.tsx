import EcommerceSpecialistProfile from '@/components/public-profile/public-profile-editorial';

import juliaPortrait from '@/assets/julia-reyes-portrait.jpg';
import portfolio1 from '@/assets/portfolio-1.jpg';
import portfolio2 from '@/assets/portfolio-2.jpg';
import portfolio3 from '@/assets/portfolio-3.jpg';
import portfolio4 from '@/assets/portfolio-4.jpg';
import { ProfileTheme } from '@/components/public-profile/public-profile-visual';

const THEMES: ProfileTheme[] = ['blanc', 'beige', 'noir'];

const demoProfile = {
  name: 'Julia Reyes',
  bio: 'Photographer & Creative Director',
  role: 'Photographer',
  location: 'Brooklyn, NY',
  portraitSrc: juliaPortrait.src,
  socialLinks: {
    instagram: 'juliareyes',
    website: 'juliareyes.com',
    phone: '+12125550100',
  },
};

const demoPortfolio = [
  { imageSrc: portfolio1.src, title: 'Untitled I' },
  { imageSrc: portfolio2.src, title: 'Untitled II' },
  { imageSrc: portfolio3.src, title: 'Untitled III' },
  { imageSrc: portfolio4.src, title: 'Untitled IV' },
];

const demoTestimonials = [
  {
    quote: 'Julia brings a quiet intensity to every frame. Her eye for light is unmatched.',
    author: 'Marc Duchamp, Art Director',
  },
  {
    quote: 'Working with Julia changed how we think about visual storytelling.',
    author: 'Sasha Kim, Editor',
  },
];
export default function PreviewEditorialTemplate() {
  return (
    <EcommerceSpecialistProfile
      profileStyle="editorial"
      theme={THEMES[0]}
      profile={demoProfile}
      portfolio={demoPortfolio}
      testimonials={demoTestimonials}
    />
  );
}
