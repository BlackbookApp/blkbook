'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Pencil } from 'lucide-react';
import { TextInput } from '@/components/ui/text-input';
import { useComponentEditor } from '@/hooks/use-component-editor';
import { useImageUpload } from '@/hooks/use-image-upload';
import type { ProfileComponent } from '@/lib/data/components';

export const authTokens = {
  // Light grey/ivory
  bg: '#f2f1ed',
  card: '#fbfaf6',
  ink: '#1a1814',
  inkSoft: '#3d3a34',
  muted: '#5e5950',
  hairline: '#e6e1d6',
  hairlineSoft: '#ece7da',
  field: '#8a8479',
  helvetica: "'Helvetica Neue', 'Helvetica', Arial, sans-serif",
  granjon: "'Granjon LT', 'Granjon LT Std', 'Granjon', Georgia, serif",
};

const { helvetica, granjon, bg, card, ink, inkSoft, muted, hairline, hairlineSoft } = authTokens;

const SectionLabel = ({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: React.ReactNode;
}) => (
  <div className="flex items-end justify-between mb-2 px-1">
    <span
      style={{
        fontFamily: helvetica,
        fontSize: '11px',
        color: inkSoft,
        letterSpacing: '0.04em',
      }}
    >
      {children}
    </span>
    {hint && <span style={{ fontFamily: helvetica, fontSize: '11px', color: muted }}>{hint}</span>}
  </div>
);
const FieldCard = ({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: React.ReactNode;
}) => (
  <div className="mb-5">
    <SectionLabel hint={hint}>{label}</SectionLabel>
    <div
      className="rounded-[6px]"
      style={{
        background: card,
        border: `1px solid ${hairline}`,
      }}
    >
      {children}
    </div>
  </div>
);

interface HeroData {
  name: string | null;
  image_url: string | null;
  tagline: string | null;
  company: string | null;
  location: string | null;
}

interface Props {
  component: ProfileComponent;
  onContinue: () => void;
}

export function Step1({ component, onContinue }: Props) {
  const { localData, onChange, saving } = useComponentEditor<HeroData>(component);
  const { upload, uploading } = useImageUpload({
    bucket: 'avatars',
    buildPath: (userId, file) => {
      const ext = file.name.split('.').pop() ?? 'jpg';
      return `${userId}/avatar.${ext}`;
    },
  });
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await upload(file);
    if (url) onChange({ ...localData, image_url: url });
    e.target.value = '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.25 }}
      className="flex-1 flex flex-col px-6 pt-8 pb-8"
    >
      <div className="flex flex-col justify-center items-center">
        <p className="font-helvetica text-[10px] uppercase tracking-[0.15em]  mb-2">The basics</p>
        <h2 className="font-granjon text-[28px] leading-tight text-bb-dark mb-1 normal-case">
          Your <em>profile</em>
        </h2>
        <p className="font-helvetica text-[11px] font-light mb-9">
          A few essentials so people know who they&apos;re meeting.
        </p>
      </div>

      <div className="flex justify-center mb-9">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="relative w-[112px] h-[112px] rounded-full overflow-visible transition-opacity hover:opacity-90"
          aria-label="Upload profile image"
        >
          <div
            className="w-full h-full rounded-full overflow-hidden flex items-center justify-center"
            style={{
              background: localData.image_url ? 'transparent' : '#d9d4c7',
              border: '1px solid #e4e0da',
            }}
          >
            {localData.image_url ? (
              <img src={localData.image_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-5 h-5 text-bb-muted" strokeWidth={1.5} />
            )}
          </div>

          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-full">
              <span className="font-helvetica text-[9px] uppercase tracking-[0.2em] text-bb-muted/60 animate-pulse">
                …
              </span>
            </div>
          )}

          <span className="absolute -bottom-0.5 -right-0.5 w-8 h-8 rounded-full flex items-center justify-center bg-background border border-bb-rule">
            <Pencil className="w-3.5 h-3.5 text-foreground" strokeWidth={1.5} />
          </span>
        </button>
      </div>

      <div>
        <FieldCard label="Name">
          <TextInput
            value={localData.name ?? ''}
            onChange={(e) => onChange({ ...localData, name: e.target.value || null })}
            placeholder="Your full name"
          />
        </FieldCard>
        <FieldCard label="Title">
          <TextInput
            value={localData.tagline ?? ''}
            onChange={(e) => onChange({ ...localData, tagline: e.target.value || null })}
            placeholder="What you do"
          />
        </FieldCard>
        <FieldCard label="Company">
          <TextInput
            value={localData.company ?? ''}
            onChange={(e) => onChange({ ...localData, company: e.target.value || null })}
            placeholder="Where you work"
          />
        </FieldCard>
        <FieldCard label="Location">
          <TextInput
            value={localData.location ?? ''}
            onChange={(e) => onChange({ ...localData, location: e.target.value || null })}
            placeholder="City, Country"
          />
        </FieldCard>
      </div>

      {saving && (
        <p className="font-helvetica text-[9px] uppercase tracking-[0.15em] text-bb-muted/40 mt-5">
          Saving…
        </p>
      )}

      <div className="pt-4">
        <button className="bb-btn-primary" onClick={onContinue}>
          Continue
        </button>
      </div>
    </motion.div>
  );
}
