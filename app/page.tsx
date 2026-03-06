'use client';

import { Button } from '@/components/ui/button';
import profilePhoto from '@/assets/profile-photo.jpeg';
import Logo from '@/components/Logo';
import Image from 'next/image';
import { redirect, useRouter } from 'next/navigation';
import { routes } from '@/lib/routes';
import { publicProfile as profile } from '@/lib/demo-data/profiles';

const PublicProfile = () => {
  redirect(routes.myBlackbook);
};

export default PublicProfile;
