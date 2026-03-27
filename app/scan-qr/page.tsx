'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { QRScanner } from '@/components/qr-scanner/QRScanner';
import { routes } from '@/lib/routes';
import { toast } from '@/hooks/use-toast';

const PROFILE_PATTERN = /\/p\/([^/?#]+)/;

export default function ScanQrPage() {
  const router = useRouter();

  const handleDetected = useCallback(
    (data: string) => {
      const match = data.match(PROFILE_PATTERN);
      if (match) {
        router.replace(routes.publicProfile(match[1]));
      } else {
        toast({ title: 'Not a Blackbook QR code', variant: 'destructive' });
        // scanner stays open — detection loop resets via key or re-mount not needed;
        // the onDetected guard in QRScanner only fires once, so we need to allow retry
      }
    },
    [router]
  );

  const handleError = useCallback((reason: 'permission-denied' | 'not-supported') => {
    if (reason === 'not-supported') {
      toast({ title: 'Camera not supported on this device', variant: 'destructive' });
    }
  }, []);

  return (
    <div className="blackbook-container bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-4 shrink-0">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={1.4} />
        </button>
        <span className="font-helvetica text-[11px] font-light tracking-widest uppercase text-white/60">
          Scan QR
        </span>
      </div>

      <QRScanner onDetected={handleDetected} onError={handleError} />

      {/* Footer hint */}
      <div className="shrink-0 flex items-center justify-center py-6">
        <p className="font-helvetica text-[10px] font-light text-white/40 tracking-widest uppercase">
          Point at a Blackbook QR code
        </p>
      </div>
    </div>
  );
}
