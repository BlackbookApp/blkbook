'use client';

import { Suspense, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { AuthShell, AuthHeading, AuthField, PrimaryButton } from '@/components/auth/AuthShell';
import { signUpAction } from '@/app/actions/auth';
import { routes } from '@/lib/routes';

const SignUpContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteCode = searchParams.get('ref') ?? '';
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: searchParams.get('name') ?? '',
    email: searchParams.get('email') ?? '',
    password: '',
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set('full_name', form.name);
    formData.set('email', form.email);
    formData.set('password', form.password);
    formData.set('invite_code', inviteCode);
    setError(null);

    startTransition(async () => {
      const result = await signUpAction(formData);
      if ('error' in result) {
        setError(result.error);
      } else {
        router.push(routes.onboarding);
      }
    });
  };

  return (
    <AuthShell
      topRight={
        <button
          type="button"
          onClick={() => router.push(routes.login)}
          className="font-helvetica text-[11px] uppercase tracking-[0.15em] text-bb-dark hover:text-bb-muted transition-colors"
        >
          Sign in
        </button>
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <AuthHeading
          title="Create your account"
          italicWord="account"
          subtitle="A quiet space for the people who matter."
        />
      </motion.div>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.7 }}
        onSubmit={handleSubmit}
        className="space-y-5"
        noValidate
      >
        <AuthField
          id="full_name"
          label="Full name"
          value={form.name}
          onChange={(v) => handleChange('name', v)}
          autoComplete="name"
          required
          isFocused={focused === 'name'}
          onFocus={() => setFocused('name')}
          onBlur={() => setFocused(null)}
        />
        <AuthField
          id="email"
          label="Email"
          type="email"
          value={form.email}
          onChange={(v) => handleChange('email', v)}
          autoComplete="email"
          required
          isFocused={focused === 'email'}
          onFocus={() => setFocused('email')}
          onBlur={() => setFocused(null)}
        />
        <AuthField
          id="password"
          label="Password"
          type="password"
          value={form.password}
          onChange={(v) => handleChange('password', v)}
          autoComplete="new-password"
          minLength={8}
          required
          hint="At least 8 characters"
          isFocused={focused === 'password'}
          onFocus={() => setFocused('password')}
          onBlur={() => setFocused(null)}
        />

        {error && (
          <p className="font-helvetica text-[11px] text-red-500 leading-relaxed">{error}</p>
        )}

        <div className="pt-2">
          <PrimaryButton type="submit" disabled={isPending || !inviteCode}>
            {isPending ? 'Creating account…' : 'Continue'}
          </PrimaryButton>
        </div>

        {!inviteCode && (
          <p className="font-helvetica text-[11px] text-bb-muted/60 text-center">
            You need a valid invitation link to sign up.
          </p>
        )}

        <p className="font-helvetica text-[12px] leading-[1.65] text-center text-bb-muted pt-1">
          By continuing, you agree to our{' '}
          <a
            href="/terms"
            className="underline underline-offset-[3px] decoration-bb-muted/60 hover:decoration-bb-dark text-bb-muted transition-colors"
          >
            Terms
          </a>{' '}
          and{' '}
          <a
            href="/privacy"
            className="underline underline-offset-[3px] decoration-bb-muted/60 hover:decoration-bb-dark text-bb-muted transition-colors"
          >
            Privacy
          </a>
          .
        </p>
      </motion.form>
    </AuthShell>
  );
};

const SignUp = () => (
  <Suspense>
    <SignUpContent />
  </Suspense>
);

export default SignUp;
