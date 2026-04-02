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
        years: z.string().nullable(),
        role: z.string().nullable(),
        description: z.string().nullable(),
        detail: z.string().nullable(),
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
        type: z.string().nullable(),
        location: z.string().nullable(),
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
    text: z.string().nullable(),
    text_attributed: z.string().nullable(),
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

import type { RoleType } from './roleSchemas';

export const ROLE_COMPONENT_SAMPLES: Record<RoleType, Partial<Record<ComponentType, unknown>>> = {
  founder: {
    quote_block: {
      text: 'Build something people want, then build something they need.',
      attributed: null,
    },
    top_bio: {
      text: 'Serial entrepreneur and product thinker with 10+ years building B2B software companies. Previously founded and exited two SaaS startups. Obsessed with distribution, design, and compounding value.',
    },
    venture_card: {
      items: [
        {
          name: 'Arcline',
          years: '2023 –',
          role: 'Founder & CEO',
          description: 'AI-powered sales intelligence for enterprise teams',
          detail: 'AI · Early stage · Stealth',
          url: null,
          logo_url: null,
        },
        {
          name: 'Fieldwork',
          years: '2019 – 2023',
          role: 'Co-Founder',
          description: 'Ops platform for distributed field teams',
          detail: 'SaaS · Acquired 2023',
          url: null,
          logo_url: null,
        },
      ],
    },
    recognition_list: {
      items: [
        { title: 'Forbes 30 Under 30 — Enterprise Technology', year: '2022', url: null },
        { title: 'TechCrunch Disrupt Finalist', year: '2021', url: null },
      ],
    },
    now_block: {
      text: "Building Arcline's go-to-market in the US. Looking for enterprise design partners. Reading everything about pricing strategy.",
    },
    action_buttons_secondary: {
      buttons: [
        { label: 'Schedule a call', url: null, style: 'primary' },
        { label: 'View deck', url: null, style: 'secondary' },
      ],
    },
  },
  photographer: {
    quote_block: {
      text: 'Every frame is a decision. Every decision is a story.',
      attributed: null,
    },
    image_portfolio: {
      text: null,
      text_attributed: null,
      images: [
        { url: null, caption: 'Editorial — Vogue Italia' },
        { url: null, caption: 'Campaign — Loewe SS24' },
        { url: null, caption: 'Portrait — The New Yorker' },
      ],
    },
    image_gallery: {
      images: [
        { url: null, caption: null },
        { url: null, caption: null },
        { url: null, caption: null },
      ],
    },
    client_list: {
      items: [
        { name: 'Vogue', logo_url: null },
        { name: 'Nike', logo_url: null },
        { name: 'The New Yorker', logo_url: null },
        { name: 'Loewe', logo_url: null },
      ],
    },
    press_strip: {
      items: [
        { name: 'Vogue', logo_url: null, url: null },
        { name: 'Aperture', logo_url: null, url: null },
        { name: 'British Journal of Photography', logo_url: null, url: null },
      ],
    },
    about_section: {
      text: 'London-based photographer working across fashion, portraiture, and documentary. Known for quiet tension and natural light. Represented by CLM.',
    },
    logo: { url: null, label: null },
    action_buttons_secondary: {
      buttons: [
        { label: 'Book a shoot', url: null, style: 'primary' },
        { label: 'View portfolio', url: null, style: 'secondary' },
      ],
    },
  },
  talent: {
    quote_block: {
      text: 'Presence is the craft. Everything else is technique.',
      attributed: null,
    },
    top_bio: {
      text: 'Actor and creative director based in New York. Represented by CAA. Recent credits include recurring roles in HBO and Netflix originals.',
    },
    image_portfolio: {
      text: null,
      text_attributed: null,
      images: [
        { url: null, caption: 'HBO — The Long Division' },
        { url: null, caption: 'Campaign — Calvin Klein' },
        { url: null, caption: 'Press — Variety' },
      ],
    },
    image_gallery: {
      images: [
        { url: null, caption: null },
        { url: null, caption: null },
      ],
    },
    client_list: {
      items: [
        { name: 'HBO', logo_url: null },
        { name: 'Netflix', logo_url: null },
        { name: 'Calvin Klein', logo_url: null },
      ],
    },
    action_buttons_secondary: {
      buttons: [
        { label: 'Contact representation', url: null, style: 'primary' },
        { label: 'View reel', url: null, style: 'secondary' },
      ],
    },
  },
  corporate: {
    top_bio: {
      text: 'Chief Operating Officer with 15 years scaling global operations across fintech and enterprise SaaS. Focused on building high-performance teams and repeatable growth systems.',
    },
    experience_timeline: {
      items: [
        {
          role: 'Chief Operating Officer',
          company: 'Meridian Financial',
          start_year: '2020',
          end_year: null,
          description: null,
          type: 'Full-time',
          location: 'New York, NY · On-site',
        },
        {
          role: 'VP of Operations',
          company: 'Palantir Technologies',
          start_year: '2016',
          end_year: '2020',
          description: null,
          type: 'Full-time',
          location: 'New York, NY · On-site',
        },
        {
          role: 'Senior Manager',
          company: 'McKinsey & Company',
          start_year: '2011',
          end_year: '2016',
          description: null,
          type: 'Full-time',
          location: 'New York, NY',
        },
      ],
    },
    image_portfolio: {
      text: null,
      text_attributed: null,
      images: [
        { url: null, caption: 'Keynote — Davos 2023' },
        { url: null, caption: 'Panel — WSJ CEO Summit' },
      ],
    },
    recognition_list: {
      items: [
        { title: 'Fortune 40 Under 40', year: '2023', url: null },
        { title: 'WSJ — Women to Watch', year: '2022', url: null },
      ],
    },
    about_section: {
      text: 'I believe operational excellence is a competitive advantage. I work at the intersection of strategy, people, and execution.',
    },
    logo: { url: null, label: 'Meridian Financial' },
    action_buttons_secondary: {
      buttons: [
        { label: 'Connect on LinkedIn', url: null, style: 'primary' },
        { label: 'Download CV', url: null, style: 'secondary' },
      ],
    },
  },
  designer: {
    quote_block: {
      text: 'Good design is invisible. Great design changes behavior.',
      attributed: null,
    },
    portfolio_card: {
      items: [
        { title: 'Chord — Brand Identity', image_url: null, url: null },
        { title: 'Oura — App Redesign', image_url: null, url: null },
        { title: 'Matter — Design System', image_url: null, url: null },
      ],
    },
    press_strip: {
      items: [
        { name: "It's Nice That", logo_url: null, url: null },
        { name: 'Dezeen', logo_url: null, url: null },
        { name: 'Eye Magazine', logo_url: null, url: null },
      ],
    },
    about_section: {
      text: 'Independent designer and art director. I work with early-stage startups and established brands to build visual languages that last. Previously at Pentagram and Figma.',
    },
    now_block: {
      text: "Taking on two new brand projects for Q2. Teaching a summer intensive at SVA. Finishing a type specimen for a custom typeface I've been drawing for three years.",
    },
    logo: { url: null, label: null },
    action_buttons_secondary: {
      buttons: [
        { label: 'Start a project', url: null, style: 'primary' },
        { label: 'View work', url: null, style: 'secondary' },
      ],
    },
  },
  realtor: {
    quote_block: {
      text: "Finding the right home isn't a transaction — it's a turning point.",
      attributed: null,
    },
    portfolio_card: {
      items: [
        { title: 'The Standish — Brooklyn Heights', image_url: null, url: null },
        { title: 'Tribeca Loft — Hudson Street', image_url: null, url: null },
        { title: 'West Village Townhouse', image_url: null, url: null },
      ],
    },
    recognition_list: {
      items: [
        { title: 'RealTrends Top 1% Agent — New York', year: '2024', url: null },
        { title: 'WSJ Real Estate — Top Producers', year: '2023', url: null },
      ],
    },
    about_section: {
      text: 'Luxury residential broker with $500M+ in career sales across Manhattan and Brooklyn. Known for discretion, market depth, and negotiation.',
    },
    now_block: {
      text: 'Three listings coming to market in April. Actively working with buyers in Tribeca and the West Village. Available for private consultations.',
    },
    logo: { url: null, label: null },
    action_buttons_secondary: {
      buttons: [
        { label: 'Schedule a consultation', url: null, style: 'primary' },
        { label: 'View listings', url: null, style: 'secondary' },
      ],
    },
  },
};

const SAMPLE_IMAGE =
  'http://127.0.0.1:54321/storage/v1/object/public/avatars/e14b3e9f-8c40-44af-a932-da1d10af3ba4/avatar.jpeg';
const SAMPLE_PORTFOLIO_IMAGE =
  'http://127.0.0.1:54321/storage/v1/object/public/portfolio/e14b3e9f-8c40-44af-a932-da1d10af3ba4/portfolio-fendi.png';

// Flat sample per component type — used for test/preview pages
export const ALL_COMPONENT_SAMPLES: Record<ComponentType, unknown> = {
  profile_hero_centered: {
    name: 'Alex Rivera',
    image_url: null,
    tagline: 'Founder & Creative Director',
    location: 'New York',
  },
  quote_block: {
    text: 'Build something people want, then build something they need.',
    attributed: 'Alex Rivera',
  },
  top_bio: {
    text: 'Serial entrepreneur and product thinker with 10+ years building B2B software companies. Previously founded and exited two SaaS startups. Obsessed with distribution, design, and compounding value.',
  },
  venture_card: {
    items: [
      {
        name: 'Arcline',
        years: '2023 –',
        role: 'Founder & CEO',
        description: 'AI-powered sales intelligence for enterprise teams',
        detail: 'AI · Early stage · Stealth',
        url: 'https://arcline.io',
        logo_url: SAMPLE_IMAGE,
      },
      {
        name: 'Fieldwork',
        years: '2019 – 2023',
        role: 'Co-Founder',
        description: 'Ops platform for distributed field teams',
        detail: 'SaaS · Acquired 2023',
        url: 'https://fieldwork.io',
        logo_url: SAMPLE_IMAGE,
      },
    ],
  },
  experience_timeline: {
    items: [
      {
        role: 'Chief Operating Officer',
        company: 'Meridian Financial',
        start_year: '2020',
        end_year: null,
        description:
          'Leading global operations across 12 markets. Scaled revenue from $40M to $180M ARR in three years.',
        type: 'Full-time',
        location: 'New York, NY · On-site',
      },
      {
        role: 'VP of Operations',
        company: 'Palantir Technologies',
        start_year: '2016',
        end_year: '2020',
        description:
          'Built and managed the enterprise deployment team responsible for US government contracts.',
        type: 'Full-time',
        location: 'New York, NY · On-site',
      },
      {
        role: 'Senior Manager',
        company: 'McKinsey & Company',
        start_year: '2011',
        end_year: '2016',
        description:
          'Strategy and operations consulting for Fortune 500 clients in financial services and healthcare.',
        type: 'Full-time',
        location: 'New York, NY',
      },
    ],
  },
  portfolio_card: {
    items: [
      {
        title: 'Chord — Brand Identity',
        image_url: SAMPLE_PORTFOLIO_IMAGE,
        url: 'https://chord.co',
      },
      {
        title: 'Oura — App Redesign',
        image_url: SAMPLE_PORTFOLIO_IMAGE,
        url: 'https://ouraring.com',
      },
      {
        title: 'Matter — Design System',
        image_url: SAMPLE_PORTFOLIO_IMAGE,
        url: 'https://matter.design',
      },
    ],
  },
  image_portfolio: {
    text: null,
    text_attributed: null,
    images: [
      { url: SAMPLE_PORTFOLIO_IMAGE, caption: 'Editorial — Vogue Italia' },
      { url: SAMPLE_PORTFOLIO_IMAGE, caption: 'Campaign — Loewe SS24' },
      { url: SAMPLE_PORTFOLIO_IMAGE, caption: 'Portrait — The New Yorker' },
    ],
  },
  image_gallery: {
    images: [
      { url: SAMPLE_PORTFOLIO_IMAGE, caption: 'Studio session, 2024' },
      { url: SAMPLE_PORTFOLIO_IMAGE, caption: 'On location, Tokyo' },
      { url: SAMPLE_PORTFOLIO_IMAGE, caption: null },
    ],
  },
  client_list: {
    items: [
      { name: 'Vogue', logo_url: SAMPLE_IMAGE },
      { name: 'Nike', logo_url: SAMPLE_IMAGE },
      { name: 'The New Yorker', logo_url: SAMPLE_IMAGE },
      { name: 'Loewe', logo_url: SAMPLE_IMAGE },
    ],
  },
  recognition_list: {
    items: [
      {
        title: 'Forbes 30 Under 30 — Enterprise Technology',
        year: '2022',
        url: 'https://forbes.com/30under30',
      },
      { title: 'TechCrunch Disrupt Finalist', year: '2021', url: 'https://techcrunch.com/disrupt' },
    ],
  },
  press_strip: {
    items: [
      { name: 'Vogue', logo_url: null, url: 'https://vogue.com' },
      { name: 'Aperture', logo_url: null, url: 'https://aperture.org' },
      { name: 'British Journal of Photography', logo_url: null, url: 'https://bjp-online.com' },
    ],
  },
  about_section: {
    text: 'London-based photographer working across fashion, portraiture, and documentary. Known for quiet tension and natural light. Represented by CLM.',
  },
  now_block: {
    text: "Building Arcline's go-to-market in the US. Looking for enterprise design partners. Reading everything about pricing strategy.",
  },
  logo: { url: SAMPLE_IMAGE, label: 'Meridian Financial' },
  social_stat: {
    items: [
      {
        platform: 'LinkedIn',
        handle: '@alexrivera',
        count: '12K',
        url: 'https://linkedin.com/in/alexrivera',
      },
      {
        platform: 'Instagram',
        handle: '@alex.rivera',
        count: '48K',
        url: 'https://instagram.com/alex.rivera',
      },
    ],
  },
  action_buttons_secondary: {
    buttons: [
      { label: 'Schedule a call', url: 'https://cal.com/alexrivera', style: 'primary' },
      { label: 'View work', url: 'https://alexrivera.com', style: 'secondary' },
    ],
  },
};

export const COMPONENT_DEFAULTS: Record<ComponentType, unknown> = {
  profile_hero_centered: { name: null, image_url: null, tagline: null, location: null },
  quote_block: { text: null, attributed: null },
  top_bio: { text: null },
  venture_card: { items: [] },
  experience_timeline: { items: [] },
  portfolio_card: { items: [] },
  image_portfolio: { text: null, text_attributed: null, images: [] },
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
