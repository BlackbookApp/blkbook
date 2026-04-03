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
  | 'social_stat';

export const ROLE_SCHEMAS: Record<RoleType, ComponentType[]> = {
  founder: [
    'profile_hero_centered',
    'quote_block',
    'top_bio',
    'venture_card',
    'recognition_list',
    'now_block',
    'social_stat',
  ],
  photographer: [
    'profile_hero_centered',
    'quote_block',
    'image_portfolio',
    'image_gallery',
    'client_list',
    'press_strip',
    'quote_block',
    'about_section',
    'logo',
    'social_stat',
  ],
  talent: [
    'profile_hero_centered',
    'quote_block',
    'top_bio',
    'image_portfolio',
    'image_gallery',
    'client_list',
    'social_stat',
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
  ],
  designer: [
    'profile_hero_centered',
    'quote_block',
    'portfolio_card',
    'press_strip',
    'quote_block',
    'about_section',
    'now_block',
    'logo',
    'social_stat',
  ],
  realtor: [
    'profile_hero_centered',
    'quote_block',
    'portfolio_card',
    'recognition_list',
    'quote_block',
    'about_section',
    'now_block',
    'logo',
    'social_stat',
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
