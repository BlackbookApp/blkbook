'use client';

import { Button } from '@/components/ui/button';
import profilePhoto from '@/assets/profile-photo.jpeg';
import Logo from '@/components/Logo';
import { useRouter } from 'next/navigation';
import { routes } from '@/lib/routes';
import { publicProfile as profile } from '@/lib/demo-data/profiles';

const PublicProfile = () => {
  const router = useRouter();

  return (
    <div className="blackbook-container bg-background">
      <div className="blackbook-page animate-fade-in">
        <Logo />

        {/* Large Profile Photo - 3:4 vertical aspect ratio */}
        <div className="w-full aspect-[3/4] mb-8 border border-foreground/20">
          <img src={profilePhoto.src} alt={profile.name} className="w-full h-full object-cover" />
        </div>

        {/* Name & Role */}
        <div className="text-center mb-6">
          <h1 className="blackbook-title mb-1">{profile.name}</h1>
          <p className="blackbook-subtitle">{profile.role}</p>
        </div>

        {/* Bio */}
        <p className="blackbook-body text-center mb-10">{profile.bio}</p>

        {/* Portfolio Grid */}
        <div className="blackbook-grid mb-10">
          {profile.portfolioImages.map((img, i) => (
            <div key={i} className="aspect-square overflow-hidden">
              <img src={img} alt={`Portfolio ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* CTA */}
        <Button
          variant="blackbook"
          size="full"
          onClick={() => router.push(routes.saveConfirmation)}
        >
          Save to my Blackbook
        </Button>
      </div>
    </div>
  );
};

export default PublicProfile;
