'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { getAccessRequestStatusAction } from '@/app/actions/access-requests';
import { routes } from '@/lib/routes';

type Status = 'loading' | 'pending' | 'approved' | 'rejected' | 'not_found';

export default function RequestAccessStatusPage() {
  return (
    <Suspense>
      <RequestAccessStatus />
    </Suspense>
  );
}

function RequestAccessStatus() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [status, setStatus] = useState<Status>(id ? 'loading' : 'not_found');

  useEffect(() => {
    if (!id) return;

    const check = async () => {
      const result = await getAccessRequestStatusAction(id);
      if (!result) {
        setStatus('not_found');
        return;
      }
      setStatus(result.status as Status);
    };

    check();
    const interval = setInterval(check, 10_000);
    return () => clearInterval(interval);
  }, [id]);

  return (
    <div className="min-h-screen bg-background flex flex-col p-6">
      <div className="mb-8">
        <Logo />
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-sm border border-border p-8 animate-slide-up">
          {status === 'loading' && (
            <div className="text-center">
              <div className="w-5 h-5 border border-foreground border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <p className="font-helvetica text-[11px] text-bb-muted uppercase tracking-widest">
                Loading…
              </p>
            </div>
          )}

          {status === 'pending' && (
            <>
              <div className="w-14 h-14 rounded-full border border-foreground flex items-center justify-center mx-auto mb-6">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
                  <path strokeLinecap="round" strokeWidth={1.5} d="M12 6v6l4 2" />
                </svg>
              </div>
              <div className="text-center">
                <h1 className="blackbook-title text-base mb-4">Under Review</h1>
                <p className="font-helvetica text-[11px] text-bb-muted leading-relaxed">
                  We review every request personally.
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-3">
                  You&apos;ll receive an email when you&apos;re approved.
                </p>
              </div>
            </>
          )}

          {status === 'approved' && (
            <>
              <div className="w-14 h-14 rounded-full border border-foreground flex items-center justify-center mx-auto mb-6">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="text-center">
                <h1 className="blackbook-title text-base mb-4">You&apos;re Approved</h1>
                <p className="font-helvetica text-[11px] text-bb-muted leading-relaxed">
                  Check your email — your invitation link is waiting.
                </p>
              </div>
            </>
          )}

          {status === 'rejected' && (
            <>
              <div className="w-14 h-14 rounded-full border border-foreground flex items-center justify-center mx-auto mb-6">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div className="text-center">
                <h1 className="blackbook-title text-base mb-4">Not Approved</h1>
                <p className="font-helvetica text-[11px] text-bb-muted leading-relaxed">
                  We&apos;re unable to approve this request at the moment.
                </p>
              </div>
            </>
          )}

          {status === 'not_found' && (
            <div className="text-center">
              <h1 className="blackbook-title text-base mb-4">Request Not Found</h1>
              <p className="font-helvetica text-[11px] text-bb-muted leading-relaxed mb-6">
                We couldn&apos;t find your request.
              </p>
              <Link
                href={routes.requestAccess}
                className="text-[10px] uppercase tracking-widest text-foreground hover:opacity-60 transition-opacity"
              >
                Submit a new request
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
