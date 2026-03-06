'use client';

import { useEffect, useState } from 'react';
import { getAccessRequestById } from '@/lib/data/access-requests';
import Logo from '@/components/Logo';

type Status = 'loading' | 'pending' | 'approved' | 'rejected' | 'not_found';

export default function RequestAccessPendingPage() {
  const [, setStatus] = useState<Status>(() => {
    const id = typeof window !== 'undefined' ? localStorage.getItem('bb_request_id') : null;
    return id ? 'loading' : 'not_found';
  });

  useEffect(() => {
    const id = localStorage.getItem('bb_request_id');
    if (!id) {
      return;
    }

    const check = async () => {
      const request = await getAccessRequestById(id);
      if (!request) {
        setStatus('not_found');
        return;
      }
      setStatus(request.status);
    };

    check();
    const interval = setInterval(check, 10_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col p-6">
      <div className="mb-8">
        <Logo />
      </div>

      <div className="w-full max-w-sm border border-border p-8 animate-slide-up">
        <div className="w-14 h-14 rounded-full border border-foreground flex items-center justify-center mx-auto mb-6">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
            <path strokeLinecap="round" strokeWidth={1.5} d="M12 6v6l4 2" />
          </svg>
        </div>

        <div className="text-center">
          <h1 className="blackbook-title text-base mb-4">Under Review</h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We review every request personally.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-3">
            You&apos;ll receive an email when you&apos;re approved.
          </p>
        </div>
      </div>
    </div>
  );
}
