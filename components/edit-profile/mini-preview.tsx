'use client';

import { motion } from 'framer-motion';
import type { ProfileStyle, ProfilePalette } from './types';

export const MiniPreview = ({
  style,
  palette,
}: {
  style: ProfileStyle;
  palette: ProfilePalette;
}) => {
  const bg = palette === 'noir' ? '#0E0E0E' : '#F5F4F0';
  const fg = palette === 'noir' ? '#F5F4F0' : '#0E0E0E';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-6 right-6 w-16 h-20 border border-border shadow-md z-50 overflow-hidden"
      style={{ background: bg }}
    >
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
