'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';
import { submitAccessRequest } from '@/app/actions/access-requests';
import { routes } from '@/lib/routes';
import { Input } from '@/components/ui/input';

export default function RequestAccessPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);

    startTransition(async () => {
      const result = await submitAccessRequest(formData);
      if ('error' in result) {
        setError(result.error);
      } else {
        router.push(routes.requestAccessStatus(result.id));
      }
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="px-6 pt-6">
        <Logo />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-12">
        <div className="max-w-[300px] w-full">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center mb-10"
          >
            <h1 className="text-xl tracking-tight text-foreground mb-3 uppercase">
              Request Access
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We&apos;re building this for professionals who understand that relationships—not
              followers—are the real currency.
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed mt-3">
              If you&apos;re tired of losing track of the people who could change your business,
              request early access.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            onSubmit={handleSubmit}
            className="space-y-6 font-normal"
          >
            <Input
              variant="primary"
              type="text"
              name="full_name"
              placeholder="Full name"
              required
              autoComplete="name"
            />
            <Input
              variant="primary"
              type="email"
              name="email"
              placeholder="Email"
              required
              autoComplete="email"
            />
            <Input
              variant="primary"
              type="text"
              name="social_handle"
              placeholder="Social handle"
              autoComplete="off"
            />
            <Input
              variant="primary"
              type="url"
              name="brand_link"
              placeholder="Link to your brand or business"
              autoComplete="off"
            />

            {error && <p className="text-[11px] text-red-500 leading-relaxed">{error}</p>}

            <div className="pt-6">
              <button
                type="submit"
                disabled={isPending}
                className="font-helvetica font-normal text-[11px] w-full bg-foreground text-background py-4 uppercase tracking-[0.12em] hover:opacity-90 active:scale-[0.99] transition-all relative overflow-hidden grain-overlay disabled:opacity-50"
              >
                {isPending ? 'Submitting…' : 'Request Access'}
              </button>
            </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="mt-8 text-center"
          >
            <button
              type="button"
              onClick={() => router.push(routes.login)}
              className="text-[10px] text-muted-foreground hover:text-foreground/60 transition-colors tracking-wide"
            >
              Already a member? Sign in
            </button>
          </motion.div>
        </div>
      </div>

      <div className="h-12" />
    </div>
  );
}
