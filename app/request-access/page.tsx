'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Logo from '@/components/Logo';
import { submitAccessRequest } from '@/app/actions/access-requests';
import { routes } from '@/lib/routes';
import invitePhone from '@/assets/invite-phone.jpg';

const EASE = [0.22, 1, 0.36, 1] as const;

const helvetica = "'Helvetica Neue', 'Helvetica', Arial, sans-serif";
const granjon = "'Granjon LT', 'Granjon LT Std', 'Granjon', Georgia, serif";

const ink = '#1a1814';
const inkSoft = '#3d3a34';
const muted = '#5e5950';
const hairline = '#e6e1d6';
const bg = '#f2f1ed';
const card = '#fbfaf6';

type State = 'application' | 'submitted';

interface FieldProps {
  id: string;
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  multiline?: boolean;
  autoComplete?: string;
}

function Field({ id, label, name, type = 'text', required, multiline, autoComplete }: FieldProps) {
  const [focused, setFocused] = useState(false);

  const baseStyle: React.CSSProperties = {
    fontFamily: helvetica,
    fontWeight: 400,
    color: ink,
    background: 'transparent',
    border: `1px solid ${focused ? ink : hairline}`,
    transition: 'border-color 200ms ease, box-shadow 200ms ease',
    boxShadow: focused ? '0 0 0 3px rgba(26,24,20,0.04)' : 'none',
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-[12px]"
        style={{
          fontFamily: helvetica,
          fontWeight: 400,
          color: focused ? ink : inkSoft,
          transition: 'color 200ms ease',
        }}
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={name}
          rows={3}
          required={required}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full px-4 py-3 rounded-[4px] focus:outline-none text-[12px] resize-none placeholder:text-[12px] placeholder:text-[#3d3a34]"
          style={baseStyle}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full px-4 py-[14px] rounded-[4px] focus:outline-none text-[12px] placeholder:text-[12px] placeholder:text-[#3d3a34]"
          style={baseStyle}
        />
      )}
    </div>
  );
}

export default function RequestAccessPage() {
  const router = useRouter();
  const [state, setState] = useState<State>('application');
  const [submittedId, setSubmittedId] = useState<string | null>(null);
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
        setSubmittedId(result.id);
        setState('submitted');
      }
    });
  };

  /* ── Submitted ──────────────────────────────────────────── */
  if (state === 'submitted') {
    return (
      <div
        className="h-[100dvh] flex flex-col overflow-hidden"
        style={{ background: bg, color: ink }}
      >
        <header className="flex items-center justify-between px-6 md:px-10 pt-6 md:pt-8 gap-4">
          <div className="flex items-center min-w-0">
            <Logo />
          </div>
        </header>

        <main className="flex-1 min-h-0 overflow-y-auto px-5 py-6 md:py-12 flex justify-center">
          <div className="w-full my-auto" style={{ maxWidth: 460 }}>
            <motion.div
              key="submitted"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="px-6 sm:px-10 py-10 sm:py-12 rounded-[6px] text-center"
              style={{
                background: '#ffffff',
                border: `1px solid ${hairline}`,
                boxShadow:
                  '0 1px 0 rgba(255,255,255,0.6) inset, 0 30px 60px -40px rgba(26,24,20,0.18), 0 8px 20px -16px rgba(26,24,20,0.10)',
              }}
            >
              <h1
                className="leading-[1.15] mb-9"
                style={{
                  fontFamily: granjon,
                  fontWeight: 400,
                  fontSize: 'clamp(1.7rem, 4.4vw, 2.15rem)',
                  letterSpacing: '-0.005em',
                  textTransform: 'none',
                  color: ink,
                }}
              >
                Application received
              </h1>
              <p
                className="mb-8 leading-[1.65]"
                style={{
                  fontFamily: helvetica,
                  fontSize: '13.5px',
                  fontWeight: 400,
                  color: inkSoft,
                }}
              >
                We read every application individually.
                <br />
                You&apos;ll hear from us soon.
              </p>
              <button
                type="button"
                onClick={() => router.push(routes.home)}
                className="group w-full py-[15px] text-[13px] rounded-[4px] transition-all hover:opacity-90"
                style={{
                  fontFamily: helvetica,
                  fontWeight: 400,
                  background: ink,
                  color: card,
                  letterSpacing: '0.01em',
                }}
              >
                <span className="inline-flex items-center justify-center gap-2">
                  Return to home
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-300 group-hover:translate-x-0.5"
                    style={{ fontSize: '14px' }}
                  >
                    →
                  </span>
                </span>
              </button>
            </motion.div>
          </div>
        </main>

        <footer className="flex items-center justify-between px-6 md:px-10 py-6">
          <span style={{ fontFamily: helvetica, fontWeight: 400, fontSize: '11px', color: muted }}>
            © 2026 HAIZEL
          </span>
          <span
            style={{
              fontFamily: helvetica,
              fontWeight: 400,
              fontSize: '11px',
              color: muted,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
            }}
          >
            Application received
          </span>
        </footer>
      </div>
    );
  }

  /* ── Form card ──────────────────────────────────────────── */
  const formCard = (
    <AnimatePresence mode="wait">
      <motion.div
        key="application"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="px-6 sm:px-10 py-10 sm:py-12 rounded-[28px]"
        style={{
          background: '#ffffff',
          border: `1px solid ${hairline}`,
          boxShadow:
            '0 1px 0 rgba(255,255,255,0.6) inset, 0 30px 60px -40px rgba(26,24,20,0.18), 0 8px 20px -16px rgba(26,24,20,0.10)',
        }}
      >
        <div className="mb-9">
          <h1
            className="leading-[1.15]"
            style={{
              fontFamily: granjon,
              fontWeight: 400,
              fontSize: 'clamp(1.7rem, 4.4vw, 2.15rem)',
              letterSpacing: '-0.005em',
              textTransform: 'none',
              color: ink,
            }}
          >
            Apply for <em>membership</em>
          </h1>
          <p
            className="mt-1.5 leading-[1.65]"
            style={{ fontFamily: helvetica, fontSize: '13.5px', fontWeight: 400, color: inkSoft }}
          >
            Welcome. Tell us a little about yourself.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field id="full_name" label="Full name" name="full_name" autoComplete="name" required />
          <Field id="email" label="Email" name="email" type="email" autoComplete="email" required />
          <Field
            id="social_handle"
            label="What you do"
            name="social_handle"
            autoComplete="off"
            required
          />
          <Field id="city" label="City" name="city" autoComplete="address-level2" required />
          <Field
            id="how_heard"
            label="How did you hear about Haizel?"
            name="how_heard"
            autoComplete="off"
            required
          />
          <Field
            id="notes"
            label="Anything else? (optional)"
            name="notes"
            multiline
            autoComplete="off"
          />

          {error && (
            <p className="text-[11px]" style={{ fontFamily: helvetica, color: '#c0392b' }}>
              {error}
            </p>
          )}

          <div className="pt-3">
            <button
              type="submit"
              disabled={isPending}
              className="group w-full py-[15px] text-[13px] rounded-[4px] transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                fontFamily: helvetica,
                fontWeight: 400,
                background: ink,
                color: card,
                letterSpacing: '0.01em',
              }}
            >
              <span className="inline-flex items-center justify-center gap-2">
                {isPending ? 'Submitting…' : 'Submit application'}
                {!isPending && (
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-300 group-hover:translate-x-0.5"
                    style={{ fontSize: '14px' }}
                  >
                    →
                  </span>
                )}
              </span>
            </button>
          </div>

          <p
            className="text-[11.5px] leading-[1.65] text-center pt-2"
            style={{ fontFamily: helvetica, fontWeight: 400, color: muted }}
          >
            By submitting, you agree to our{' '}
            <a
              href="/privacy"
              className="underline underline-offset-[3px] decoration-[#8a8479] hover:decoration-[#1a1814] transition-colors"
              style={{ color: inkSoft }}
            >
              Privacy
            </a>{' '}
            and{' '}
            <a
              href="/terms"
              className="underline underline-offset-[3px] decoration-[#8a8479] hover:decoration-[#1a1814] transition-colors"
              style={{ color: inkSoft }}
            >
              Terms
            </a>
            .
          </p>
        </form>
      </motion.div>
    </AnimatePresence>
  );

  /* ── Page ───────────────────────────────────────────────── */
  return (
    <div
      className="h-[100dvh] flex flex-col overflow-hidden"
      style={{ background: bg, color: ink }}
    >
      {/* Header: Back left → Logo right (matches AuthShell with headerLeft) */}
      <header className="flex items-center justify-between px-6 md:px-10 pt-6 md:pt-8 gap-4 shrink-0">
        <div className="flex items-center min-w-0">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="flex items-center gap-1.5 text-[12px] hover:opacity-60 transition-opacity -ml-1 px-1 py-2"
            style={{
              fontFamily: helvetica,
              fontWeight: 400,
              color: inkSoft,
              letterSpacing: '0.01em',
            }}
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
            Back
          </button>
        </div>
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => router.push(routes.login)}
            className="text-[12px] transition-opacity hover:opacity-60"
            style={{
              fontFamily: helvetica,
              fontWeight: 400,
              color: inkSoft,
              letterSpacing: '0.01em',
            }}
          >
            Sign in
          </button>
        </div>
      </header>

      <main className="flex-1 min-h-0 overflow-y-auto px-5 py-6 md:py-10 flex justify-center">
        <div className="w-full my-auto">
          {/* Mobile */}
          <div className="md:hidden mx-auto" style={{ maxWidth: 460 }}>
            {formCard}
          </div>

          {/* Desktop: image left, card right */}
          <div className="hidden md:grid md:grid-cols-[0.85fr_1fr] md:gap-8 items-stretch max-w-[1000px] mx-auto">
            <div
              className="rounded-[28px] overflow-hidden relative"
              style={{ border: `1px solid ${hairline}`, minHeight: 560 }}
            >
              <Image
                src={invitePhone}
                alt=""
                fill
                className="object-cover"
                sizes="(min-width: 1040px) 459px, (min-width: 768px) calc((100vw - 72px) * 0.459), 0px"
                placeholder="blur"
                priority
              />
            </div>
            <div>{formCard}</div>
          </div>
        </div>
      </main>

      <footer className="flex items-center justify-between px-6 md:px-10 py-6 shrink-0">
        <span style={{ fontFamily: helvetica, fontWeight: 400, fontSize: '11px', color: muted }}>
          © 2026 HAIZEL
        </span>
        <span
          style={{
            fontFamily: helvetica,
            fontWeight: 400,
            fontSize: '11px',
            color: muted,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
          }}
        >
          By invitation
        </span>
      </footer>
    </div>
  );
}
