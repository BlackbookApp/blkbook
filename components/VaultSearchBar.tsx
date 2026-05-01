'use client';

import { useState, useEffect } from 'react';
import type React from 'react';
import { Search } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const searchFont: React.CSSProperties = {
  fontFamily: "'Granjon LT', 'Granjon LT Std', 'Granjon', Georgia, serif",
  fontSize: '16px',
  fontWeight: 400,
  fontStyle: 'italic',
  letterSpacing: '0.01em',
};

const placeholders = [
  'Search a name, role, location or note...',
  // 'Who did I meet in Milan?',
  // 'The investor from last Tuesday.',
  // 'Her name started with S...',
  // 'The architect from Zürich.',
  // 'Who introduced me to James?',
];

interface VaultSearchBarProps {
  onSearchChange?: (value: string) => void;
}

const VaultSearchBar = ({ onSearchChange }: VaultSearchBarProps) => {
  const [search, setSearch] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (isFocused) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isFocused]);

  return (
    <div className="relative mt-3 mb-3" data-tour="search">
      <div className="relative border border-border bg-white h-9 flex items-center px-2.5">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            onSearchChange?.(e.target.value);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full bg-transparent outline-none pr-5"
          style={{
            ...searchFont,
            fontStyle: search ? 'normal' : 'italic',
            color: 'var(--color-bb-dark)',
          }}
          placeholder=""
        />

        {!search && !isFocused && (
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.span
                key={placeholderIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="whitespace-nowrap"
                style={{ ...searchFont, color: 'var(--color-bb-muted)' }}
              >
                {placeholders[placeholderIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        )}

        <Search
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/40"
          strokeWidth={1.5}
        />
      </div>
    </div>
  );
};

export default VaultSearchBar;
