import type { RoleType } from '@/config/roleSchemas';

export interface OnboardingState {
  roleType: RoleType | null;
  fullName: string;
  heroPreview: string | null;
}

export const ROLE_LABELS: Record<RoleType, string> = {
  founder: 'Founder',
  photographer: 'Photographer',
  talent: 'Talent',
  corporate: 'Corporate',
  designer: 'Designer',
  realtor: 'Realtor',
};
