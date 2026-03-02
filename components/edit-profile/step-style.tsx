'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import dainaPortrait from '@/assets/daina-hazel-portrait.jpg';
import jeremyPortrait from '@/assets/jeremy-allen-white-portrait.jpg';
import type { ProfileStyle, ProfilePalette } from './types';

interface StepStyleProps {
  style: ProfileStyle;
  setStyle: (s: ProfileStyle) => void;
  palette: ProfilePalette;
  setPalette: (p: ProfilePalette) => void;
  onContinue: () => void;
  onPreview: (type: 'visual' | 'editorial') => void;
}

export const StepStyle = ({
  style,
  setStyle,
  palette,
  setPalette,
  onContinue,
  onPreview,
}: StepStyleProps) => {
  const canContinue = style !== null && palette !== null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4 }}
      className="flex-1 flex flex-col px-6 pt-10 pb-8"
    >
      <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">
        Your Style
      </p>

      <h1 className="text-xl tracking-tight text-foreground mb-8 uppercase">
        How should this feel?
      </h1>

      <div className="flex gap-3 mb-10">
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

      <div className="pt-6">
        <button
          onClick={onContinue}
          disabled={!canContinue}
          className={`font-helvetica font-normal w-full py-4 uppercase text-[11px] tracking-[0.12em] hover:opacity-90 active:scale-[0.99] transition-all relative overflow-hidden ${
            canContinue
              ? 'bg-foreground text-background grain-overlay'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
};
