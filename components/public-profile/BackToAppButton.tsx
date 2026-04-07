'use client';

import { useRouter } from 'next/navigation';

export function BackToAppButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="fixed top-0 right-0 z-50 bb-safe-top-6 pr-6 font-helvetica text-[11px] font-light tracking-widest uppercase text-muted-foreground/50 hover:text-foreground transition-colors"
    >
      BACK
    </button>
  );
}
