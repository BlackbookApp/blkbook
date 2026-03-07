'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Plus, X, Image as ImageIcon } from 'lucide-react';
import type { WorkData, PortfolioEntry } from './types';
import { Input } from '@/components/ui/input';

interface StepWorkProps {
  work: WorkData;
  setWork: (w: WorkData) => void;
  removedPortfolioIds: string[];
  setRemovedPortfolioIds: (ids: string[]) => void;
  logoFile: File | null;
  setLogoFile: (f: File | null) => void;
  onFinish: () => void;
}

export const StepWork = ({
  work,
  setWork,
  removedPortfolioIds,
  setRemovedPortfolioIds,
  setLogoFile,
  onFinish,
}: StepWorkProps) => {
  const portfolioInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handlePortfolioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newEntries: PortfolioEntry[] = Array.from(files).map((f) => ({
      url: URL.createObjectURL(f),
      file: f,
    }));
    setWork({ ...work, portfolioImages: [...work.portfolioImages, ...newEntries] });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setWork({ ...work, logo: URL.createObjectURL(file) });
  };

  const removePortfolioImage = (idx: number) => {
    const entry = work.portfolioImages[idx];
    if (entry.id) {
      setRemovedPortfolioIds([...removedPortfolioIds, entry.id]);
    }
    setWork({ ...work, portfolioImages: work.portfolioImages.filter((_, i) => i !== idx) });
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
            {work.portfolioImages.map((entry, i) => (
              <div key={entry.id ?? entry.url} className="relative w-16 h-16">
                <Image
                  src={entry.url}
                  alt=""
                  width={64}
                  height={64}
                  className="w-full h-full object-cover border border-border"
                  unoptimized
                />
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
            <Image
              src={work.logo}
              alt="Logo"
              width={40}
              height={40}
              className="h-10 mx-auto object-contain w-auto"
              unoptimized
            />
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

      <div className="mb-6">
        <div className="space-y-3">
          {work.testimonials.map((t, i) => (
            <div key={i} className="border border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                  {i === 0 ? 'A line from someone who knows your work' : `Testimonial ${i + 1}`}
                </p>
                {work.testimonials.length > 1 && (
                  <button
                    onClick={() =>
                      setWork({
                        ...work,
                        testimonials: work.testimonials.filter((_, idx) => idx !== i),
                      })
                    }
                    className="text-muted-foreground/40 hover:text-foreground transition-colors ml-2"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              <textarea
                value={t.quote}
                onChange={(e) => {
                  const updated = [...work.testimonials];
                  updated[i] = { ...updated[i], quote: e.target.value };
                  setWork({ ...work, testimonials: updated });
                }}
                placeholder="What they said about you..."
                rows={2}
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 placeholder:italic focus:outline-none resize-none mb-2"
              />
              <div className="flex gap-3">
                <Input
                  value={t.author}
                  onChange={(e) => {
                    const updated = [...work.testimonials];
                    updated[i] = { ...updated[i], author: e.target.value };
                    setWork({ ...work, testimonials: updated });
                  }}
                  placeholder="Name"
                  className="flex-1 py-2 text-[11px] placeholder:text-muted-foreground/40"
                />
                <Input
                  value={t.title}
                  onChange={(e) => {
                    const updated = [...work.testimonials];
                    updated[i] = { ...updated[i], title: e.target.value };
                    setWork({ ...work, testimonials: updated });
                  }}
                  placeholder="Title"
                  className="flex-1 py-2 text-[11px] placeholder:text-muted-foreground/40"
                />
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() =>
            setWork({
              ...work,
              testimonials: [...work.testimonials, { quote: '', author: '', title: '' }],
            })
          }
          className="mt-2 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus className="w-3 h-3" />
          Add another
        </button>
      </div>

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

      <div className="mt-auto">
        <button onClick={onFinish} className="bb-btn-primary">
          Preview profile
        </button>
      </div>
    </motion.div>
  );
};
