'use client';

import React from 'react';
import { Globe, Instagram, Linkedin, Mail, Phone, Twitter, MessageCircle } from 'lucide-react';
import { TikTokIcon, WhatsAppIcon } from '@/components/public-profile/shared/social-icons';
import type { SocialFields } from './types';

export interface SocialFieldConfig {
  key: keyof SocialFields;
  label: string;
  placeholder: string;
  icon: React.ReactNode;
}

export const SOCIAL_FIELD_CONFIGS: SocialFieldConfig[] = [
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
    key: 'tiktok',
    label: 'TikTok',
    placeholder: '@yourhandle',
    icon: <TikTokIcon className="w-4 h-4" />,
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
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    placeholder: '+44 7700 000000',
    icon: <WhatsAppIcon className="w-4 h-4" />,
  },
];
