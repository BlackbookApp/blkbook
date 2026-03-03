'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';
import { loginAction } from '@/app/actions/auth';
import { routes } from '@/lib/routes';

const LoginContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(searchParams.get('error') ?? null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);

    startTransition(async () => {
      const result = await loginAction(formData);
      if ('error' in result) {
        setError(result.error);
      } else {
        router.push(routes.myBlackbook);
        router.refresh();
      }
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative">
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
            <h1 className="text-xl tracking-tight text-foreground mb-3 uppercase">Sign in</h1>
          </motion.div>

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full bg-transparent border-b border-border py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition-colors"
              required
              autoComplete="email"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full bg-transparent border-b border-border py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition-colors"
              required
              autoComplete="current-password"
            />

            {error && <p className="text-[11px] text-red-500 leading-relaxed">{error}</p>}

            <div className="pt-6">
              <button
                type="submit"
                disabled={isPending}
                className="font-helvetica font-normal text-[11px] w-full bg-foreground text-background py-4 uppercase tracking-[0.12em] hover:opacity-90 active:scale-[0.99] transition-all relative overflow-hidden grain-overlay disabled:opacity-50"
              >
                {isPending ? 'Signing in…' : 'Enter'}
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
              onClick={() => router.push(routes.signup)}
              className="text-[10px] text-muted-foreground hover:text-foreground/60 transition-colors tracking-wide"
            >
              Don&apos;t have an account? Get invited
            </button>
          </motion.div>
        </div>
      </div>

      <div className="h-12" />
    </div>
  );
};

const LoginPage = () => (
  <Suspense>
    <LoginContent />
  </Suspense>
);

export default LoginPage;
