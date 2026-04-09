'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BusinessCardScanner } from '@/components/business-card-scanner/BusinessCardScanner';
import { scanBusinessCardAction } from '@/app/actions/scan-business-card';
import { routes } from '@/lib/routes';
import { toast } from '@/hooks/use-toast';

type PageState = 'scanning' | 'loading';

export default function ScanCardPage() {
  const router = useRouter();
  const [state, setState] = useState<PageState>('scanning');

  const handleCapture = useCallback(
    async (base64: string) => {
      setState('loading');

      const result = await scanBusinessCardAction(base64);

      if ('error' in result) {
        toast({ title: result.error, variant: 'destructive' });
        setState('scanning');
        return;
      }

      const prefill = result.data;

      const nonNullCount = Object.values(prefill).filter((v) => v !== null).length;
      if (nonNullCount === 0) {
        toast({ title: 'No contact info detected — try a clearer photo', variant: 'destructive' });
        setState('scanning');
        return;
      }

      const coreFieldsPresent =
        prefill.name && prefill.role && prefill.city && prefill.email && prefill.phone;

      if (!coreFieldsPresent && !prefill.name) {
        toast({ title: "Couldn't read a name — please fill it in manually" });
      }

      localStorage.setItem('businessCardPrefill', JSON.stringify(prefill));
      router.replace(`${routes.vault}?openQuickAdd=true`);
    },
    [router]
  );

  const handleError = useCallback((reason: 'permission-denied' | 'not-supported') => {
    if (reason === 'not-supported') {
      toast({ title: 'Camera not supported on this device', variant: 'destructive' });
    }
  }, []);

  if (state === 'loading') {
    return (
      <div className="blackbook-container bg-black flex flex-col items-center justify-center gap-6">
        <div className="flex flex-col items-center gap-5">
          {/* Pulsing ring animation */}
          <div className="relative w-12 h-12 flex items-center justify-center">
            <span className="absolute inset-0 rounded-full border border-white/20 animate-ping" />
            <span className="w-3 h-3 rounded-full bg-white/50" />
          </div>
          <p className="font-helvetica text-[11px] font-light tracking-widest uppercase text-white/60">
            Reading card…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="blackbook-container bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-4 shrink-0">
        <button
          onClick={() => router.back()}
          className="font-helvetica text-[11px] font-light tracking-widest uppercase text-white/70 hover:text-white transition-colors"
        >
          BACK
        </button>
        <span className="font-helvetica text-[11px] font-light tracking-widest uppercase text-white/60">
          Scan Card
        </span>
      </div>

      <BusinessCardScanner onCapture={handleCapture} onError={handleError} />

      {/* Footer hint */}
      <div className="shrink-0 flex items-center justify-center py-6">
        <p className="font-helvetica text-[10px] font-light text-white/40 tracking-widest uppercase">
          Point at a business card and tap capture
        </p>
      </div>
    </div>
  );
}
