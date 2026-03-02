import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const placeholders = [
  'Who did I meet in Milan?',
  'The investor from last Tuesday.',
  'Her name started with S...',
  'The architect from Zürich.',
  'Who introduced me to James?',
];

const recentSearches = [
  { query: 'Milan contacts', highlight: 'Milan' },
  { query: 'Sarah from London', highlight: 'Sarah' },
  { query: 'Design Week introductions', highlight: 'Design Week' },
];

const recentlyAdded = [
  { name: 'Alessandro Tocchi', detail: 'Event Planner — Milan' },
  { name: 'Charlotte Kim', detail: 'Fashion Editor — Seoul' },
  { name: 'Elena Vance', detail: 'Art Director — Paris' },
];

interface VaultSearchBarProps {
  onSearchChange?: (value: string) => void;
}

const VaultSearchBar = ({ onSearchChange }: VaultSearchBarProps) => {
  const [search, setSearch] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Rotate placeholders every 4 seconds
  useEffect(() => {
    if (isFocused) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isFocused]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const highlightName = (text: string, highlight: string) => {
    const idx = text.indexOf(highlight);
    if (idx === -1) return <span>{text}</span>;
    return (
      <span>
        {text.slice(0, idx)}
        <span className="font-bold text-foreground">{highlight}</span>
        {text.slice(idx + highlight.length)}
      </span>
    );
  };

  return (
    <div ref={containerRef} className="relative mt-3 mb-3">
      {/* Search field with border */}
      <div className="relative border border-border bg-transparent h-9 flex items-center px-2.5">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            onSearchChange?.(e.target.value);
          }}
          onFocus={() => setIsFocused(true)}
          className="w-full bg-transparent outline-none pr-5 text-[11px] uppercase tracking-[0.15em]"
          style={{ fontFamily: "'Engravers Gothic', 'Helvetica Neue', sans-serif" }}
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
                className="whitespace-nowrap text-[11px] uppercase tracking-[0.15em] text-foreground/40"
                style={{ fontFamily: "'Engravers Gothic', 'Helvetica Neue', sans-serif" }}
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

      {/* Frosted glass dropdown */}
      <AnimatePresence>
        {isFocused && !search && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute left-0 right-0 top-full z-50 mt-1 border border-border/50 overflow-hidden"
            style={{
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              background: 'rgba(245, 244, 240, 0.85)',
            }}
          >
            {/* Recent Searches */}
            <div className="px-4 pt-4 pb-2">
              <p className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground/60 mb-2">
                Recent searches
              </p>
              <div className="space-y-1.5">
                {recentSearches.map((item, i) => (
                  <button
                    key={i}
                    className="w-full text-left text-[12px] text-muted-foreground hover:text-foreground transition-colors py-1"
                    onClick={() => {
                      setSearch(item.query);
                      onSearchChange?.(item.query);
                      setIsFocused(false);
                    }}
                  >
                    {highlightName(item.query, item.highlight)}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-border/50 mx-4" />

            {/* Recently Added */}
            <div className="px-4 pt-2 pb-4">
              <p className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground/60 mb-2">
                Recently added
              </p>
              <div className="space-y-1.5">
                {recentlyAdded.map((item, i) => (
                  <div key={i} className="py-1">
                    <p className="text-[12px] text-foreground">
                      <span className="font-bold">{item.name}</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 font-light">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VaultSearchBar;
