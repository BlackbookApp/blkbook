'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import Logo from '@/components/Logo';
import { SocialBlock } from './shared/social-block';
import { ProfileCTA } from './shared/profile-cta';
import { HeroPortrait } from './shared/hero-portrait';
import { buildSocials } from './shared/profile-adapters';
import { ProfileViewProvider } from '@/contexts/profile-view-context';
import { useUser } from '@/hooks/use-user';
import BottomNav from '@/components/BottomNav';
import type {
  ProfileData,
  PortfolioItem,
  Testimonial,
  ProfileTheme,
} from './public-profile-visual';

interface PublicProfileEditorialProps {
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

const PublicProfileEditorial = ({
  profile,
  portfolio,
  testimonials = [],
  isPreview = false,
  profileId = '',
  profileOwnerId = '',
  profileUsername = '',
}: PublicProfileEditorialProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const { data: user } = useUser();
  const isAuthed = !!user;

  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.7]);

  return (
    <ProfileViewProvider
      value={{
        profileId,
        profileOwnerId,
        profileFirstName: profile.name.split(' ')[0],
        profileUsername,
        profileName: profile.name,
        profileRole: profile.role,
        profilePhotoUrl: profile.portraitSrc,
        socialLinks: profile.socialLinks ?? {},
      }}
    >
      <div ref={containerRef} data-pg-theme="blanc" className="blackbook-container bg-background">
        <div className={`px-6 pt-4 min-h-screen animate-fade-in ${isAuthed ? 'pb-28' : 'pb-8'}`}>
          {/* Header */}
          <div className="mb-16">
            <Logo />
          </div>

          {/* Hero */}
          <motion.div style={{ opacity: heroOpacity }}>
            <HeroPortrait
              name={profile.name}
              portraitSrc={profile.portraitSrc}
              subtitle={profile.role}
              location={profile.location}
            />
          </motion.div>

          {/* Bio / tagline */}
          {profile.bio && (
            <motion.div
              className="py-3 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              viewport={{ once: true, margin: '-60px' }}
            >
              <p className="text-xs font-medium tracking-tight uppercase leading-relaxed max-w-xs mx-auto">
                {profile.bio}
              </p>
            </motion.div>
          )}

          <div className="h-16" />

          {/* Portfolio */}
          {portfolio.length > 0 && (
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
                {portfolio.map((item, i) => (
                  <motion.div
                    key={item.imageSrc}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: i * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
                    viewport={{ once: true, margin: '-40px' }}
                  >
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
                            src={item.imageSrc}
                            alt={item.title ?? `Portfolio ${i + 1}`}
                            width={400}
                            height={300}
                            className="w-full h-auto object-cover block"
                            unoptimized
                          />
                        </motion.div>
                      </div>
                    </div>
                    {(item.title || item.location || item.year) && (
                      <div className="border-l-2 border-border pl-4 ml-4">
                        {item.title && (
                          <h3 className="text-xs font-medium tracking-tight uppercase text-foreground">
                            {item.title}
                          </h3>
                        )}
                        {item.location && (
                          <p className="text-[10px] text-muted-foreground tracking-wide leading-relaxed mt-0.5">
                            {item.location}
                          </p>
                        )}
                        {item.year && (
                          <p className="text-[10px] text-muted-foreground/40 tracking-wide mt-0.5">
                            {item.year}
                          </p>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          <div className="my-10 h-px bg-border" />

          {/* Brand statement */}
          {profile.brandStatement && (
            <motion.section
              className="py-10 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
              viewport={{ once: true, margin: '-60px' }}
            >
              <p className="text-xs font-medium tracking-tight uppercase leading-relaxed max-w-xs mx-auto">
                {profile.brandStatement}
              </p>
            </motion.section>
          )}

          {/* Testimonials */}
          {testimonials[0] && (
            <motion.section
              className="py-10 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
              viewport={{ once: true, margin: '-60px' }}
            >
              <p className="text-xs font-medium tracking-tight uppercase leading-relaxed max-w-xs mx-auto">
                {testimonials[0].quote}
              </p>
              {testimonials[0].author && (
                <p className="text-[10px] text-muted-foreground/50 mt-3 uppercase tracking-[0.2em]">
                  — {testimonials[0].author}
                </p>
              )}
            </motion.section>
          )}

          {/* Logo */}
          {profile.logoSrc && (
            <>
              <div className="my-6 h-px bg-border" />
              <div className="flex justify-center mb-6">
                <div className="relative h-4 w-28">
                  <Image src={profile.logoSrc} alt={profile.name} fill className="object-contain" />
                </div>
              </div>
            </>
          )}

          <div className="my-6 h-px bg-border" />

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

          <div className="h-20" />

          {/* Footer */}
          <div className="text-center mb-12">
            <div className="flex justify-center">
              <Logo />
            </div>
          </div>
        </div>

        {isAuthed && <BottomNav />}
      </div>
    </ProfileViewProvider>
  );
};

export default PublicProfileEditorial;
