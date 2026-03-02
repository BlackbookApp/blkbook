'use client';

import { Button } from '@/components/ui/button';
import profilePhoto from '@/assets/profile-photo.jpeg';
import Logo from '@/components/Logo';
import { useRouter } from 'next/navigation';

const PublicProfile = () => {
  const router = useRouter();

  // Demo profile data
  const profile = {
    name: 'Alexandra Chen',
    role: 'Creative Director',
    bio: 'Building brands that matter. Previously at Apple, now leading design at an early-stage startup in Brooklyn.',
    portfolioImages: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1561998338-13ad7883b20f?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1561998338-13ad7883b20f?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=400&fit=crop',
    ],
  };

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
        <Button variant="blackbook" size="full" onClick={() => router.push('/save-confirmation')}>
          Save to my Blackbook
        </Button>
      </div>
    </div>
  );
};

export default PublicProfile;
