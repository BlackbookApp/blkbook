'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';

const NotFound = () => {
  const pathname = usePathname();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', pathname);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted">
      <Logo />
      <div className="text-center">
        <h1 className="mb-4 text-4xl">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <Link href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
