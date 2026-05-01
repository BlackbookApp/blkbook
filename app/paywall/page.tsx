'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { AuthShell, AuthHeading, QuietLink, authTokens } from '@/components/auth/AuthShell';
import { routes } from '@/lib/routes';

type Tier = {
  eyebrow: string;
  title: string;
  italicWord?: string;
  price?: string;
  priceNote?: string;
  description: string;
  features: string[];
  cta: string;
  footnote: string;
  onClick: () => void;
  variant: 'light' | 'dark';
};

const renderTitle = (title: string, italicWord?: string) => {
  if (!italicWord) return title;
  const idx = title.toLowerCase().indexOf(italicWord.toLowerCase());
  if (idx < 0) return title;
  return (
    <>
      {title.slice(0, idx)}
      <em style={{ fontStyle: 'italic' }}>{title.slice(idx, idx + italicWord.length)}</em>
      {title.slice(idx + italicWord.length)}
    </>
  );
};

const Paywall = () => {
  const router = useRouter();

  const tiers: Tier[] = [
    {
      eyebrow: 'Free Guest Access · 14 days',
      title: 'Step inside first',
      italicWord: 'first',
      description: 'See exactly what Haizel is before you decide it’s yours. No card required.',
      features: [
        'Your profile, live and shareable from day one',
        'The vault — add contacts, search, feel the difference',
        '14 days to decide if Haizel belongs in your life',
      ],
      cta: 'Continue as guest',
      footnote: 'Your contacts wait for you if you decide to stay.',
      onClick: () => router.push(routes.vault),
      variant: 'light',
    },
    {
      eyebrow: 'Founding Member · One time',
      title: 'Join the Founding 100',
      italicWord: 'Founding 100',
      price: '€199',
      description:
        'The first 100 members shape what Haizel becomes. Permanent access, permanent price — before either changes.',
      features: [],
      cta: 'Join the Founding 100',
      footnote: 'Founding membership closes at 100 members.',
      onClick: () => router.push('/card-addon'),
      variant: 'dark',
    },
  ];

  return (
    <AuthShell card={false} maxWidth={520} footerRight="Choose your access">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <AuthHeading
          title="Two ways in."
          italicWord="in"
          subtitle="Both private. Both yours to keep."
        />

        <div className="flex flex-col gap-4">
          {tiers.map((tier, idx) => {
            const isDark = tier.variant === 'dark';
            const bg = isDark ? authTokens.ink : '#ffffff';
            const border = isDark ? 'rgba(255,255,255,0.08)' : authTokens.hairline;
            const titleColor = isDark ? authTokens.cream : authTokens.ink;
            const bodyColor = isDark ? 'rgba(251,250,246,0.78)' : authTokens.inkSoft;
            const mutedColor = isDark ? 'rgba(251,250,246,0.55)' : authTokens.muted;
            const ruleColor = isDark ? 'rgba(255,255,255,0.10)' : authTokens.hairline;

            return (
              <motion.div
                key={tier.eyebrow}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + idx * 0.12, duration: 0.7 }}
                className="flex flex-col px-6 sm:px-8 py-7 sm:py-8 rounded-[8px]"
                style={{ background: bg, border: `1px solid ${border}` }}
              >
                <p
                  className="uppercase mb-4"
                  style={{
                    fontFamily: authTokens.helvetica,
                    fontWeight: 400,
                    fontSize: '10px',
                    letterSpacing: '0.28em',
                    color: mutedColor,
                  }}
                >
                  {tier.eyebrow}
                </p>

                <div className="flex items-baseline justify-between gap-4 mb-5">
                  <h3
                    className="leading-[1.1] min-w-0 normal-case"
                    style={{
                      fontFamily: authTokens.granjon,
                      fontWeight: 400,
                      fontSize: '1.65rem',
                      letterSpacing: '-0.01em',
                      color: titleColor,
                    }}
                  >
                    {renderTitle(tier.title, tier.italicWord)}
                  </h3>

                  {tier.price && (
                    <div className="flex flex-col items-end text-right flex-shrink-0">
                      <span
                        style={{
                          fontFamily: authTokens.granjon,
                          fontWeight: 400,
                          fontSize: '1.25rem',
                          lineHeight: 1.1,
                          color: titleColor,
                          letterSpacing: '-0.005em',
                        }}
                      >
                        {tier.price}
                      </span>
                    </div>
                  )}
                </div>

                <div className="h-px w-full mb-5" style={{ background: ruleColor }} />

                <p
                  className="text-[13.5px] leading-[1.65] mb-5"
                  style={{ fontFamily: authTokens.helvetica, fontWeight: 400, color: bodyColor }}
                >
                  {tier.description}
                </p>

                {tier.features.length > 0 && (
                  <ul className="space-y-3 mb-7">
                    {tier.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-[13px] leading-[1.55]"
                        style={{
                          fontFamily: authTokens.helvetica,
                          fontWeight: 400,
                          color: bodyColor,
                        }}
                      >
                        <span
                          className="flex-shrink-0 mt-[3px] inline-flex items-center justify-center rounded-full"
                          style={{
                            width: '16px',
                            height: '16px',
                            border: `1px solid ${isDark ? 'rgba(255,255,255,0.25)' : authTokens.hairline}`,
                          }}
                        >
                          <Check
                            className="w-2.5 h-2.5"
                            strokeWidth={1.75}
                            style={{ color: mutedColor }}
                          />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <button
                  type="button"
                  onClick={tier.onClick}
                  className="group mt-auto w-full py-[15px] text-[13px] rounded-[4px] transition-all hover:opacity-90"
                  style={{
                    fontFamily: authTokens.helvetica,
                    fontWeight: 400,
                    background: isDark ? authTokens.cream : authTokens.ink,
                    color: isDark ? authTokens.ink : authTokens.cream,
                    letterSpacing: '0.01em',
                  }}
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    {tier.cta}
                    <span
                      aria-hidden
                      className="inline-block transition-transform duration-300 group-hover:translate-x-[2px]"
                      style={{ fontSize: '14px' }}
                    >
                      →
                    </span>
                  </span>
                </button>

                <p
                  className="mt-4 text-[11.5px] text-center"
                  style={{ fontFamily: authTokens.helvetica, fontWeight: 400, color: mutedColor }}
                >
                  {tier.footnote}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <QuietLink onClick={() => router.push('/request-access')}>
            <span className="uppercase">Team or partnership enquiries →</span>
          </QuietLink>
        </div>
      </motion.div>
    </AuthShell>
  );
};

export default Paywall;
