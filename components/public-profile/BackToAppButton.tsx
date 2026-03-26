'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export function BackToAppButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="fixed top-0 right-0 z-50 bb-safe-top-6 pr-6 text-bb-muted"
      aria-label="Back"
    >
      <ChevronLeft className="h-5 w-5" />
    </button>
  );
}
