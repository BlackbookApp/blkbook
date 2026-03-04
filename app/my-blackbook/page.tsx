'use client';

import { useProfile } from '@/hooks/use-profile';
import { UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';
import BottomNav from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { InviteSheet } from '@/components/invite-sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { ProfileCard } from '@/components/my-blackbook/profile-card';

const MyBlackbook = () => {
  const { data: profile, isLoading } = useProfile();

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
            <span className="mx-2 text-bb-muted">|</span>
            <span className="text-bb-muted">Your first impression starts here</span>
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

        {/* Analytics Insight */}
        <motion.div
          className="flex items-center justify-between px-1 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="blackbook-label text-bb-muted">Last viewed 2 hours ago</p>
          <p className="blackbook-label text-bb-muted">
            <span className="text-bb-dark font-bold">47</span> views this week
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
