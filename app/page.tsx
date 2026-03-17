'use client';

import { redirect } from 'next/navigation';
import { routes } from '@/lib/routes';

const PublicProfile = () => {
  redirect(routes.myBlackbook);
};

export default PublicProfile;
