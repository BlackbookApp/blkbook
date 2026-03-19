'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, Sparkles } from 'lucide-react';
import Logo from '@/components/Logo';
import { routes } from '@/lib/routes';

export default function OnboardingAiPath() {
  const router = useRouter();

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <div className="flex items-center justify-between px-6 pt-6">
        <Logo />
        <button
          onClick={() => router.push(routes.onboardingV2)}
          className="text-bb-muted/50 hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-6">
        <div className="w-12 h-12 rounded-full border border-bb-rule flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-bb-muted" />
        </div>
        <div className="space-y-2">
          <h2 className="font-granjon text-2xl tracking-tight text-foreground">AI import</h2>
          <p className="font-helvetica text-[11px] font-light leading-relaxed text-bb-muted max-w-xs">
            This is where you&apos;ll share a link, upload screenshots, or paste text so we can
            build your profile automatically.
          </p>
        </div>
        <p className="blackbook-label text-bb-muted/40">Coming in Step 8</p>
      </div>
    </div>
  );
}
