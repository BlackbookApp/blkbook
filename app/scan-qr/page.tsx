'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { QRScanner } from '@/components/qr-scanner/QRScanner';
import { routes } from '@/lib/routes';
import { toast } from '@/hooks/use-toast';
import { fetchLinkedInProfile, getVaultContactByLinkedinUrlAction } from '@/app/actions/linkedin';

const PROFILE_PATTERN = /\/p\/([^/?#]+)/;
const LINKEDIN_PATTERN = /linkedin\.com\/in\/([^/?#]+)/;

export default function ScanQrPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDetected = useCallback(
    async (data: string) => {
      // Blackbook profile QR
      const bbMatch = data.match(PROFILE_PATTERN);
      if (bbMatch) {
        router.replace(routes.publicProfile(bbMatch[1]));
        return;
      }

      // LinkedIn QR
      const liMatch = data.match(LINKEDIN_PATTERN);
      if (liMatch) {
        const linkedinUrl = `https://www.linkedin.com/in/${liMatch[1]}`;
        setLoading(true);
        try {
          // Dedup check
          const existing = await getVaultContactByLinkedinUrlAction(linkedinUrl);
          if (existing) {
            toast({
              title: 'Already in vault',
              description: `${existing.name} is already saved.`,
            });
            router.replace(routes.contact(existing.id));
            return;
          }

          const prefill = await fetchLinkedInProfile(linkedinUrl);
          localStorage.setItem('linkedin_prefill', JSON.stringify(prefill));
          router.replace(routes.vault);
        } catch {
          toast({ title: 'Could not fetch LinkedIn profile', variant: 'destructive' });
          setLoading(false);
        }
        return;
      }

      toast({ title: 'Not a Haizel or LinkedIn QR code', variant: 'destructive' });
    },
    [router]
  );

  const handleError = useCallback((reason: 'permission-denied' | 'not-supported') => {
    if (reason === 'not-supported') {
      toast({ title: 'Camera not supported on this device', variant: 'destructive' });
    }
  }, []);

  if (loading) {
    return (
      <div className="blackbook-container bg-black flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-white/60 animate-spin" strokeWidth={1.4} />
        <p className="font-helvetica text-[11px] font-light tracking-widest uppercase text-white/60">
          Fetching LinkedIn profile…
        </p>
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
          Scan QR
        </span>
      </div>

      <QRScanner onDetected={handleDetected} onError={handleError} />

      {/* Footer hint */}
      <div className="shrink-0 flex items-center justify-center py-6">
        <p className="font-helvetica text-[10px] font-light text-white/40 tracking-widest uppercase">
          Point at a Haizel or LinkedIn QR code
        </p>
      </div>
    </div>
  );
}
