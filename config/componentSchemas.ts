import { z } from 'zod';
import type { ComponentType } from './roleSchemas';

export const COMPONENT_SCHEMAS = {
  profile_hero_centered: z.object({
    name: z.string().min(1),
    image_url: z.string().url().nullable(),
    tagline: z.string().nullable(),
    location: z.string().nullable(),
  }),
  quote_block: z.object({
    text: z.string().nullable(),
    attributed: z.string().nullable(),
  }),
  top_bio: z.object({
    text: z.string().nullable(),
  }),
  venture_card: z.object({
    items: z.array(
      z.object({
        name: z.string(),
        description: z.string().nullable(),
        url: z.string().url().nullable(),
        logo_url: z.string().url().nullable(),
      })
    ),
  }),
  experience_timeline: z.object({
    items: z.array(
      z.object({
        role: z.string(),
        company: z.string(),
        start_year: z.string().nullable(),
        end_year: z.string().nullable(),
        description: z.string().nullable(),
      })
    ),
  }),
  portfolio_card: z.object({
    items: z.array(
      z.object({
        title: z.string(),
        image_url: z.string().url().nullable(),
        url: z.string().url().nullable(),
      })
    ),
  }),
  image_portfolio: z.object({
    images: z.array(
      z.object({
        url: z.string().url().nullable(),
        caption: z.string().nullable(),
      })
    ),
  }),
  image_gallery: z.object({
    images: z.array(
      z.object({
        url: z.string().url().nullable(),
        caption: z.string().nullable(),
      })
    ),
  }),
  client_list: z.object({
    items: z.array(
      z.object({
        name: z.string(),
        logo_url: z.string().url().nullable(),
      })
    ),
  }),
  recognition_list: z.object({
    items: z.array(
      z.object({
        title: z.string(),
        year: z.string().nullable(),
        url: z.string().url().nullable(),
      })
    ),
  }),
  press_strip: z.object({
    items: z.array(
      z.object({
        name: z.string(),
        logo_url: z.string().url().nullable(),
        url: z.string().url().nullable(),
      })
    ),
  }),
  about_section: z.object({
    text: z.string().nullable(),
  }),
  now_block: z.object({
    text: z.string().nullable(),
  }),
  logo: z.object({
    url: z.string().url().nullable(),
    label: z.string().nullable(),
  }),
  social_stat: z.object({
    items: z.array(
      z.object({
        platform: z.string(),
        handle: z.string().nullable(),
        count: z.string().nullable(),
        url: z.string().url().nullable(),
      })
    ),
  }),
  action_buttons_secondary: z.object({
    buttons: z.array(
      z.object({
        label: z.string(),
        url: z.string().url().nullable(),
        style: z.enum(['primary', 'secondary']).nullable(),
      })
    ),
  }),
};

export const COMPONENT_DEFAULTS: Record<ComponentType, unknown> = {
  profile_hero_centered: { name: null, image_url: null, tagline: null, location: null },
  quote_block: { text: null, attributed: null },
  top_bio: { text: null },
  venture_card: { items: [] },
  experience_timeline: { items: [] },
  portfolio_card: { items: [] },
  image_portfolio: { images: [] },
  image_gallery: { images: [] },
  client_list: { items: [] },
  recognition_list: { items: [] },
  press_strip: { items: [] },
  about_section: { text: null },
  now_block: { text: null },
  logo: { url: null, label: null },
  social_stat: { items: [] },
  action_buttons_secondary: { buttons: [] },
};
