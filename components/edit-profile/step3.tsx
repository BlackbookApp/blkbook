'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { EDITOR_MAP } from '@/config/editorMap';
import { updateComponentVisibilityAction } from '@/app/actions/components';
import type { ProfileComponent } from '@/lib/data/components';
import type { ComponentType } from '@/config/roleSchemas';
import Image from 'next/image';
import { authTokens } from './step1';
import dainaHazelLogo from '@/assets/daina-hazel-logo.png';

const { helvetica, granjon, card, inkSoft, muted, hairline, hairlineSoft } = authTokens;

const EXAMPLE_ATTRIBUTION: Partial<Record<ComponentType, string>> = {
  quote_block: "— Harper's Bazaar",
};

const EXAMPLE_COPY: Partial<Record<ComponentType, string>> = {
  top_bio:
    "Specialising in timeless, fine-art weddings across Europe and beyond. My work has been featured in Vogue, Elle, and Harper's Bazaar.",
  quote_block: 'Named one of the top wedding photographers in the world.',
  venture_card: 'Founder of Atelier Studio and co-creator of the Lumen Design System.',
  experience_timeline: 'Creative Director at LVMH, previously Head of Brand at Spotify.',
  portfolio_card: 'Selected projects from five years of independent creative practice.',
  image_portfolio: 'A curated selection of editorial and commercial photography.',
  image_gallery: 'Behind the scenes and finished work, side by side.',
  client_list: 'Apple, Chanel, The Guardian, Nike, and Tiffany & Co.',
  recognition_list: 'D&AD Yellow Pencil · Cannes Lions Grand Prix · Forbes 30 Under 30.',
  press_strip: 'As seen in The New York Times, Monocle, and Wallpaper*.',
  about_section: 'A longer introduction — your background, values, and what drives your work.',
  now_block: 'Writing a book on design systems. Based in Lisbon until June.',
  logo: 'Your studio or personal brand mark, displayed prominently.',
};

interface Step3Props {
  components: ProfileComponent[];
  onFinish: () => void;
  onBack: () => void;
}

export function Step3({ components, onFinish, onBack }: Step3Props) {
  const [visibilityMap, setVisibilityMap] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(components.map((c) => [c.id, c.is_visible]))
  );

  const handleHide = async (id: string) => {
    setVisibilityMap((prev) => ({ ...prev, [id]: false }));
    await updateComponentVisibilityAction(id, false);
  };

  const handleShow = async (id: string) => {
    setVisibilityMap((prev) => ({ ...prev, [id]: true }));
    await updateComponentVisibilityAction(id, true);
  };

  const visibleComponents = components
    .filter((c) => visibilityMap[c.id])
    .sort((a, b) => a.position - b.position);

  const hiddenComponents = components
    .filter((c) => !visibilityMap[c.id])
    .sort((a, b) => a.position - b.position);

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.25 }}
      className="flex-1 flex flex-col px-6 pt-8 pb-8 overflow-y-auto min-h-0"
    >
      <div className="flex flex-col items-center mb-8">
        <p className="font-helvetica text-[10px] uppercase tracking-[0.15em] mb-2">Your content</p>
        <h2 className="font-granjon text-[28px] leading-tight text-bb-dark mb-1 normal-case">
          Tell your <em>story</em>
        </h2>
        <p className="font-helvetica text-[11px] font-light text-bb-muted text-center">
          Remove anything you don&apos;t need. Changes save automatically.
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <AnimatePresence initial={false}>
          {visibleComponents.map((component) => {
            const type = component.type as ComponentType;
            const entry = EDITOR_MAP[type];
            if (!entry) return null;
            const EditorComponent = entry.component;
            const example = EXAMPLE_COPY[type];
            const attribution = EXAMPLE_ATTRIBUTION[type];

            return (
              <motion.div
                key={component.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                transition={{ duration: 0.25 }}
                className="rounded-[6px] overflow-hidden"
                style={{ background: card, border: `1px solid ${hairline}` }}
              >
                <div
                  className="flex items-center justify-between px-4 pt-3.5 pb-3"
                  style={{ borderBottom: `1px solid ${hairlineSoft}` }}
                >
                  <span
                    style={{
                      fontFamily: helvetica,
                      fontSize: '11px',
                      color: inkSoft,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {entry.label}
                  </span>
                  <button
                    onClick={() => handleHide(component.id)}
                    className="w-6 h-6 flex items-center justify-center rounded-full transition-opacity hover:opacity-60"
                    aria-label={`Hide ${entry.label}`}
                  >
                    <X className="w-3.5 h-3.5" strokeWidth={1.5} style={{ color: muted }} />
                  </button>
                </div>

                {(example || type === 'logo') && (
                  <div
                    className="px-4 py-3"
                    style={{ borderBottom: `1px solid ${hairlineSoft}`, background: '#f7f5ee' }}
                  >
                    <p
                      className="uppercase mb-1.5"
                      style={{
                        fontFamily: helvetica,
                        fontSize: '9.5px',
                        letterSpacing: '0.22em',
                        color: muted,
                      }}
                    >
                      Example
                    </p>
                    {type === 'logo' ? (
                      <div className="flex justify-center py-5">
                        <Image
                          src={dainaHazelLogo}
                          alt="Example logo"
                          height={40}
                          className="w-auto object-contain opacity-55"
                        />
                      </div>
                    ) : (
                      <>
                        <p
                          className="text-[12.5px] italic leading-[1.65]"
                          style={{ fontFamily: granjon, color: inkSoft }}
                        >
                          &ldquo;{example}&rdquo;
                        </p>
                        {attribution && (
                          <p
                            className="mt-1.5"
                            style={{
                              fontFamily: helvetica,
                              fontSize: '10px',
                              letterSpacing: '0.04em',
                              color: muted,
                            }}
                          >
                            {attribution}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                )}

                <div className="px-4 py-4 [&_input]:font-granjon [&_textarea]:font-granjon">
                  <EditorComponent component={component} />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {hiddenComponents.length > 0 && (
        <div className="mb-8">
          <p
            className="mb-3 px-1"
            style={{
              fontFamily: helvetica,
              fontSize: '9.5px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: muted,
            }}
          >
            Add a section
          </p>
          <div className="overflow-x-auto -mx-6 px-6">
            <div className="flex gap-2 pb-1">
              {hiddenComponents.map((component) => {
                const type = component.type as ComponentType;
                const entry = EDITOR_MAP[type];
                if (!entry) return null;
                return (
                  <button
                    key={component.id}
                    onClick={() => handleShow(component.id)}
                    className="flex-shrink-0 transition-opacity hover:opacity-70"
                    style={{
                      fontFamily: helvetica,
                      fontSize: '10px',
                      letterSpacing: '0.15em',
                      border: `1px solid ${hairline}`,
                      borderRadius: '4px',
                      padding: '6px 12px',
                      color: inkSoft,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    + {entry.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="pt-2">
        <Button variant="blackbook" size="full" onClick={onFinish}>
          Save profile
        </Button>
        <Button variant="blackbook-ghost" type="button" className="w-full mt-3" onClick={onBack}>
          BACK
        </Button>
      </div>
    </motion.div>
  );
}
