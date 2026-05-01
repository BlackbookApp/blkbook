'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AuthShell, AuthHeading, AuthField, PrimaryButton } from '@/components/auth/AuthShell';
import { updatePasswordAction } from '@/app/actions/auth';
import { routes } from '@/lib/routes';

export default function ResetPasswordForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [focused, setFocused] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await updatePasswordAction(form.password);
      if ('error' in result) {
        setError(result.error);
      } else {
        router.push(routes.myBlackbook);
        router.refresh();
      }
    });
  };

  return (
    <AuthShell>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <AuthHeading
          title="Choose a new password"
          italicWord="new"
          subtitle="Your new password must be at least 8 characters."
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
          id="password"
          label="New password"
          type="password"
          value={form.password}
          onChange={(v) => handleChange('password', v)}
          autoComplete="new-password"
          required
          minLength={8}
          isFocused={focused === 'password'}
          onFocus={() => setFocused('password')}
          onBlur={() => setFocused(null)}
        />
        <AuthField
          id="confirm"
          label="Confirm password"
          type="password"
          value={form.confirm}
          onChange={(v) => handleChange('confirm', v)}
          autoComplete="new-password"
          required
          isFocused={focused === 'confirm'}
          onFocus={() => setFocused('confirm')}
          onBlur={() => setFocused(null)}
        />

        {error && (
          <p className="font-helvetica text-[11px] text-red-500 leading-relaxed">{error}</p>
        )}

        <div className="pt-2">
          <PrimaryButton type="submit" disabled={isPending || !form.password || !form.confirm}>
            {isPending ? 'Updating…' : 'Update password'}
          </PrimaryButton>
        </div>
      </motion.form>
    </AuthShell>
  );
}
