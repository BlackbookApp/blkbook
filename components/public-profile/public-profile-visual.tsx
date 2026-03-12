'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { SocialBlock } from './shared/social-block';
import { ProfileCTA } from './shared/profile-cta';
import { HeroPortrait } from './shared/hero-portrait';
import { buildSocials } from './shared/profile-adapters';
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

// ── Constants ─────────────────────────────────────────────

// 4-position repeating pattern per block
const BLOCK_LAYOUTS = [
  { width: 'w-[70%]', justify: '', aspect: 'aspect-[3/4]' },
  { width: 'w-[50%]', justify: 'justify-end', aspect: 'aspect-[3/4]' },
  { width: 'w-[45%]', justify: '', aspect: 'aspect-[4/5]' },
  { width: 'w-[55%]', justify: 'justify-center', aspect: 'aspect-[3/4]' },
] as const;

// ── Parallax sub-components ────────────────────────────────

const ParallaxImage = ({
  src,
  alt,
  posInBlock,
}: {
  src: string;
  alt?: string;
  posInBlock: number;
}) => {
  const layout = BLOCK_LAYOUTS[posInBlock];
  return (
    <motion.div
      className={`flex ${layout.justify}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true, margin: '-60px' }}
    >
      <div
        className={cn(
          layout.width,
          layout.aspect,
          'overflow-hidden border border-[var(--pg-separator)]'
        )}
      >
        <motion.img
          src={src}
          alt={alt ?? ''}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.8 }}
        />
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
      <p className="font-granjon italic text-[15px] leading-relaxed max-w-[260px] mx-auto text-[var(--pg-fg)]">
        {quote}
      </p>
      {author && (
        <p className="font-granjon font-normal text-[11px] tracking-[0.12em] uppercase mt-3 text-[var(--pg-muted-fg)]">
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
  profileId?: string;
  profileOwnerId?: string;
  profileUsername?: string;
}

const PublicProfile = ({
  theme = 'blanc',
  profile,
  portfolio,
  testimonials = [],
  isPreview = false,
  profileId = '',
  profileOwnerId = '',
  profileUsername = '',
}: PhotographerProfileProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.6]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.98]);

  return (
    <div ref={containerRef} data-pg-theme={theme} className="max-w-md mx-auto min-h-screen">
      {/* Fixed wordmark */}
      <div className="fixed top-0 left-0 z-50 pt-6 pl-6">
        <span className="font-granjon font-normal text-[12px] tracking-[0.15em] uppercase text-[var(--pg-ghost)]">
          BLKBOOK.
        </span>
      </div>

      <div className="px-6 pt-28 pb-8 min-h-screen animate-fade-in">
        {/* Hero */}
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }}>
          <HeroPortrait
            name={profile.name}
            portraitSrc={profile.portraitSrc}
            subtitle={profile.role}
            location={profile.location}
          />
        </motion.div>

        {!isPreview && (
          <ProfileCTA
            compact
            profileId={profileId}
            profileOwnerId={profileOwnerId}
            profileFirstName={profile.name.split(' ')[0]}
            profileUsername={profileUsername}
            profileName={profile.name}
            profileRole={profile.role}
            profilePhotoUrl={profile.portraitSrc}
            socialLinks={profile.socialLinks ?? {}}
          />
        )}

        {portfolio.length > 0 && (
          <>
            <div className="mb-10">
              <div className="flex flex-col gap-16 py-2">
                {Array.from({ length: Math.ceil(portfolio.length / 4) }, (_, blockIndex) => {
                  const block = portfolio.slice(blockIndex * 4, blockIndex * 4 + 4);
                  return block.map((item, posInBlock) => {
                    const testimonial = testimonials[blockIndex * 4 + posInBlock];
                    return (
                      <div key={`${blockIndex}-${posInBlock}`}>
                        <ParallaxImage
                          src={item.imageSrc}
                          alt={item.title ?? undefined}
                          posInBlock={posInBlock}
                        />
                        {testimonial && (
                          <ParallaxTestimonial
                            quote={testimonial.quote}
                            author={testimonial.author || undefined}
                          />
                        )}
                      </div>
                    );
                  });
                })}
              </div>
            </div>

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

        {!isPreview && (
          <ProfileCTA
            profileId={profileId}
            profileOwnerId={profileOwnerId}
            profileFirstName={profile.name.split(' ')[0]}
            profileUsername={profileUsername}
            profileName={profile.name}
            profileRole={profile.role}
            profilePhotoUrl={profile.portraitSrc}
            socialLinks={profile.socialLinks ?? {}}
          />
        )}

        <Separator className="my-14 bg-[var(--pg-separator)]" />

        {/* Footer */}
        <motion.div
          className="text-center pb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <span className="font-granjon font-normal text-[18px] tracking-[0.15em] uppercase text-[var(--pg-fg)]">
            BLKBOOK.
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default PublicProfile;
