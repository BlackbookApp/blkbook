'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Logo from '@/components/Logo';
import profilePhoto from '@/assets/profile-photo.jpeg';

/* ── Preview: Vault ─────────────────────────────── */
const VaultPreview = () => {
  const contacts = [
    { letter: 'A', name: 'Alessandro Tocchi', role: 'Event Planner', city: 'Milan' },
    {
      letter: 'C',
      name: 'Charlotte Kim',
      role: 'Fashion Editor',
      city: 'Seoul',
      context: 'Copenhagen Fashion Week',
    },
    { letter: 'D', name: 'David Okonkwo', role: 'Architect', city: 'Lagos' },
    {
      letter: 'E',
      name: 'Elena Vance',
      role: 'Art Director',
      city: 'Paris',
      context: 'Studio visit, March',
    },
    { letter: 'J', name: 'James Chen', role: 'Photographer', city: 'New York' },
    { letter: 'M', name: 'Marcus Wright', role: 'Industrial Designer', city: 'Berlin' },
  ];

  let lastLetter = '';

  return (
    <div className="px-6 pt-6">
      <div className="mb-4">
        <Logo />
      </div>
      <div className="relative mb-3">
        <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <div className="blackbook-input pl-6 text-[11px] italic text-muted-foreground/50 font-light py-2">
          Search anything. A name, a place, a moment.
        </div>
      </div>
      <div className="space-y-0">
        {contacts.map((c, i) => {
          const showLetter = c.letter !== lastLetter;
          lastLetter = c.letter;
          return (
            <div key={i}>
              {showLetter && (
                <div className="mt-2 mb-1">
                  <span className="text-[10px] tracking-widest text-muted-foreground font-bold">
                    {c.letter}
                  </span>
                  <div className="h-px bg-border mt-1" />
                </div>
              )}
              <div className="py-2">
                <h2 className="text-sm tracking-tight font-semibold uppercase">{c.name}</h2>
                <p className="text-[11px] text-muted-foreground font-normal tracking-wide">
                  {c.role} — {c.city}
                </p>
                {c.context && (
                  <p className="text-[10px] text-muted-foreground/60 font-light italic">
                    {c.context}
                  </p>
                )}
              </div>
              <div className="h-px bg-border" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ── Preview: Add Someone ───────────────────────── */
const AddPreview = () => (
  <div className="px-6 pt-6">
    <div className="mb-4">
      <Logo />
    </div>
    <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">
      Add Connection
    </p>
    <div className="space-y-0">
      {[
        { title: 'Manual Entry', desc: 'Type in contact details' },
        { title: 'QR Code Scan', desc: 'Scan a Blackbook QR code' },
        { title: 'Business Card Scan', desc: 'Capture details with AI' },
      ].map((item, i) => (
        <div key={i}>
          {i > 0 && <div className="h-px bg-border" />}
          <div className="py-4">
            <h3 className="text-sm tracking-wide uppercase mb-1">{item.title}</h3>
            <p className="text-xs text-muted-foreground font-light">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
    <div className="h-px bg-border mt-2 mb-6" />
    <div className="space-y-0">
      <div className="border-b border-border py-3">
        <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">
          Full Name
        </label>
        <p className="text-sm text-foreground/40">e.g. James Chen</p>
      </div>
      <div className="border-b border-border py-3">
        <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">
          Role
        </label>
        <p className="text-sm text-foreground/40">e.g. Photographer</p>
      </div>
      <div className="border-b border-border py-3">
        <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2">
          Where you met
        </label>
        <p className="text-sm text-foreground/40">e.g. Milan Design Week</p>
      </div>
    </div>
  </div>
);

/* ── Preview: Share ─────────────────────────────── */
const SharePreview = () => (
  <div className="px-6 pt-6 flex flex-col items-center">
    <div className="self-start mb-4 w-full">
      <Logo />
    </div>
    <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-8 mt-8">
      Share your profile
    </p>
    <div className="p-6 mb-6">
      <QRCodeSVG
        value="https://blkbook.me/you"
        size={140}
        level="M"
        includeMargin={false}
        bgColor="transparent"
        fgColor="currentColor"
        className="text-foreground"
      />
    </div>
    <p className="text-xs tracking-widest text-muted-foreground font-light mb-6">blkbook.me/you</p>
    <button className="w-full max-w-[200px] py-3 bg-foreground text-background text-[10px] uppercase tracking-[0.2em] font-medium">
      Copy Link
    </button>
  </div>
);

/* ── Preview: Profile ───────────────────────────── */
const ProfilePreview = () => (
  <div className="px-6 pt-6">
    <div className="mb-4">
      <Logo />
    </div>
    <div className="w-full aspect-[3/4] mb-4 border border-foreground/10 overflow-hidden relative">
      <Image src={profilePhoto} alt="Profile" fill className="object-cover" />
    </div>
    <div className="flex items-baseline justify-between mb-3">
      <h1 className="text-lg tracking-tight uppercase">Your Name</h1>
      <span className="text-sm text-muted-foreground">Creative Director</span>
    </div>
    <div className="h-px bg-border mb-3" />
    <p className="text-sm leading-relaxed text-muted-foreground">
      This is what people see when they tap your card or visit your link...
    </p>
  </div>
);

/* ── Steps Config ───────────────────────────────── */
const steps = [
  {
    label: 'Vault',
    headline: 'Your vault.',
    body: 'Everyone you meet, held privately in one place. Tap a name to add context, notes, and moments only you can see.',
    Preview: VaultPreview,
  },
  {
    label: '+Add',
    headline: 'Add someone.',
    body: 'Just met someone worth remembering? Add them instantly — manually or from your contacts. The sooner you add context, the more valuable it becomes.',
    Preview: AddPreview,
  },
  {
    label: 'Share',
    headline: 'Share your profile.',
    body: 'No card yet? No problem. Share your Blackbook link or QR code anywhere — your profile travels with you.',
    Preview: SharePreview,
  },
  {
    label: 'Profile',
    headline: 'Your profile.',
    body: "This is what people see when they tap your card. Keep it sharp. Check who's viewed it. Send invitations from here.",
    Preview: ProfilePreview,
  },
];

/* ── Main Component ─────────────────────────────── */
const Walkthrough = () => {
  const router = useRouter();
  const [current, setCurrent] = useState(0);

  const isLast = current === steps.length - 1;
  const step = steps[current];

  const handleBack = () => {
    if (current > 0) {
      setCurrent((prev) => prev - 1);
    } else {
      router.back();
    }
  };

  const handleNext = () => {
    if (isLast) {
      router.push('/before-you-explore');
    } else {
      setCurrent((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col relative overflow-hidden">
      {/* Live UI Preview — scaled down with faded edges */}
      <div className="absolute inset-0 flex items-start justify-center pt-6">
        <div
          className="w-[85%] h-[55%] relative"
          style={{
            maskImage:
              'linear-gradient(to bottom, black 60%, transparent 100%), linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, black 60%, transparent 100%), linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)',
            maskComposite: 'intersect',
            WebkitMaskComposite: 'source-in',
          }}
        >
          <div className="transform scale-[0.8] origin-top w-[125%] -ml-[12.5%]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <step.Preview />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Frosted Glass Overlay — bottom 45% */}
      <div className="absolute bottom-0 left-0 right-0 z-10" style={{ height: '48%' }}>
        <div
          className="h-full flex flex-col"
          style={{
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            background: 'rgba(245, 244, 240, 0.88)',
          }}
        >
          {/* Subtle top edge */}
          <div className="h-px bg-border/40" />

          <div className="flex-1 flex flex-col px-8 pt-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="flex-1"
              >
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-8">
                  {step.label}
                </p>

                <h1 className="blackbook-title text-foreground mb-6">{step.headline}</h1>

                <p className="text-xs font-light text-muted-foreground leading-relaxed">
                  {step.body}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Controls */}
          <div className="px-8 pb-10">
            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-6">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-px transition-all duration-500 ${
                    i === current ? 'w-6 bg-foreground/60' : 'w-3 bg-foreground/15'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="bb-btn-primary shadow-[0_2px_8px_-2px_hsl(var(--foreground)/0.25)] mb-3"
            >
              {isLast ? 'Enter Blackbook' : 'Next'}
            </button>

            {!isLast && (
              <button
                onClick={handleBack}
                className="w-full py-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground/50 transition-colors"
              >
                Back
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Walkthrough;
