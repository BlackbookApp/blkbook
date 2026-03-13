'use client';

import { useState } from 'react';
import { useProfile } from '@/hooks/use-profile';
import { UserPlus, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { InviteSheet } from '@/components/invite-sheet';
import { ShareProfileModal } from '@/components/share-profile-modal';
import { Skeleton } from '@/components/ui/skeleton';
import { ProfileCard } from '@/components/my-blackbook/profile-card';

const MyBlackbook = () => {
  const { data: profile, isLoading } = useProfile();
  const [showShare, setShowShare] = useState(false);

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
            <span className="text-bb-dark">{profile?.is_published ? 'Live' : 'Not published'}</span>
            <span className="mx-2 ">|</span>
            <span className="">Your first impression starts here</span>
          </p>
        </motion.div>

        {/* Profile Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.01 }}
        >
          {isLoading || !profile ? (
            <div className="border border-border mb-6 bg-background p-6 space-y-3">
              <Skeleton className="w-full aspect-[4/5]" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          ) : (
            <ProfileCard profile={profile} />
          )}
        </motion.div>

        {/* Invite + Share CTAs */}
        <motion.div
          className="mt-8 flex gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <InviteSheet>
            <Button variant="blackbook-secondary" className="flex-1">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite
            </Button>
          </InviteSheet>
          <Button
            variant="blackbook-secondary"
            className="flex-1"
            onClick={() => setShowShare(true)}
            disabled={!profile?.username}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </motion.div>

        {profile?.username && (
          <ShareProfileModal
            open={showShare}
            onClose={() => setShowShare(false)}
            username={profile.username}
          />
        )}

        {/* Bottom Tagline */}
        <motion.p
          className="text-center blackbook-label mt-12"
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
