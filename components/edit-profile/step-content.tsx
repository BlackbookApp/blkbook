'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { EDITOR_MAP } from '@/config/editorMap';
import { updateComponentVisibilityAction } from '@/app/actions/components';
import type { ProfileComponent } from '@/lib/data/components';
import type { ComponentType } from '@/config/roleSchemas';

const EXAMPLE_COPY: Partial<Record<ComponentType, string>> = {
  top_bio:
    '"Specialising in timeless, fine-art weddings across Europe and beyond. My work has been featured in Vogue, Elle, and Harper\'s Bazaar."',
  quote_block: '"The best work comes from understanding people, not just problems."',
  venture_card: '"Founder of Atelier Studio and co-creator of the Lumen Design System."',
  experience_timeline: '"Creative Director at LVMH, previously Head of Brand at Spotify."',
  portfolio_card: '"Selected projects from five years of independent creative practice."',
  image_portfolio: '"A curated selection of editorial and commercial photography."',
  image_gallery: '"Behind the scenes and finished work, side by side."',
  client_list: '"Apple, Chanel, The Guardian, Nike, and Tiffany & Co."',
  recognition_list: '"D&AD Yellow Pencil · Cannes Lions Grand Prix · Forbes 30 Under 30."',
  press_strip: '"As seen in The New York Times, Monocle, and Wallpaper*."',
  about_section: '"A longer introduction — your background, values, and what drives your work."',
  now_block: '"Writing a book on design systems. Based in Lisbon until June."',
  logo: '"Your studio or personal brand mark, displayed prominently."',
  social_stat: '"120k on Instagram · 45k on LinkedIn · 8k newsletter subscribers."',
  action_buttons_secondary: '"Book a call · Download portfolio · Visit studio site."',
};

interface StepContentProps {
  components: ProfileComponent[];
}

export function StepContent({ components }: StepContentProps) {
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
    <div className="space-y-4">
      <AnimatePresence initial={false}>
        {visibleComponents.map((component) => {
          const type = component.type as ComponentType;
          const entry = EDITOR_MAP[type];
          if (!entry) return null;
          const EditorComponent = entry.component;
          const example = EXAMPLE_COPY[type];

          return (
            <motion.div
              key={component.id}
              layout
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="border border-bb-rule"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-bb-rule">
                <span className="blackbook-label">{entry.label.toUpperCase()}</span>
                <button
                  onClick={() => handleHide(component.id)}
                  className="text-bb-muted/50 hover:text-foreground transition-colors"
                  aria-label={`Hide ${entry.label}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {example && (
                <div className="px-4 pt-3 pb-2 border-b border-bb-rule">
                  <p className="blackbook-label mb-1.5">EXAMPLE</p>
                  <p className="font-granjon text-sm text-bb-muted italic">{example}</p>
                </div>
              )}

              <div className="px-4 py-4">
                <EditorComponent component={component} />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {hiddenComponents.length > 0 && (
        <div className="pt-4">
          <p className="blackbook-label mb-3">ADD A SECTION</p>
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
                    className="flex-shrink-0 font-helvetica text-[10px] tracking-[0.15em] border border-bb-rule px-3 py-2 hover:bg-bb-rule/30 transition-colors whitespace-nowrap"
                  >
                    + {entry.label.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
