'use client';

import { useRouter } from 'next/navigation';
import { routes } from '@/lib/routes';
import type { Profile } from '@/lib/data/profiles';
import { Pencil, ExternalLink, Eye } from 'lucide-react';
import Image from 'next/image';

interface ProfileCardProps {
  profile: Profile;
}

function getInitials(name: string | null): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const router = useRouter();
  const publicProfileUrl = profile.username
    ? routes.publicProfile(profile.username)
    : routes.previewTemplateVisual;

  return (
    <div className="border border-border overflow-hidden mb-6 bg-background">
      {/* Large Portrait */}
      <div
        className="aspect-[4/5] relative cursor-pointer group"
        onClick={() => router.push(publicProfileUrl)}
      >
        {profile.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt={profile.full_name ?? 'Profile'}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-bb-muted/20 flex items-center justify-center">
            <span className="font-display text-4xl text-bb-muted">
              {getInitials(profile.full_name)}
            </span>
          </div>
        )}

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
              {profile.full_name || 'Your Name'}
            </h2>
            {profile.role && <p className="blackbook-label text-bb-muted">{profile.role}</p>}
            {profile.location && (
              <p className="blackbook-label text-bb-muted mt-1">{profile.location}</p>
            )}
          </div>
        </div>

        {/* Mini Portfolio Strip */}
        {profile.portfolio_images.length > 0 && (
          <div className="flex gap-2 mb-4">
            {profile.portfolio_images.map((img, i) => (
              <div
                key={img.id}
                className="relative flex-1 aspect-square overflow-hidden border border-border"
              >
                <Image src={img.url} alt={`Work ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* Profile Link */}
        {profile.username && (
          <div className="flex items-center gap-2 blackbook-label text-bb-muted">
            <ExternalLink className="w-3 h-3" />
            <span>blkbook/p/{profile.username}</span>
          </div>
        )}
      </div>
    </div>
  );
}
