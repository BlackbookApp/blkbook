'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getInviteByCode, markInviteUsed } from '@/lib/data/invitations';
import { createProfile } from '@/lib/data/profiles';
import { routes } from '@/lib/routes';

const signUpSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  invite_code: z.string().min(1, 'Invite code is required'),
});

export type SignUpActionResult = { success: true } | { error: string };

export async function signUpAction(formData: FormData): Promise<SignUpActionResult> {
  const parsed = signUpSchema.safeParse({
    full_name: formData.get('full_name'),
    email: formData.get('email'),
    password: formData.get('password'),
    invite_code: formData.get('invite_code'),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { full_name, email, password, invite_code } = parsed.data;

  const invite = await getInviteByCode(invite_code);
  if (!invite) {
    return { error: 'Invalid or expired invite code' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name, invite_code },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) return { error: error.message };
  if (!data.user) return { error: 'Signup failed' };

  await createProfile(data.user.id, full_name, invite.inviter_id);
  await markInviteUsed(invite_code, data.user.id);

  return { success: true };
}

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginActionResult = { success: true } | { error: string };

export async function loginAction(formData: FormData): Promise<LoginActionResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { email, password } = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };

  return { success: true };
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(routes.login);
}
