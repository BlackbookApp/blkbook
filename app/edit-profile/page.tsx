'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Instagram, Linkedin, Mail, Phone, Plus, X, Image as ImageIcon } from 'lucide-react';
import Logo from '@/components/Logo';

// Profile preview images
import dainaPortrait from '@/assets/daina-hazel-portrait.jpg';
import jeremyPortrait from '@/assets/jeremy-allen-white-portrait.jpg';
import Image from 'next/image';

// ─── Types ───────────────────────────────────────────────────────────────────
type ProfileStyle = 'visual' | 'editorial' | null;
type ProfilePalette = 'blanc' | 'noir' | null;

interface SocialFields {
  website: string;
  instagram: string;
  linkedin: string;
  email: string;
  phone: string;
}

interface WorkData {
  portfolioImages: string[];
  logo: string | null;
  testimonialQuote: string;
  testimonialName: string;
  testimonialTitle: string;
  brandStatement: string;
}

// ─── Mini Preview Thumbnail ──────────────────────────────────────────────────
const MiniPreview = ({ style, palette }: { style: ProfileStyle; palette: ProfilePalette }) => {
  const bg = palette === 'noir' ? '#0E0E0E' : '#F5F4F0';
  const fg = palette === 'noir' ? '#F5F4F0' : '#0E0E0E';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-6 right-6 w-16 h-20 border border-border shadow-md z-50 overflow-hidden"
      style={{ background: bg }}
    >
      {/* Tiny mock profile */}
      <div className="p-1.5 flex flex-col items-center gap-1">
        {style === 'visual' ? (
          <div
            className="w-full aspect-[4/5] rounded-none"
            style={{ background: fg, opacity: 0.15 }}
          />
        ) : (
          <>
            <div className="w-8 h-[2px] mt-2" style={{ background: fg, opacity: 0.3 }} />
            <div className="w-6 h-[1px]" style={{ background: fg, opacity: 0.2 }} />
            <div className="w-10 h-[1px] mt-1" style={{ background: fg, opacity: 0.15 }} />
            <div className="w-8 h-[1px]" style={{ background: fg, opacity: 0.15 }} />
          </>
        )}
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 1 — YOUR STYLE
// ═══════════════════════════════════════════════════════════════════════════════
const Step1 = ({
  style,
  setStyle,
  palette,
  setPalette,
  onContinue,
  onPreview,
}: {
  style: ProfileStyle;
  setStyle: (s: ProfileStyle) => void;
  palette: ProfilePalette;
  setPalette: (p: ProfilePalette) => void;
  onContinue: () => void;
  onPreview: (type: 'visual' | 'editorial') => void;
}) => {
  const canContinue = style !== null && palette !== null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4 }}
      className="flex-1 flex flex-col px-6 pt-10 pb-8"
    >
      {/* Section label */}
      <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">
        Your Style
      </p>

      {/* Headline — same as signup */}
      <h1 className="text-xl tracking-tight text-foreground mb-8 uppercase">
        How should this feel?
      </h1>

      {/* Style Cards */}
      <div className="flex gap-3 mb-10">
        {/* Visual Card — Photographer style preview */}
        <div
          className={`flex-1 text-center transition-all border overflow-hidden ${
            style === 'visual' ? 'border-foreground' : 'border-border'
          }`}
        >
          <button
            onClick={() => onPreview('visual')}
            className="relative w-full aspect-[3/4] overflow-hidden group"
          >
            <Image
              src={dainaPortrait}
              alt="Visual style preview"
              fill
              className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-foreground/5 flex items-end justify-center pb-3">
              <span className="text-[10px] uppercase tracking-[0.2em] bg-background/90 px-3 py-1.5">
                Preview
              </span>
            </div>
          </button>
          <button
            onClick={() => setStyle('visual')}
            className="w-full py-3 px-2 bg-background hover:bg-secondary/50 transition-colors"
          >
            <span className="block text-[11px] uppercase tracking-[0.05em] font-medium mb-0.5">
              Visual
            </span>
            <span className="block text-[9px] italic text-muted-foreground">
              Elegant. Visual. Image-led.
            </span>
          </button>
        </div>

        {/* Editorial Card — Ecommerce Specialist style preview */}
        <div
          className={`flex-1 text-center transition-all border overflow-hidden ${
            style === 'editorial' ? 'border-foreground' : 'border-border'
          }`}
        >
          <button
            onClick={() => onPreview('editorial')}
            className="relative w-full aspect-[3/4] overflow-hidden group"
          >
            <Image
              src={jeremyPortrait}
              alt="Editorial style preview"
              fill
              className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-foreground/5 flex items-end justify-center pb-3">
              <span className="text-[10px] uppercase tracking-[0.2em] bg-background/90 px-3 py-1.5">
                Preview
              </span>
            </div>
          </button>
          <button
            onClick={() => setStyle('editorial')}
            className="w-full py-3 px-2 bg-background hover:bg-secondary/50 transition-colors"
          >
            <span className="block text-[11px] uppercase tracking-[0.05em] font-medium mb-0.5">
              Editorial
            </span>
            <span className="block text-[9px] italic text-muted-foreground">
              Minimal. Refined. Word-led.
            </span>
          </button>
        </div>
      </div>

      {/* Palette */}
      <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">
        Your Palette
      </p>
      <div className="flex gap-3 mb-auto">
        {(
          [
            { key: 'blanc' as const, label: 'Blanc', swatch: '#F5F4F0' },
            { key: 'noir' as const, label: 'Noir', swatch: '#0E0E0E' },
          ] as const
        ).map((p) => (
          <button
            key={p.key}
            onClick={() => setPalette(p.key)}
            className={`flex-1 py-6 px-4 text-center transition-all border ${
              palette === p.key ? 'border-foreground' : 'border-border'
            }`}
          >
            <div
              className="w-full h-10 mb-3 border border-border"
              style={{ background: p.swatch }}
            />
            <span className="block text-[11px] uppercase tracking-[0.15em]">{p.label}</span>
          </button>
        ))}
      </div>

      {/* CTA */}
      <div className="pt-6">
        <button
          onClick={onContinue}
          disabled={!canContinue}
          className={`w-full py-4 uppercase tracking-[0.01em] hover:opacity-90 active:scale-[0.99] transition-all relative overflow-hidden ${
            canContinue
              ? 'bg-foreground text-background grain-overlay'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
          style={{
            fontFamily: "'Helvetica Neue', 'Helvetica', sans-serif",
            fontWeight: 400,
            fontSize: '11px',
            letterSpacing: '0.12em',
          }}
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 2 — WHO YOU ARE
// ═══════════════════════════════════════════════════════════════════════════════
const Step2 = ({
  name,
  setName,
  role,
  setRole,
  location,
  setLocation,
  socials,
  setSocials,
  onContinue,
  onSkip,
}: {
  name: string;
  setName: (v: string) => void;
  role: string;
  setRole: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  socials: SocialFields;
  setSocials: (s: SocialFields) => void;
  onContinue: () => void;
  onSkip: () => void;
}) => {
  const updateSocial = (key: keyof SocialFields, value: string) =>
    setSocials({ ...socials, [key]: value });

  const socialFields: {
    key: keyof SocialFields;
    label: string;
    placeholder: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: 'website',
      label: 'Website',
      placeholder: 'yoursite.com',
      icon: <Globe className="w-4 h-4" />,
    },
    {
      key: 'instagram',
      label: 'Instagram',
      placeholder: '@yourhandle',
      icon: <Instagram className="w-4 h-4" />,
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      placeholder: 'linkedin.com/in/you',
      icon: <Linkedin className="w-4 h-4" />,
    },
    {
      key: 'email',
      label: 'Email',
      placeholder: 'hello@you.com',
      icon: <Mail className="w-4 h-4" />,
    },
    {
      key: 'phone',
      label: 'Phone',
      placeholder: '+44 7700 000000',
      icon: <Phone className="w-4 h-4" />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4 }}
      className="flex-1 flex flex-col px-6 pt-10 pb-8 overflow-y-auto"
    >
      <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">
        Your Profile
      </p>

      {/* Pre-filled fields */}
      <div className="space-y-5 mb-8">
        {[
          { label: 'Name', value: name, set: setName, placeholder: 'Full name' },
          { label: 'Role', value: role, set: setRole, placeholder: 'What you do' },
          { label: 'Location', value: location, set: setLocation, placeholder: 'City, Country' },
        ].map((f) => (
          <div key={f.label}>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
              {f.label}
            </label>
            <input
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
              placeholder={f.placeholder}
              className="w-full bg-transparent border-b border-border py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition-colors"
            />
          </div>
        ))}
      </div>

      {/* Social fields */}
      <div className="space-y-4 mb-6">
        {socialFields.map((sf) => (
          <div key={sf.key} className="flex items-center gap-3">
            <div className="flex-1">
              <input
                value={socials[sf.key]}
                onChange={(e) => updateSocial(sf.key, e.target.value)}
                placeholder={sf.placeholder}
                className="w-full bg-transparent border-b border-border py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
            <span className="text-muted-foreground">{sf.icon}</span>
          </div>
        ))}
      </div>

      {/* Privacy note */}
      <p className="text-[11px] italic text-muted-foreground mb-8">
        Only share what you want people to see when they tap your card.
      </p>

      <div className="mt-auto space-y-3">
        <button
          onClick={onContinue}
          className="w-full h-[52px] bg-foreground text-background uppercase tracking-[0.12em] text-[11px] font-normal [font-family:'Helvetica_Neue','Helvetica',sans-serif] hover:opacity-90 active:scale-[0.99] transition-all relative overflow-hidden grain-overlay"
        >
          Continue
        </button>
        <button
          onClick={onSkip}
          className="w-full py-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground/50 transition-colors"
        >
          Skip for now
        </button>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 3 — YOUR WORK
// ═══════════════════════════════════════════════════════════════════════════════
const Step3 = ({
  work,
  setWork,
  onFinish,
}: {
  work: WorkData;
  setWork: (w: WorkData) => void;
  onFinish: () => void;
}) => {
  const portfolioInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handlePortfolioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const urls = Array.from(files).map((f) => URL.createObjectURL(f));
    setWork({ ...work, portfolioImages: [...work.portfolioImages, ...urls] });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setWork({ ...work, logo: URL.createObjectURL(file) });
  };

  const removePortfolioImage = (idx: number) => {
    setWork({
      ...work,
      portfolioImages: work.portfolioImages.filter((_, i) => i !== idx),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4 }}
      className="flex-1 flex flex-col px-6 pt-10 pb-8 overflow-y-auto"
    >
      <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">
        Show Your Work
      </p>

      <h1 className="text-xl tracking-tight text-foreground mb-2 uppercase">
        Let your work speak.
      </h1>
      <p className="text-[11px] text-muted-foreground mb-8 leading-relaxed">
        Add anything that gives people a sense of what you do. Nothing is mandatory.
      </p>

      {/* 1. Portfolio Images */}
      <div className="mb-6">
        <input
          ref={portfolioInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handlePortfolioUpload}
        />
        <button
          onClick={() => portfolioInputRef.current?.click()}
          className="w-full py-6 border border-border text-center hover:bg-secondary/50 transition-colors"
        >
          <ImageIcon className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
          <span className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
            Portfolio images
          </span>
        </button>
        {work.portfolioImages.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {work.portfolioImages.map((img, i) => (
              <div key={i} className="relative w-16 h-16">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="w-full h-full object-cover border border-border" />
                <button
                  onClick={() => removePortfolioImage(i)}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-foreground text-background flex items-center justify-center"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="text-right mt-1">
          <button className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground/50 transition-colors">
            Skip
          </button>
        </div>
      </div>

      {/* 2. Logo */}
      <div className="mb-6">
        <input
          ref={logoInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleLogoUpload}
        />
        <button
          onClick={() => logoInputRef.current?.click()}
          className="w-full py-6 border border-border text-center hover:bg-secondary/50 transition-colors"
        >
          {work.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={work.logo} alt="Logo" className="h-10 mx-auto object-contain" />
          ) : (
            <>
              <Plus className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
              <span className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                Logo or brand mark
              </span>
            </>
          )}
        </button>
        <div className="text-right mt-1">
          <button className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground/50 transition-colors">
            Skip
          </button>
        </div>
      </div>

      {/* 3. Testimonial */}
      <div className="mb-6">
        <div className="border border-border p-4">
          <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-3">
            A line from someone who knows your work
          </p>
          <textarea
            value={work.testimonialQuote}
            onChange={(e) => setWork({ ...work, testimonialQuote: e.target.value })}
            placeholder="What they said about you..."
            rows={2}
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 placeholder:italic focus:outline-none resize-none mb-2"
          />
          <div className="flex gap-3">
            <input
              value={work.testimonialName}
              onChange={(e) => setWork({ ...work, testimonialName: e.target.value })}
              placeholder="Name"
              className="flex-1 bg-transparent border-b border-border py-2 text-[11px] text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
            />
            <input
              value={work.testimonialTitle}
              onChange={(e) => setWork({ ...work, testimonialTitle: e.target.value })}
              placeholder="Title"
              className="flex-1 bg-transparent border-b border-border py-2 text-[11px] text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
            />
          </div>
        </div>
        <div className="text-right mt-1">
          <button className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground/50 transition-colors">
            Skip
          </button>
        </div>
      </div>

      {/* 4. Brand Statement */}
      <div className="mb-8">
        <div className="border border-border p-4">
          <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-3">
            Your brand statement or values
          </p>
          <textarea
            value={work.brandStatement}
            onChange={(e) => setWork({ ...work, brandStatement: e.target.value })}
            placeholder="What you stand for. What you build. What you believe."
            rows={3}
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 placeholder:italic focus:outline-none resize-none"
          />
        </div>
        <div className="text-right mt-1">
          <button className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground/50 transition-colors">
            Skip
          </button>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-auto">
        <button
          onClick={onFinish}
          className="w-full h-[52px] bg-foreground text-background uppercase tracking-[0.12em] text-[11px] font-normal [font-family:'Helvetica_Neue','Helvetica',sans-serif] hover:opacity-90 active:scale-[0.99] transition-all relative overflow-hidden grain-overlay"
        >
          Finish my profile
        </button>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPLETION SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
const CompletionScreen = ({ onDone }: { onDone: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
    className="flex-1 flex flex-col items-center justify-center px-6"
  >
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.7 }}
      className="w-48 h-64 border border-border bg-card mb-8 shadow-lg"
    >
      {/* Miniature profile card mock */}
      <div className="w-full h-3/4 bg-muted" />
      <div className="p-3 space-y-1">
        <div className="w-16 h-[2px] bg-foreground/30" />
        <div className="w-12 h-[1px] bg-foreground/15" />
      </div>
    </motion.div>

    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.9, duration: 0.6 }}
      className="italic text-sm text-muted-foreground mb-12"
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      This is how the world meets you.
    </motion.p>

    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.3, duration: 0.5 }}
      onClick={onDone}
      className="w-full max-w-[280px] h-[52px] bg-foreground text-background uppercase tracking-[0.01em] text-[13px] font-[500] [font-family:'EB_Garamond',serif] hover:opacity-90 active:scale-[0.99] transition-all relative overflow-hidden grain-overlay"
    >
      Back to my Blackbook
    </motion.button>
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const EditProfile = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showCompletion, setShowCompletion] = useState(false);

  // Step 1
  const [style, setStyle] = useState<ProfileStyle>(null);
  const [palette, setPalette] = useState<ProfilePalette>(null);

  // Step 2 — pre-filled from "onboarding"
  const [name, setName] = useState('Julia Reyes');
  const [role, setRole] = useState('Creative Director & Brand Strategist');
  const [location, setLocation] = useState('Brooklyn, NY');
  const [socials, setSocials] = useState<SocialFields>({
    website: '',
    instagram: '',
    linkedin: '',
    email: '',
    phone: '',
  });

  // Step 3
  const [work, setWork] = useState<WorkData>({
    portfolioImages: [],
    logo: null,
    testimonialQuote: '',
    testimonialName: '',
    testimonialTitle: '',
    brandStatement: '',
  });

  const handleFinish = () => {
    setShowCompletion(true);
  };

  if (showCompletion) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-background">
        <CompletionScreen onDone={() => router.push('/my-blackbook')} />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      {/* Header — Logo + close */}
      <div className="flex items-center justify-between px-6 pt-8">
        <Logo />
        <button
          onClick={() => router.push('/my-blackbook')}
          className="flex items-center text-muted-foreground/50 hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Step indicator + progress bar */}
      <div className="flex justify-center mt-2">
        <span className="text-[10px] tracking-[0.2em] text-muted-foreground/40 font-light">
          Step {step} of 3
        </span>
      </div>
      <div className="px-6 mt-3">
        <div className="w-full h-[2px] bg-border/30 overflow-hidden">
          <motion.div
            className="h-full bg-foreground"
            initial={{ width: 0 }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Steps */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <Step1
            key="step1"
            style={style}
            setStyle={setStyle}
            palette={palette}
            setPalette={setPalette}
            onContinue={() => setStep(2)}
            onPreview={(type) =>
              router.push(type === 'visual' ? '/photographer-beige' : '/ecommerce-specialist')
            }
          />
        )}
        {step === 2 && (
          <Step2
            key="step2"
            name={name}
            setName={setName}
            role={role}
            setRole={setRole}
            location={location}
            setLocation={setLocation}
            socials={socials}
            setSocials={setSocials}
            onContinue={() => setStep(3)}
            onSkip={() => setStep(3)}
          />
        )}
        {step === 3 && <Step3 key="step3" work={work} setWork={setWork} onFinish={handleFinish} />}
      </AnimatePresence>

      {/* Mini preview — only on step 1 */}
      {step === 1 && (style || palette) && <MiniPreview style={style} palette={palette} />}
    </div>
  );
};

export default EditProfile;
