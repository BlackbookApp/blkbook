'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';

const SignUpContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    name: '',
    email: searchParams.get('email') || '',
    password: '',
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/create-profile');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative">
      {/* Logo top-left */}
      <div className="px-6 pt-6">
        <Logo />
      </div>

      {/* Centred form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-12">
        <div className="max-w-[300px] w-full">
          {/* Header */}
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

          {/* Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Full name"
              className="w-full bg-transparent border-b border-border py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition-colors"
              required
            />
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Email"
              className="w-full bg-transparent border-b border-border py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition-colors"
              required
            />
            <input
              type="password"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="Password"
              className="w-full bg-transparent border-b border-border py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition-colors"
              required
              minLength={8}
            />

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
                className="w-full bg-foreground text-background py-4 uppercase tracking-[0.12em] hover:opacity-90 active:scale-[0.99] transition-all relative overflow-hidden grain-overlay"
                style={{
                  fontFamily: "'Helvetica Neue', 'Helvetica', sans-serif",
                  fontWeight: 400,
                  fontSize: '11px',
                }}
              >
                Enter
              </button>
            </div>
          </motion.form>

          {/* Sign in link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="mt-8 text-center"
          >
            <button
              type="button"
              onClick={() => router.push('/login')}
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
