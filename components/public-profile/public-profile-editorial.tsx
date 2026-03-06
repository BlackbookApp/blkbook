'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import ExchangeDetailsModal from '@/components/ExchangeDetailsModal';
import Logo from '@/components/Logo';
import { SocialBlock } from './shared/social-block';
import { ContactBlock } from './shared/contact-block';
import { HeroPortrait } from './shared/hero-portrait';
import { buildSocials, buildContactMethods } from './shared/profile-adapters';

import jaiPortrait from '@/assets/jai-sandhu-portrait.jpg';
import portfolioAndAndAnd from '@/assets/portfolio-and-and-and.png';
import portfolioFendi from '@/assets/portfolio-fendi.png';
import portfolioGivenchy from '@/assets/portfolio-givenchy.png';

const profile = {
  name: 'Jai Sandhu',
  title: 'Luxury E-Commerce Specialist',
  location: 'London · Global',
  tagline: 'New worlds of artistic expression',
  bio: 'A continuous exploration into form and function with purpose. A holistic approach that combines strategic thinking, design and development to create compelling digital narratives.',
  philosophy:
    'Our modern luxury is time, a commodity that need not be wasted. We believe in making complex systems easy to understand.',
  socialLinks: {
    instagram: 'jaisandhu',
    linkedin: 'jaisandhu',
    website: 'jaisand.hu',
    phone: '+447700900000',
  },
};

const clients = [
  {
    name: 'Fendi',
    description: 'Luxury fashion maison redesign',
    collaborator: 'No Plans & Futurimpose',
    image: portfolioFendi,
  },
  {
    name: 'Givenchy',
    description: 'Luxury fashion maison redesign',
    collaborator: 'No Plans',
    image: portfolioGivenchy,
  },
  {
    name: 'And And And Studio',
    description: 'Beverly Hills architecture, full service',
    collaborator: 'No Plans Studio',
    image: portfolioAndAndAnd,
  },
  {
    name: 'Amiri',
    description: 'LA-based luxury fashion brand redesign',
    collaborator: 'No Plans Studio',
    image: null,
  },
  {
    name: 'About Blank',
    description: 'Luxury streetwear with drop-based anticipation',
    collaborator: 'No Plans Studio',
    image: null,
  },
  {
    name: 'YMC',
    description: 'London-based fashion brand redesign',
    collaborator: 'No Plans Studio',
    image: null,
  },
  {
    name: 'Miško Vault',
    description: 'Rare gemstone discovery & investment platform',
    collaborator: 'Atma World',
    image: null,
  },
];
const PublicProfileEditoral = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showExchange, setShowExchange] = useState(false);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.7]);

  return (
    <div ref={containerRef} data-pg-theme="blanc" className="blackbook-container bg-background">
      <div className="px-6 pt-4 pb-8 min-h-screen animate-fade-in">
        {/* Header */}
        <div className="mb-16">
          <Logo />
        </div>

        {/* Hero */}
        <motion.div style={{ opacity: heroOpacity }}>
          <HeroPortrait
            name={profile.name}
            portraitSrc={jaiPortrait}
            subtitle={profile.title}
            location={profile.location}
          />
        </motion.div>

        {/* Quote */}
        <motion.div
          className="py-3 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true, margin: '-60px' }}
        >
          <p className="text-xs font-medium tracking-tight uppercase leading-relaxed max-w-xs mx-auto">
            Working globally across commerce, culture and luxury fashion
          </p>
          <p className="text-[10px] text-muted-foreground/50 mt-2 uppercase tracking-[0.2em]">
            Jai Sandhu Studio
          </p>
        </motion.div>

        <div className="h-16" />

        {/* Portfolio */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-60px' }}
        >
          <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground/60 mb-6 px-4">
            Portfolio
          </p>

          <div className="space-y-8">
            {clients.map((client, i) => (
              <motion.div
                key={client.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
                viewport={{ once: true, margin: '-40px' }}
              >
                {client.image && (
                  <div className="px-4 mb-3">
                    <div
                      className="overflow-hidden"
                      style={{ border: '2px solid hsl(40 30% 88%)' }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                      >
                        <Image
                          src={client.image}
                          alt={client.name}
                          className="w-full h-auto object-cover block"
                        />
                      </motion.div>
                    </div>
                  </div>
                )}
                <div className="border-l-2 border-border pl-4 ml-4">
                  <h3 className="text-xs font-medium tracking-tight uppercase text-foreground">
                    {client.name}
                  </h3>
                  <p className="text-[10px] text-muted-foreground tracking-wide leading-relaxed mt-0.5">
                    {client.description}
                  </p>
                  <p className="text-[10px] text-muted-foreground/40 tracking-wide mt-0.5">
                    with {client.collaborator}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <div className="my-10 h-px bg-border" />

        {/* Philosophy — centered quote */}
        <motion.section
          className="py-14 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true, margin: '-60px' }}
        >
          <p className="text-xs font-medium tracking-tight uppercase leading-relaxed max-w-xs mx-auto">
            {profile.philosophy}
          </p>
        </motion.section>

        <div className="my-6 h-px bg-border" />

        {/* Social links */}
        <SocialBlock socials={buildSocials(profile.socialLinks)} />

        {/* Contact CTAs */}
        <ContactBlock
          methods={buildContactMethods(profile.socialLinks, {
            onSaveContact: () => {},
            onExchangeDetails: () => setShowExchange(true),
          })}
        />

        <div className="h-20" />

        {/* Footer */}
        <div className="text-center mb-12">
          <div className="flex justify-center">
            <Logo />
          </div>
        </div>
      </div>

      <ExchangeDetailsModal
        open={showExchange}
        onClose={() => setShowExchange(false)}
        firstName={profile.name.split(' ')[0]}
      />
    </div>
  );
};

export default PublicProfileEditoral;
