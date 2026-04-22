'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useProfileView } from '@/contexts/profile-view-context';
import { ProfileCTA } from '@/components/public-profile/shared/profile-cta';

interface ProfileHeroCenteredData {
  name: string | null;
  image_url: string | null;
  tagline: string | null;
  location: string | null;
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-6 text-center">
      <p className="font-helvetica text-[9px] uppercase tracking-[0.2em] text-bb-muted/40">
        {message}
      </p>
    </div>
  );
}

export function ProfileHeroCentered({ data }: { data: ProfileHeroCenteredData }) {
  const profileView = useProfileView();

  if (!data.name && !data.image_url && !data.tagline) {
    return <EmptyState message="Add your name and photo" />;
  }

  return (
    <div className="w-full">
      {/* Name + tagline above image */}
      {(data.name || data.tagline) && (
        <motion.div
          className="text-right mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {data.name && (
            <motion.h1
              className="font-granjon text-xl uppercase tracking-[0.01em] leading-tight text-foreground"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {data.name}
            </motion.h1>
          )}
          {data.tagline && (
            <p className="font-granjon italic text-[17px] tracking-tight text-foreground">
              {data.tagline}
            </p>
          )}
          {data.location && (
            <p className="font-helvetica text-[10px] uppercase tracking-[0.1em] text-bb-muted mt-1">
              {data.location}
            </p>
          )}
        </motion.div>
      )}

      {/* Image */}
      {data.image_url ? (
        <motion.div
          className="relative w-full aspect-[3/4] border border-bb-rule overflow-hidden"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Image
            src={data.image_url}
            alt={data.name ?? 'Profile photo'}
            fill
            sizes="(max-width: 448px) 100vw, 448px"
            priority
            className="object-cover"
          />
        </motion.div>
      ) : (
        <div className="w-full aspect-[3/4] border border-bb-rule bg-bb-rule/30 flex items-center justify-center">
          <span className="font-helvetica text-[9px] uppercase tracking-[0.2em] text-bb-muted/40">
            No photo yet
          </span>
        </div>
      )}

      {/* CTA buttons — only on public profile */}
      {profileView && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <ProfileCTA {...profileView} textOnly />
        </motion.div>
      )}
    </div>
  );
}
