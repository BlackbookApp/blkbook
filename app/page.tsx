'use client';

import { Button } from '@/components/ui/button';
import profilePhoto from '@/assets/profile-photo.jpeg';
import Logo from '@/components/Logo';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { routes } from '@/lib/routes';
import { publicProfile as profile } from '@/lib/demo-data/profiles';

const PublicProfile = () => {
  const router = useRouter();

  return (
    <div className="blackbook-container bg-background">
      <div className="blackbook-page animate-fade-in">
        <Logo />

        <div className="relative w-full aspect-3/4 mb-8 border border-foreground/20">
          <Image src={profilePhoto} alt={profile.name} fill className="object-cover" priority />
        </div>

        <div className="text-center mb-6">
          <h1 className="blackbook-title mb-1">{profile.name}</h1>
          <p className="blackbook-subtitle">{profile.role}</p>
        </div>

        <p className="blackbook-body text-center mb-10">{profile.bio}</p>

        <div className="blackbook-grid mb-10">
          {profile.portfolioImages.map((img, i) => (
            <div key={i} className="relative aspect-square overflow-hidden">
              <Image
                src={img}
                alt={`Portfolio ${i + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ))}
        </div>

        <div className="flex-1" />

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
