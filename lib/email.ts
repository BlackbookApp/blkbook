import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendApprovalEmail(
  email: string,
  fullName: string,
  inviteCode: string
): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';
  const inviteUrl =
    `${appUrl}/signup?ref=${inviteCode}` +
    `&name=${encodeURIComponent(fullName)}` +
    `&email=${encodeURIComponent(email)}`;

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'delivered+invite@resend.dev',
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
