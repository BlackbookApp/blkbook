'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useUser } from '@/hooks/use-user';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { SocialBlock } from './shared/social-block';
import { ProfileCTA } from './shared/profile-cta';
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
  recommendedBy?: string[] | null;
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
  const [isVisible, setIsVisible] = useState(false);
  const [hiddenY, setHiddenY] = useState(40);

  return (
    <motion.div
      className={`flex ${layout.justify}`}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      custom={hiddenY}
      variants={{
        hidden: (y: number) => ({
          opacity: 0,
          y,
          transition: { duration: 0 },
        }),
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1] },
        },
      }}
      onViewportEnter={() => setIsVisible(true)}
      onViewportLeave={(entry) => {
        // Determine which direction this element will re-enter from:
        // top < 0  → element is above viewport (scrolled down past it) → next entry from above
        // top >= 0 → element is below viewport (scrolled up past it)  → next entry from below
        setHiddenY(entry && entry.boundingClientRect.top < 0 ? -40 : 40);
        setIsVisible(false);
      }}
      viewport={{ margin: '-60px' }}
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
  profileId = '',
  profileOwnerId = '',
  profileUsername = '',
}: PhotographerProfileProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: user } = useUser();
  const isOwner = !!user && user.id === profileOwnerId;
  const isAuthed = !!user;
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.6]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.98]);

  return (
    <div
      ref={containerRef}
      data-pg-theme={theme}
      className="max-w-md mx-auto min-h-screen relative"
    >
      {/* Fixed wordmark */}
      <div className="fixed top-0 left-0 z-50 pt-6 pl-6">
        <span className="font-granjon font-normal text-[13px] tracking-[0.06em] uppercase text-[var(--pg-ghost)]">
          BLKBOOK.
        </span>
      </div>

      <div className={cn('px-6 pt-28 min-h-screen animate-fade-in', isAuthed ? 'pb-28' : 'pb-8')}>
        {/* Hero */}
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="mb-0">
          {/* Name & Title — right aligned, above portrait */}
          <motion.div
            className="text-right mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.h1
              className="font-granjon font-normal text-xl tracking-[0.01em] uppercase leading-tight text-[var(--pg-fg)]"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {profile.name}
            </motion.h1>
            {profile.role && (
              <p className="font-granjon italic text-[17px] tracking-tight text-[var(--pg-fg)]">
                {profile.role}
              </p>
            )}
          </motion.div>

          {/* Portrait */}
          <motion.div
            className="relative w-full aspect-[3/4] overflow-hidden border border-bb-dark mt-2"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {profile.portraitSrc ? (
              <Image src={profile.portraitSrc} alt={profile.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-[var(--pg-border-image)]" />
            )}
          </motion.div>
        </motion.div>

        <ProfileCTA
          textOnly
          profileId={profileId}
          profileOwnerId={profileOwnerId}
          profileFirstName={profile.name.split(' ')[0]}
          profileUsername={profileUsername}
          profileName={profile.name}
          profileRole={profile.role}
          profilePhotoUrl={profile.portraitSrc}
          socialLinks={profile.socialLinks ?? {}}
        />

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

            {/* Recommended by */}
            {profile.recommendedBy && profile.recommendedBy.length > 0 && (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <p className="font-helvetica font-normal text-[9px] uppercase tracking-[0.25em] mb-5 text-[var(--pg-muted-fg)]">
                  Recommended by
                </p>
                <div className="space-y-1">
                  {profile.recommendedBy.map((name) => (
                    <p
                      key={name}
                      className="font-granjon font-normal text-[15px] uppercase tracking-[0.1em] text-[var(--pg-fg)]"
                    >
                      {name}
                    </p>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}

        {portfolio.length === 0 && (
          <p className="text-center text-[11px] uppercase tracking-wide text-[var(--pg-muted-fg)] py-16 px-4">
            {isOwner
              ? 'Your portfolio and contact details will appear here once you add them.'
              : `${profile.name.split(' ')[0]} hasn't added their work yet.`}
          </p>
        )}

        {/* Social links */}
        <SocialBlock socials={buildSocials(profile.socialLinks ?? {})} />

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

        <Separator className="my-14 bg-[var(--pg-separator)]" />

        {/* Footer */}
        <motion.div
          className="text-center pb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <span className="font-granjon font-normal text-[18px] tracking-[0.06em] uppercase text-[var(--pg-ghost)]">
            BLKBOOK.
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default PublicProfile;
