'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Globe, Instagram, Linkedin, Mail, Phone, Twitter, Plus } from 'lucide-react';
import type { SocialFields } from './types';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

interface StepProfileProps {
  name: string;
  setName: (v: string) => void;
  role: string;
  setRole: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  bio: string;
  setBio: (v: string) => void;
  avatarFile: File | null;
  setAvatarFile: (f: File | null) => void;
  avatarPreview: string | null;
  setAvatarPreview: (p: string | null) => void;
  socials: SocialFields;
  setSocials: (s: SocialFields) => void;
  onContinue: () => void;
  onSkip: () => void;
}

export const StepProfile = ({
  name,
  setName,
  role,
  setRole,
  location,
  setLocation,
  bio,
  setBio,
  avatarFile: _avatarFile,
  setAvatarFile,
  avatarPreview,
  setAvatarPreview,
  socials,
  setSocials,
  onContinue,
  onSkip,
}: StepProfileProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateSocial = (key: keyof SocialFields, value: string) =>
    setSocials({ ...socials, [key]: value });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const socialFields: {
    key: keyof SocialFields;
    label: string;
    placeholder: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: 'website',
      label: 'Website',
      placeholder: 'yoursite.com',
      icon: <Globe className="w-4 h-4" />,
    },
    {
      key: 'instagram',
      label: 'Instagram',
      placeholder: '@yourhandle',
      icon: <Instagram className="w-4 h-4" />,
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      placeholder: 'linkedin.com/in/you',
      icon: <Linkedin className="w-4 h-4" />,
    },
    {
      key: 'twitter',
      label: 'X / Twitter',
      placeholder: '@yourhandle',
      icon: <Twitter className="w-4 h-4" />,
    },
    {
      key: 'email',
      label: 'Email',
      placeholder: 'hello@you.com',
      icon: <Mail className="w-4 h-4" />,
    },
    {
      key: 'phone',
      label: 'Phone',
      placeholder: '+44 7700 000000',
      icon: <Phone className="w-4 h-4" />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4 }}
      className="flex-1 flex flex-col px-6 pt-10 pb-8 overflow-y-auto"
    >
      <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">
        Your Profile
      </p>

      {/* Avatar upload */}
      <div className="flex justify-center mb-6">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full aspect-auto border border-dashed border-border hover:border-muted-foreground/40 transition-colors flex items-center justify-center overflow-hidden"
        >
          {avatarPreview ? (
            <Image
              src={avatarPreview}
              alt="Avatar"
              className="w-full h-full object-cover"
              width={100}
              height={200}
            />
          ) : (
            <Plus className="w-5 h-5 text-muted-foreground/30" />
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="hidden"
        />
      </div>

      <div className="space-y-5 mb-6">
        {[
          { label: 'Name', value: name, set: setName, placeholder: 'Full name' },
          { label: 'Role', value: role, set: setRole, placeholder: 'What you do' },
          { label: 'Location', value: location, set: setLocation, placeholder: 'City, Country' },
        ].map((f) => (
          <div key={f.label}>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
              {f.label}
            </label>
            <Input
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
              placeholder={f.placeholder}
            />
          </div>
        ))}

        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
            Bio
          </label>
          <Input
            variant="primary"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A short bio or tagline"
          />
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {socialFields.map((sf) => (
          <div key={sf.key} className="flex items-center gap-3">
            <div className="flex-1">
              <Input
                value={socials[sf.key]}
                onChange={(e) => updateSocial(sf.key, e.target.value)}
                placeholder={sf.placeholder}
              />
            </div>
            <span className="text-muted-foreground">{sf.icon}</span>
          </div>
        ))}
      </div>

      <p className="text-[11px] italic text-muted-foreground mb-8">
        Only share what you want people to see when they tap your card.
      </p>

      <div className="mt-auto space-y-3">
        <button onClick={onContinue} className="bb-btn-primary">
          Continue
        </button>
        <button
          onClick={onSkip}
          className="w-full py-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground/50 transition-colors"
        >
          Skip for now
        </button>
      </div>
    </motion.div>
  );
};
