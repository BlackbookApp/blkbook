import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { routes } from '@/lib/routes';
import ResetPasswordForm from './ResetPasswordForm';

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(routes.forgotPassword);
  }

  return <ResetPasswordForm />;
}
