'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import ExchangeDetailsModal from '@/components/ExchangeDetailsModal';
import Logo from '../Logo';
import { SocialBlock } from './shared/social-block';
import { ContactBlock } from './shared/contact-block';
import { HeroPortrait } from './shared/hero-portrait';
import { buildSocials, buildContactMethods } from './shared/profile-adapters';
import type { SocialLinks } from '@/lib/data/profiles';

export type ProfileTheme = 'blanc' | 'beige' | 'noir';

export interface ProfileData {
  name: string;
  bio?: string | null;
  role?: string | null;
  location?: string | null;
  logoSrc?: string | null;
  portraitSrc?: string | null;
  socialLinks?: SocialLinks;
  brandStatement?: string | null;
}

export interface PortfolioItem {
  title?: string | null;
  location?: string | null;
  year?: string | null;
  imageSrc: string;
}

export interface Testimonial {
  quote: string;
  author?: string | null;
}

// ── Small reusable pieces ──────────────────────────────────

const PortfolioFrame = ({
  src,
  alt,
  className,
}: {
  src?: string;
  alt?: string;
  className?: string;
}) => (
  <div
    className={cn(
      'relative overflow-hidden aspect-[3/4] border-2 border-[var(--pg-border-image)]',
      className
    )}
  >
    {src && <Image src={src} alt={alt ?? ''} fill className="object-cover" />}
  </div>
);

// ── Parallax sub-components ────────────────────────────────

const PARALLAX_LAYOUTS = [
  { width: 'w-1/2', align: 'justify-start' },
  { width: 'w-2/5', align: 'justify-end' },
  { width: 'w-1/2', align: 'justify-center' },
  { width: 'w-2/5', align: 'justify-start' },
] as const;

const ParallaxPortfolio = ({ src, alt, index }: { src: string; alt?: string; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const layout = PARALLAX_LAYOUTS[index % PARALLAX_LAYOUTS.length];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true, margin: '-80px' }}
      className={`flex flex-col ${layout.align}`}
    >
      <div className={layout.width}>
        <PortfolioFrame src={src} alt={alt} />
      </div>
    </motion.div>
  );
};

const ParallaxTestimonial = ({ quote, author }: { quote: string; author?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <motion.div ref={ref} style={{ opacity, y }} className="py-16 text-center">
      <p className="text-[13px] font-normal font-helvetica tracking-tight uppercase leading-snug max-w-xs inline-block text-[var(--pg-fg)]">
        {quote}
      </p>
      {author && (
        <p className="text-[12px] mt-2 uppercase tracking-[0.01em] font-light font-canela-deck text-[var(--pg-muted-fg)]">
          — {author}
        </p>
      )}
    </motion.div>
  );
};

// ── Main component ─────────────────────────────────────────

interface PhotographerProfileProps {
  theme?: ProfileTheme;
  profile: ProfileData;
  portfolio: PortfolioItem[];
  testimonials?: Testimonial[];
  profileStyle: 'visual' | 'editorial';
  isPreview?: boolean;
}

const PublicProfile = ({
  theme = 'blanc',
  profile,
  portfolio,
  testimonials = [],
  isPreview = false,
}: PhotographerProfileProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const [showExchange, setShowExchange] = useState(false);

  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.6]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.98]);

  return (
    <div ref={containerRef} data-pg-theme={theme} className="max-w-md mx-auto min-h-screen">
      <div className="px-6 pt-28 pb-8 min-h-screen animate-fade-in">
        {/* Hero */}
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }}>
          <HeroPortrait
            name={profile.name}
            portraitSrc={profile.portraitSrc}
            subtitle={profile.bio}
            location={profile.location}
          />
        </motion.div>

        <div className="my-8" />

        {portfolio.length > 0 && (
          <>
            <div className="mb-10">
              <div className="flex flex-col gap-16 py-2">
                {Array.from({ length: Math.ceil(portfolio.length / 4) }, (_, blockIndex) => {
                  const block = portfolio.slice(blockIndex * 4, blockIndex * 4 + 4);
                  const testimonial0 = testimonials[blockIndex * 2];
                  const testimonial1 = testimonials[blockIndex * 2 + 1];

                  return (
                    <div key={blockIndex} className="space-y-4">
                      {/* Image 0: full-width parallax */}
                      <div>
                        <ParallaxPortfolio
                          src={block[0].imageSrc}
                          alt={block[0].title ?? undefined}
                          index={blockIndex * 4}
                        />
                        {testimonial0 && (
                          <ParallaxTestimonial
                            quote={testimonial0.quote}
                            author={testimonial0.author || undefined}
                          />
                        )}
                      </div>

                      {/* Images 1 & 2: staggered pair */}
                      {(block[1] || block[2]) && (
                        <motion.div
                          className="flex gap-4 items-start"
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                          viewport={{ once: true, margin: '-80px' }}
                        >
                          {block[2] && (
                            <div className="w-2/5">
                              <PortfolioFrame
                                src={block[2].imageSrc}
                                alt={block[2].title ?? undefined}
                              />
                            </div>
                          )}
                          {block[1] && (
                            <div className={`w-2/5 ml-auto${block[2] ? ' mt-12' : ''}`}>
                              <PortfolioFrame
                                src={block[1].imageSrc}
                                alt={block[1].title ?? undefined}
                              />
                            </div>
                          )}
                        </motion.div>
                      )}

                      {testimonial1 && (
                        <ParallaxTestimonial
                          quote={testimonial1.quote}
                          author={testimonial1.author || undefined}
                        />
                      )}

                      {/* Image 3: centered */}
                      {block[3] && (
                        <motion.div
                          className="flex justify-center"
                          initial={{ opacity: 0, y: 50 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                          viewport={{ once: true, margin: '-80px' }}
                        >
                          <div className="w-3/5">
                            <PortfolioFrame
                              src={block[3].imageSrc}
                              alt={block[3].title ?? undefined}
                            />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="my-8 h-px bg-[var(--pg-separator)]" />

            {/* Logo */}
            {profile.logoSrc && (
              <div className="flex justify-center mb-6">
                <div className="relative h-12 w-full aspect-[4/1]">
                  <Image src={profile.logoSrc} alt={profile.name} fill className="object-contain" />
                </div>
              </div>
            )}
          </>
        )}

        {portfolio.length === 0 && (
          <p className="text-center text-[11px] uppercase tracking-wide text-[var(--pg-muted-fg)] py-16 px-4">
            Your portfolio and contact details will appear here once you add them.
          </p>
        )}

        {/* Social links */}
        <SocialBlock socials={buildSocials(profile.socialLinks ?? {})} />

        {/* CTAs */}
        <ContactBlock
          methods={buildContactMethods(profile.socialLinks ?? {}, {
            onSaveContact: () => {},
            onExchangeDetails: () => setShowExchange(true),
          })}
        />

        {/* Footer */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Logo />
        </motion.div>
      </div>

      <ExchangeDetailsModal
        open={isPreview ? false : showExchange}
        onClose={() => setShowExchange(false)}
        firstName={profile.name.split(' ')[0]}
      />
    </div>
  );
};

export default PublicProfile;
