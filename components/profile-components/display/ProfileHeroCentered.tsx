'use client';

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
        <div className="text-right mb-2">
          {data.name && (
            <h1 className="font-granjon text-xl uppercase tracking-[0.01em] leading-tight text-foreground">
              {data.name}
            </h1>
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
        </div>
      )}

      {/* Image */}
      {data.image_url ? (
        <div className="w-full aspect-[3/4] border border-bb-rule overflow-hidden">
          <img
            src={data.image_url}
            alt={data.name ?? 'Profile photo'}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full aspect-[3/4] border border-bb-rule bg-bb-rule/30 flex items-center justify-center">
          <span className="font-helvetica text-[9px] uppercase tracking-[0.2em] text-bb-muted/40">
            No photo yet
          </span>
        </div>
      )}

      {/* CTA buttons — only on public profile */}
      {profileView && <ProfileCTA {...profileView} textOnly />}
    </div>
  );
}
