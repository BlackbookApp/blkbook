'use client';

import Image, { StaticImageData } from 'next/image';
import { motion } from 'framer-motion';

interface HeroPortraitProps {
  name: string;
  portraitSrc?: string | StaticImageData | null;
  subtitle?: string | null;
  location?: string | null;
}

export const HeroPortrait = ({ name, portraitSrc, subtitle, location }: HeroPortraitProps) => {
  const roleLine = [subtitle, location].filter(Boolean).join(' · ');

  return (
    <motion.div className="mb-8">
      <motion.div
        className="px-10 mb-1 text-right"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <motion.h1
          className="font-granjon font-normal text-xl tracking-[0.01em] uppercase leading-tight text-[var(--pg-fg)]"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {name}
        </motion.h1>
      </motion.div>

      <div className="mb-2 px-10">
        <motion.div
          className="relative w-full aspect-[3/4] overflow-hidden border-2 border-black"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {portraitSrc ? (
            <Image src={portraitSrc} alt={name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-[var(--pg-border-image)]" />
          )}
        </motion.div>

        <motion.div
          className="mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {roleLine && (
            <p className="font-helvetica font-normal text-[0.7rem] tracking-[0.08em] uppercase text-[var(--pg-fg)]">
              {roleLine}
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};
