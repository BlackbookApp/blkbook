export type RoleType = 'founder' | 'photographer' | 'talent' | 'corporate' | 'designer' | 'realtor';

export type ComponentType =
  | 'profile_hero_centered'
  | 'quote_block'
  | 'top_bio'
  | 'venture_card'
  | 'experience_timeline'
  | 'portfolio_card'
  | 'image_portfolio'
  | 'image_gallery'
  | 'client_list'
  | 'recognition_list'
  | 'press_strip'
  | 'about_section'
  | 'now_block'
  | 'logo'
  | 'social_stat'
  | 'action_buttons_secondary';

// Components listed in render order per role
// QuoteBlock appears twice for some roles — use position to handle ordering

export const ROLE_SCHEMAS: Record<RoleType, ComponentType[]> = {
  founder: [
    'profile_hero_centered',
    'quote_block', // position 2
    'top_bio',
    'venture_card',
    'recognition_list',
    'now_block',
    'social_stat',
    'action_buttons_secondary',
  ],
  photographer: [
    'profile_hero_centered',
    'quote_block', // position 2
    'image_portfolio',
    'image_gallery',
    'client_list',
    'press_strip',
    'quote_block', // position 6 — second instance
    'about_section',
    'logo',
    'social_stat',
    'action_buttons_secondary',
  ],
  talent: [
    'profile_hero_centered',
    'quote_block', // position 2
    'top_bio',
    'image_portfolio',
    'image_gallery',
    'client_list',
    'social_stat',
    'action_buttons_secondary',
  ],
  corporate: [
    'profile_hero_centered',
    'top_bio',
    'experience_timeline',
    'image_portfolio',
    'recognition_list',
    'about_section',
    'logo',
    'social_stat',
    'action_buttons_secondary',
  ],
  designer: [
    'profile_hero_centered',
    'quote_block', // position 2
    'portfolio_card',
    'press_strip',
    'quote_block', // position 6 — second instance
    'about_section',
    'now_block',
    'logo',
    'social_stat',
    'action_buttons_secondary',
  ],
  realtor: [
    'profile_hero_centered',
    'quote_block', // position 2
    'portfolio_card',
    'recognition_list',
    'quote_block', // position 6 — second instance
    'about_section',
    'now_block',
    'logo',
    'social_stat',
    'action_buttons_secondary',
  ],
};

export const REQUIRED_COMPONENTS: Record<RoleType, ComponentType[]> = {
  founder: ['profile_hero_centered'],
  photographer: ['profile_hero_centered'],
  talent: ['profile_hero_centered'],
  corporate: ['profile_hero_centered'],
  designer: ['profile_hero_centered'],
  realtor: ['profile_hero_centered'],
};
