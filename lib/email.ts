import { Resend } from 'resend';
import type { Profile } from '@/lib/data/profiles';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendGuestExchangeEmail(
  guestEmail: string,
  guestName: string,
  profile: Profile
): Promise<void> {
  const templateId = process.env.RESEND_EXCHANGE_TEMPLATE_ID;
  const fromAddress = process.env.EMAIL_FROM_ADDRESS;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';
  // const to = process.env.NODE_ENV === 'production' ? guestEmail : 'delivered+exchange@resend.dev';
  const to = guestEmail;
  if (!templateId || !fromAddress) return;

  const when = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  await resend.emails.send({
    from: fromAddress,
    to,
    subject: `${profile.full_name ?? 'Your contact'} on Blackbook`,
    template: {
      id: templateId,
      variables: {
        when,
        email: profile.social_links?.email ?? '',
        name: guestName,
        full_name: profile.full_name ?? '',
        role: profile.role ?? '',
        vcard_url: profile.username ? `${appUrl}/api/vcard/${profile.username}` : '',
        profile_url: profile.username ? `${appUrl}/p/${profile.username}` : '',
      },
    },
  });
}

export async function sendRequestReceivedEmail(email: string, firstName: string): Promise<void> {
  const templateId = process.env.RESEND_ACCESS_REQUEST_TEMPLATE_ID;
  const fromAddress = process.env.EMAIL_FROM_ADDRESS;
  const to = process.env.NODE_ENV === 'production' ? email : 'delivered+invite@resend.dev';
  if (!templateId || !fromAddress) return;

  await resend.emails.send({
    from: fromAddress,
    to: to,
    template: {
      id: templateId,
      variables: {
        first_name: firstName,
      },
    },
  });
}

export async function sendApprovalEmail(
  email: string,
  fullName: string,
  inviteCode: string
): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';
  const fromAddress = process.env.EMAIL_FROM_ADDRESS;
  const to = process.env.NODE_ENV === 'production' ? email : 'delivered+invite@resend.dev';
  const inviteUrl =
    `${appUrl}/signup?ref=${inviteCode}` +
    `&name=${encodeURIComponent(fullName)}` +
    `&email=${encodeURIComponent(email)}`;

  if (!fromAddress) return;

  await resend.emails.send({
    from: fromAddress,
    to: to,
    subject: "You're in — your Blackbook invite is ready",
    html: [
      '<div style="font-family:helvetica,sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;color:#0E0E0E;">',
      '<p style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:32px;">Blackbook</p>',
      `<h1 style="font-size:24px;font-weight:400;margin-bottom:16px;">You are approved, ${fullName}.</h1>`,
      '<p style="font-size:14px;line-height:1.6;color:#9A9691;margin-bottom:32px;">Your request to join Blackbook has been approved. Click below to create your account.</p>',
      `<a href="${inviteUrl}" style="display:inline-block;background:#0E0E0E;color:#F5F4F0;padding:14px 28px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;">Create account</a>`,
      '<p style="font-size:11px;color:#9A9691;margin-top:32px;">This invite is single-use and expires in 7 days.</p>',
      '</div>',
    ].join(''),
  });
}
