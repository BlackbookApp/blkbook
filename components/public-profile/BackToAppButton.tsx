'use client';

import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

export function BackToAppButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="fixed top-0 right-0 z-50 bb-safe-top-6 pr-6 text-muted-foreground/50 hover:text-foreground transition-colors"
      aria-label="Close"
    >
      <X className="h-5 w-5" />
    </button>
  );
}
