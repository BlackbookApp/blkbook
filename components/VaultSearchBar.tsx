'use client';

import { useState, useEffect, useRef } from 'react';
import type React from 'react';
import { Search } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const searchFont: React.CSSProperties = {
  fontFamily: "'Granjon LT', 'Granjon LT Std', 'Granjon', Georgia, serif",
  fontSize: '13px',
  fontWeight: 400,
  fontStyle: 'italic',
  letterSpacing: '0.01em',
};

const placeholders = [
  'Who did I meet in Milan?',
  'The investor from last Tuesday.',
  'Her name started with S...',
  'The architect from Zürich.',
  'Who introduced me to James?',
];

const STORAGE_KEY = 'bb_recent_searches';
const MAX_RECENT = 5;

function loadRecentSearches(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function saveRecentSearches(searches: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
}

interface VaultSearchBarProps {
  onSearchChange?: (value: string) => void;
  recentContacts?: { name: string; detail: string }[];
}

const VaultSearchBar = ({ onSearchChange, recentContacts }: VaultSearchBarProps) => {
  const [search, setSearch] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => loadRecentSearches());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFocused) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isFocused]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative mt-3 mb-3">
      <div className="relative border border-border bg-background h-9 flex items-center px-2.5">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            onSearchChange?.(e.target.value);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            if (search.trim()) {
              const updated = [
                search.trim(),
                ...recentSearches.filter((s) => s !== search.trim()),
              ].slice(0, MAX_RECENT);
              setRecentSearches(updated);
              saveRecentSearches(updated);
            }
          }}
          className="w-full bg-transparent outline-none pr-5"
          style={{ ...searchFont, fontStyle: search ? 'normal' : 'italic', color: '#0E0E0E' }}
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
                style={{ ...searchFont, color: '#9A9691' }}
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

      <AnimatePresence>
        {isFocused && !search && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute left-0 right-0 top-full z-50 mt-1 border border-border/50 overflow-hidden bg-background/90"
            style={{
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            {recentSearches.length > 0 && (
              <div className="px-4 pt-4 pb-2">
                <p className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground/60 mb-2">
                  Recent searches
                </p>
                <div className="space-y-1.5">
                  {recentSearches.map((query) => (
                    <button
                      key={query}
                      className="w-full text-left text-[12px] text-muted-foreground hover:text-foreground transition-colors py-1"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setSearch(query);
                        onSearchChange?.(query);
                        setIsFocused(false);
                      }}
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(recentContacts?.length ?? 0) > 0 && (
              <>
                {recentSearches.length > 0 && <div className="h-px bg-border/50 mx-4" />}
                <div className="px-4 pt-2 pb-4">
                  <p className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground/60 mb-2">
                    Recently added
                  </p>
                  <div className="space-y-1.5">
                    {recentContacts?.map((item) => (
                      <div key={item.name} className="py-1">
                        <p className="text-[12px] text-foreground">
                          <span className="font-bold">{item.name}</span>
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 font-light">
                          {item.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VaultSearchBar;
