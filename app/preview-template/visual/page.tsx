'use client';

import { useState } from 'react';
import PublicProfile from '@/components/public-profile/public-profile-visual';
import type { ProfileTheme } from '@/components/public-profile/public-profile-visual';
import juliaPortrait from '@/assets/julia-reyes-portrait.jpg';
import portfolio1 from '@/assets/portfolio-1.jpg';
import portfolio2 from '@/assets/portfolio-2.jpg';
import portfolio3 from '@/assets/portfolio-3.jpg';
import portfolio4 from '@/assets/portfolio-4.jpg';

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

export default function PreviewVisualTemplate() {
  const [theme] = useState<ProfileTheme>('blanc');

  return (
    <div className="relative">
      <PublicProfile
        theme={theme}
        profile={demoProfile}
        portfolio={demoPortfolio}
        testimonials={demoTestimonials}
        profileStyle="visual"
      />
      {/* Theme switcher */}
      {/* <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center" data-pg-theme={theme}>
        <div className="flex gap-2 px-4 py-2 bg-[var(--pg-bg)]/80 backdrop-blur-sm border border-[var(--pg-separator)]">
          {THEMES.map((t) => (
            <button
              key={t}
              data-pg-theme={t}
              onClick={() => setTheme(t)}
              className={`px-3 py-1 text-[10px] tracking-widest uppercase border transition-opacity ${
                theme === t ? 'opacity-100' : 'opacity-40'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div> */}
    </div>
  );
}
