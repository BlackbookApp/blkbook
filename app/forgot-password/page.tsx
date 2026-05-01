'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  AuthShell,
  AuthHeading,
  AuthField,
  PrimaryButton,
  QuietLink,
} from '@/components/auth/AuthShell';
import { forgotPasswordAction } from '@/app/actions/auth';
import { routes } from '@/lib/routes';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState('');
  const [focused, setFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      await forgotPasswordAction(email);
      setSubmitted(true);
    });
  };

  return (
    <AuthShell
      topRight={
        <QuietLink type="button" onClick={() => router.push(routes.login)}>
          Sign in
        </QuietLink>
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <AuthHeading
          title={submitted ? 'Check your email' : 'Reset your password'}
          italicWord={submitted ? 'email' : 'password'}
          subtitle={
            submitted
              ? `If an account exists for ${email}, you'll receive a reset link shortly.`
              : "Enter your email address and we'll send you a reset link."
          }
        />
      </motion.div>

      {!submitted && (
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
            value={email}
            onChange={setEmail}
            autoComplete="email"
            required
            isFocused={focused}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />

          <div className="pt-2">
            <PrimaryButton type="submit" disabled={isPending || !email}>
              {isPending ? 'Sending…' : 'Send reset link'}
            </PrimaryButton>
          </div>

          <div className="pt-2 text-center">
            <QuietLink type="button" onClick={() => router.push(routes.login)}>
              Back to sign in
            </QuietLink>
          </div>
        </motion.form>
      )}

      {submitted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center pt-2"
        >
          <QuietLink type="button" onClick={() => router.push(routes.login)}>
            Back to sign in
          </QuietLink>
        </motion.div>
      )}
    </AuthShell>
  );
}
