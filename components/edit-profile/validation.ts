import { z } from 'zod';
import type { SocialFields, WorkData } from './types';

// ─── Primitives ───────────────────────────────────────────────────────────────

const optionalUrl = z
  .string()
  .refine((v) => !v || /^(https?:\/\/)?[\w-]+(\.[\w-]+)+/.test(v), 'Enter a valid URL');

const optionalEmail = z.union([z.literal(''), z.string().email('Enter a valid email')]);

const optionalPhone = z.string().refine((v) => {
  if (!v) return true;
  const digits = v.replace(/\D/g, '');
  // E.164: 7–15 digits; must start with + if international, or be a local number
  return digits.length >= 7 && digits.length <= 15;
}, 'Enter a valid phone number (7–15 digits)');

const optionalHandle = z
  .string()
  .refine((v) => !v || /^@?[\w.]+$/.test(v), 'Enter a valid handle (e.g. @username)');

// ─── Schemas ─────────────────────────────────────────────────────────────────

export const profileStepSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().max(300, 'Bio must be under 300 characters').optional(),
  socials: z.object({
    website: optionalUrl,
    instagram: optionalHandle,
    tiktok: optionalHandle,
    linkedin: optionalUrl,
    twitter: optionalHandle,
    email: optionalEmail,
    phone: optionalPhone,
    whatsapp: optionalPhone,
  }),
});

export const workStepSchema = z.object({
  brandStatement: z.string().max(500, 'Brand statement must be under 500 characters').optional(),
  testimonials: z
    .array(
      z.object({
        quote: z.string().optional(),
        author: z.string().optional(),
        title: z.string().optional(),
      })
    )
    .optional(),
});

// ─── Error types ─────────────────────────────────────────────────────────────

export interface ProfileStepErrors {
  name?: string;
  role?: string;
  location?: string;
  bio?: string;
  socials?: Partial<Record<keyof SocialFields, string>>;
}

export interface WorkStepErrors {
  brandStatement?: string;
  testimonials?: Array<{ quote?: string; author?: string; title?: string } | undefined>;
}

// ─── Validators ──────────────────────────────────────────────────────────────

type ProfileStepInput = {
  name: string;
  role: string;
  location: string;
  bio: string;
  socials: SocialFields;
};

export function validateProfileStep(data: ProfileStepInput): {
  valid: boolean;
  errors: ProfileStepErrors;
} {
  const result = profileStepSchema.safeParse(data);
  if (result.success) return { valid: true, errors: {} };

  const errors: ProfileStepErrors = {};
  for (const issue of result.error.issues) {
    const [top, sub] = issue.path as string[];
    if (top === 'socials' && sub) {
      errors.socials = errors.socials ?? {};
      (errors.socials as Record<string, string>)[sub] = issue.message;
    } else if (top) {
      (errors as Record<string, string>)[top] = issue.message;
    }
  }
  return { valid: false, errors };
}

export function validateWorkStep(data: Pick<WorkData, 'brandStatement' | 'testimonials'>): {
  valid: boolean;
  errors: WorkStepErrors;
} {
  const result = workStepSchema.safeParse(data);
  if (result.success) return { valid: true, errors: {} };

  const errors: WorkStepErrors = {};
  for (const issue of result.error.issues) {
    const [top, idx, field] = issue.path as [string, number, string];
    if (top === 'testimonials' && idx !== undefined && field) {
      errors.testimonials = errors.testimonials ?? [];
      errors.testimonials[idx] = errors.testimonials[idx] ?? {};
      (errors.testimonials[idx] as Record<string, string>)[field] = issue.message;
    } else if (top) {
      (errors as Record<string, string>)[top] = issue.message;
    }
  }
  return { valid: false, errors };
}
