'use client';

import { useState, useTransition, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  AuthShell,
  AuthHeading,
  AuthField,
  PrimaryButton,
  QuietLink,
} from '@/components/auth/AuthShell';
import { loginAction } from '@/app/actions/auth';
import { routes } from '@/lib/routes';

const LoginContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(searchParams.get('error') ?? null);
  const [focused, setFocused] = useState<string | null>(null);

  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set('email', form.email);
    formData.set('password', form.password);
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
    <AuthShell
      topRight={
        <button
          type="button"
          onClick={() => router.push(routes.requestAccess)}
          className="font-helvetica text-[11px] uppercase tracking-[0.15em] text-bb-dark hover:text-bb-muted transition-colors"
        >
          Apply
        </button>
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <AuthHeading title="Welcome back" italicWord="back" />
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
          autoComplete="current-password"
          required
          isFocused={focused === 'password'}
          onFocus={() => setFocused('password')}
          onBlur={() => setFocused(null)}
        />

        {error && (
          <p className="font-helvetica text-[11px] text-red-500 leading-relaxed">{error}</p>
        )}

        <div className="pt-2">
          <PrimaryButton type="submit" disabled={isPending}>
            {isPending ? 'Signing in…' : 'Continue'}
          </PrimaryButton>
        </div>

        <div className="pt-4 text-center">
          <QuietLink type="button" onClick={() => router.push(routes.forgotPassword)}>
            Forgot password?
          </QuietLink>
        </div>
      </motion.form>
    </AuthShell>
  );
};

const LoginPage = () => (
  <Suspense>
    <LoginContent />
  </Suspense>
);

export default LoginPage;
