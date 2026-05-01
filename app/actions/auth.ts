'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { adminClient } from '@/lib/supabase/admin';
import { getInviteByCode, markInviteUsed } from '@/lib/data/invitations';
import { createProfile } from '@/lib/data/profiles';
import { sendPasswordResetEmail } from '@/lib/email';
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

export type UpdatePasswordActionResult = { success: true } | { error: string };

export async function updatePasswordAction(
  newPassword: string
): Promise<UpdatePasswordActionResult> {
  if (newPassword.length < 8) {
    return { error: 'Password must be at least 8 characters' };
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { error: error.message };
  return { success: true };
}

export type ForgotPasswordActionResult = { error: string | null };

export async function forgotPasswordAction(email: string): Promise<ForgotPasswordActionResult> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';

  const { data, error } = await adminClient.auth.admin.generateLink({
    type: 'recovery',
    email,
  });

  if (!error && data?.properties?.hashed_token) {
    const resetUrl = `${appUrl}/auth/callback?token_hash=${data.properties.hashed_token}&type=recovery`;
    try {
      await sendPasswordResetEmail(email, resetUrl);
    } catch {
      // Swallow — don't expose send failures
    }
  }

  // Always return success to prevent email enumeration
  return { error: null };
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(routes.login);
}
