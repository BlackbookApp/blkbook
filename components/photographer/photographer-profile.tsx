'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import ExchangeDetailsModal from '@/components/ExchangeDetailsModal';

export type ProfileTheme = 'blanc' | 'beige' | 'noir';

export interface ProfileData {
  name: string;
  profession: string;
  location: string;
  email: string;
  instagram: string;
  website: string;
  logoSrc?: string;
  portraitSrc: string;
  socialStats?: { instagram?: string; tiktok?: string; youtube?: string };
}

export interface PortfolioItem {
  title: string;
  location: string;
  year: string;
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
      'overflow-hidden aspect-[3/4] border-2 border-[var(--pg-border-image)]',
      className
    )}
  >
    <img src={src} alt={alt} className="w-full h-full object-cover" />
  </div>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);

const SocialStat = ({ icon, count }: { icon: React.ReactNode; count: string }) => (
  <div className="flex items-center gap-1.5">
    {icon}
    <span className="text-[11px] tracking-[0.02em] font-light font-canela-deck text-[var(--pg-muted-fg)]">
      {count}
    </span>
  </div>
);

// ── Parallax sub-components ────────────────────────────────

const PARALLAX_LAYOUTS = [
  { width: 'w-1/2', align: 'justify-start' },
  { width: 'w-2/5', align: 'justify-end' },
  { width: 'w-1/2', align: 'justify-center' },
  { width: 'w-2/5', align: 'justify-start' },
] as const;

const ParallaxPortfolio = ({ src, alt, index }: { src: string; alt: string; index: number }) => {
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
}

const PhotographerProfile = ({
  theme = 'blanc',
  profile,
  portfolio,
  testimonials = [],
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
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="mb-8">
          <motion.div
            className="px-10 mb-1 text-right"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.h1
              className="text-xl tracking-[0.01em] uppercase leading-tight font-display font-normal text-[var(--pg-fg)]"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {profile.name}
            </motion.h1>
          </motion.div>

          <div className="mb-2 px-10">
            <motion.div
              className="w-full aspect-[3/4] overflow-hidden border-2 border-[var(--pg-border-image)]"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <img
                src={profile.portraitSrc}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.div
              className="mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p className="text-[12px] tracking-tight uppercase text-[var(--pg-fg)]">
                {profile.profession}
              </p>
              <p className="text-[12px] tracking-tight uppercase text-[var(--pg-muted-fg)]">
                {profile.location}
              </p>
            </motion.div>
          </div>
        </motion.div>

        <div className="my-8" />

        {/* Gallery */}
        <div className="mb-10">
          <div className="space-y-4 py-2">
            <div>
              <ParallaxPortfolio
                src={portfolio[0].imageSrc}
                alt={`${portfolio[0].title} wedding`}
                index={0}
              />
              {testimonials[0] && (
                <ParallaxTestimonial
                  quote={testimonials[0].quote}
                  author={testimonials[0].author || undefined}
                />
              )}
            </div>

            <motion.div
              className="flex gap-4 items-start"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              viewport={{ once: true, margin: '-80px' }}
            >
              <div className="w-2/5">
                <PortfolioFrame src={portfolio[2]?.imageSrc} alt={portfolio[2]?.title} />
              </div>
              <div className="w-2/5 ml-auto mt-12">
                <PortfolioFrame
                  src={portfolio[1]?.imageSrc}
                  alt={`${portfolio[1]?.title} wedding`}
                />
              </div>
            </motion.div>

            {testimonials[1] && (
              <ParallaxTestimonial
                quote={testimonials[1].quote}
                author={testimonials[1].author || undefined}
              />
            )}

            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              viewport={{ once: true, margin: '-80px' }}
            >
              <div className="w-3/5">
                <PortfolioFrame
                  src={portfolio[3]?.imageSrc}
                  alt={`${portfolio[3]?.title} wedding`}
                />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="my-8 h-px bg-[var(--pg-separator)]" />

        {/* Logo */}
        {profile.logoSrc && (
          <div className="flex justify-center mb-6">
            <img src={profile.logoSrc} alt={profile.name} className="h-3 object-contain" />
          </div>
        )}

        {/* Social stats */}
        {profile.socialStats && (
          <div className="flex justify-center items-center gap-8 mb-6">
            {profile.socialStats.instagram && (
              <SocialStat
                icon={<InstagramIcon className="text-[var(--pg-muted-fg)]" />}
                count={profile.socialStats.instagram}
              />
            )}
            {profile.socialStats.tiktok && (
              <SocialStat
                icon={<TikTokIcon className="text-[var(--pg-muted-fg)]" />}
                count={profile.socialStats.tiktok}
              />
            )}
            {profile.socialStats.youtube && (
              <SocialStat
                icon={<YouTubeIcon className="text-[var(--pg-muted-fg)]" />}
                count={profile.socialStats.youtube}
              />
            )}
          </div>
        )}

        {/* CTAs */}
        <div className="mb-8">
          <button className="pg-btn-primary mb-3" onClick={() => {}}>
            Save Contact
          </button>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button className="pg-btn-secondary py-2" onClick={() => {}}>
              WhatsApp
            </button>
            <button
              className="pg-btn-secondary py-2"
              onClick={() => window.open(`https://${profile.website}`, '_blank')}
            >
              Website
            </button>
          </div>
          <button className="pg-btn-secondary w-full py-4" onClick={() => setShowExchange(true)}>
            Exchange Details
          </button>
        </div>

        {/* Footer */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex justify-center py-4">
            <span className="font-canela-deck font-normal text-[18px] tracking-[0.04em] uppercase">
              BLKBOOK
            </span>
          </div>
        </motion.div>
      </div>

      <ExchangeDetailsModal
        open={showExchange}
        onClose={() => setShowExchange(false)}
        firstName={profile.name.split(' ')[0]}
      />
    </div>
  );
};

export default PhotographerProfile;
