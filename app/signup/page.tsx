'use client';

import { Suspense, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';
import LineInput from '@/components/LineInput';
import { signUpAction } from '@/app/actions/auth';
import { routes } from '@/lib/routes';

const SignUpContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteCode = searchParams.get('ref') ?? '';
  const prefillName = searchParams.get('name') ?? '';
  const prefillEmail = searchParams.get('email') ?? '';

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);

    startTransition(async () => {
      const result = await signUpAction(formData);
      if ('error' in result) {
        setError(result.error);
      } else {
        router.push(routes.createProfile);
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
            <h1 className="text-xl tracking-tight text-foreground mb-3 uppercase">
              Create your profile
            </h1>
          </motion.div>

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            onSubmit={handleSubmit}
            className="space-y-6 font-normal"
          >
            <input type="hidden" name="invite_code" value={inviteCode} />

            <LineInput
              type="text"
              name="full_name"
              placeholder="Full name"
              required
              autoComplete="name"
              defaultValue={prefillName}
            />
            <LineInput
              type="email"
              name="email"
              placeholder="Email"
              required
              autoComplete="email"
              defaultValue={prefillEmail}
            />
            <LineInput
              type="password"
              name="password"
              placeholder="Password"
              required
              minLength={8}
              autoComplete="new-password"
            />

            {error && <p className="text-[11px] text-red-500 leading-relaxed">{error}</p>}

            <p className="text-[11px] text-muted-foreground/60 leading-relaxed mt-5">
              Your privacy is not just a feature, it&apos;s a foundation for us. We will never sell
              or share for any reason. Our{' '}
              <a
                href="/terms"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                Terms
              </a>{' '}
              and{' '}
              <a
                href="/privacy"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                Privacy Policy
              </a>{' '}
              are available here.
            </p>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isPending || !inviteCode}
                className="font-helvetica font-normal text-[11px] w-full bg-foreground text-background py-4 uppercase tracking-[0.12em] hover:opacity-90 active:scale-[0.99] transition-all relative overflow-hidden grain-overlay disabled:opacity-50"
              >
                {isPending ? 'Creating account…' : 'Enter'}
              </button>
            </div>

            {!inviteCode && (
              <p className="text-[11px] text-muted-foreground/60 text-center">
                You need a valid invitation link to sign up.
              </p>
            )}
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
};

const SignUp = () => (
  <Suspense>
    <SignUpContent />
  </Suspense>
);

export default SignUp;
