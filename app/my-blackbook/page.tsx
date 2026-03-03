'use client';

import { useRouter } from 'next/navigation';
import { routes } from '@/lib/routes';
import { demoProfile } from '@/lib/demo-data/profiles';
import { Pencil, ExternalLink, Eye, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Logo from '@/components/Logo';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { InviteSheet } from '@/components/invite-sheet';

// Profile data (would come from user context in real app)
import juliaPortrait from '@/assets/julia-reyes-portrait.jpg';
import portfolio1 from '@/assets/portfolio-1.jpg';
import portfolio2 from '@/assets/portfolio-2.jpg';
import portfolio3 from '@/assets/portfolio-3.jpg';

const MyBlackbook = () => {
  const router = useRouter();

  const profile = { ...demoProfile, portfolioImages: [portfolio1, portfolio2, portfolio3] };

  return (
    <div className="blackbook-container bg-background">
      <div className="blackbook-page !py-6 pb-28">
        <Logo />

        {/* Header */}
        <motion.div
          className="mt-10 mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display font-light text-[19px] tracking-[0.01em] uppercase text-bb-dark mb-1">
            Your Blackbook Profile
          </h1>
          <p className="blackbook-label">
            <span className="text-bb-dark">Live</span>
            <span className="mx-2 text-bb-muted">|</span>
            <span className="text-bb-muted">Your first impression starts here</span>
          </p>
        </motion.div>

        {/* Profile Preview Card */}
        <motion.div
          className="border border-border overflow-hidden mb-6 bg-background"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.01 }}
        >
          {/* Large Portrait */}
          <div
            className="aspect-[4/5] relative cursor-pointer group"
            onClick={() => router.push(routes.creativeDirector)}
          >
            <Image src={juliaPortrait} alt={profile.name} fill className="object-cover" />

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 px-4 py-2 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span className="blackbook-label">View Live Profile</span>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(routes.editProfile);
              }}
              className="absolute top-4 right-4 p-3 bg-background/90 backdrop-blur-sm hover:bg-background transition-colors border border-border"
              aria-label="Edit profile"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-display font-light text-[15px] uppercase mb-0.5">
                  {profile.name}
                </h2>
                <p className="blackbook-label text-bb-muted">{profile.title}</p>
                <p className="blackbook-label text-bb-muted mt-1">{profile.location}</p>
              </div>
            </div>

            {/* Mini Portfolio Strip */}
            <div className="flex gap-2 mb-4">
              {profile.portfolioImages.map((img, i) => (
                <div
                  key={i}
                  className="relative flex-1 aspect-square overflow-hidden border border-border"
                >
                  <Image src={img} alt={`Work ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>

            {/* Profile Link */}
            <div className="flex items-center gap-2 blackbook-label text-bb-muted">
              <ExternalLink className="w-3 h-3" />
              <span>blkbook.me/{profile.handle}</span>
            </div>
          </div>
        </motion.div>

        {/* Analytics Insight */}
        <motion.div
          className="flex items-center justify-between px-1 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="blackbook-label text-bb-muted">Last viewed {profile.lastViewed}</p>
          <p className="blackbook-label text-bb-muted">
            <span className="text-bb-dark font-bold">{profile.viewsThisWeek}</span> views this week
          </p>
        </motion.div>

        {/* Invite CTA */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <InviteSheet>
            <Button variant="blackbook-secondary" className="w-full">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Someone
            </Button>
          </InviteSheet>
        </motion.div>

        {/* Bottom Tagline */}
        <motion.p
          className="text-center blackbook-label text-bb-muted mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Curate your presence
        </motion.p>
      </div>

      <BottomNav />
    </div>
  );
};

export default MyBlackbook;
