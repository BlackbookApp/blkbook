import { Resend } from 'resend';
import type { Profile } from '@/lib/data/profiles';

const resend = new Resend(process.env.RESEND_API_KEY);

function buildExchangeEmailHtml(vars: {
  when: string;
  email: string;
  full_name: string;
  role: string;
  vcard_url: string;
  profile_url: string;
}): string {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta content="width=device-width" name="viewport" />
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta content="IE=edge" http-equiv="X-UA-Compatible" />
    <meta content="telephone=no,address=no,email=no,date=no,url=no" name="format-detection" />
  </head>
  <body>
    <table border="0" width="100%" cellpadding="0" cellspacing="0" role="presentation" align="center">
      <tbody><tr><td>
        <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
          <tbody><tr><td>
            <div style="margin:0 auto;padding:0;max-width:560px;background:#faf9f7;border-radius:2px;overflow:hidden;border:0.5px solid #e4e0d8">
              <div style="margin:0;padding:52px 56px 0">
                <p style="margin:0 0 52px;padding:0;font-size:13px;letter-spacing:0.18em;color:#222;text-transform:uppercase;font-family:'GranjonRegular',Georgia,serif">BLKBOOK</p>
                <p style="margin:0;padding:0;font-size:11px;letter-spacing:0.06em;color:#aaa;font-family:'HelveticaNeueThin',Helvetica,Arial,sans-serif">${vars.when}</p>
              </div>
              <div style="margin:0;padding:36px 56px 0">
                <p style="margin:0 0 20px;padding:0;font-size:22px;color:#222;line-height:1.6;font-family:'GranjonItalic',Georgia,serif;font-style:italic"><em>It was a pleasure to meet you.</em></p>
                <p style="margin:0;padding:0;font-size:15px;color:#555;line-height:1.85;font-family:'GranjonRegular',Georgia,serif">As promised, my details are below. Let's stay in touch.</p>
              </div>
              <div style="margin:0;padding:36px 56px">
                <div style="margin:0;padding:0;border-left:1px solid #d8d4cc;padding-left:24px">
                  <div style="margin:0 0 18px">
                    <p style="margin:0 0 5px;padding:0;font-size:10px;letter-spacing:0.14em;color:#bbb;text-transform:uppercase;font-family:'HelveticaNeueThin',Helvetica,Arial,sans-serif">When</p>
                    <p style="margin:0;padding:0;font-size:15px;color:#333;font-family:'HelveticaNeueThin',Helvetica,Arial,sans-serif">${vars.when}</p>
                  </div>
                  <div style="margin:0 0 18px">
                    <p style="margin:0 0 5px;padding:0;font-size:10px;letter-spacing:0.14em;color:#bbb;text-transform:uppercase;font-family:'HelveticaNeueThin',Helvetica,Arial,sans-serif">Email</p>
                    <p style="margin:0;padding:0;font-size:15px;color:#333;font-family:'HelveticaNeueThin',Helvetica,Arial,sans-serif">${vars.email}</p>
                  </div>
                </div>
              </div>
              <div style="margin:0;padding:8px 56px 48px">
                <p style="margin:0 0 6px;padding:0;font-family:'GranjonRegular',Georgia,serif;font-size:28px;color:#222;letter-spacing:0.1em;text-transform:uppercase">${vars.full_name}</p>
                <p style="margin:0;padding:0;color:#aaa;font-family:'HelveticaNeueThin',Helvetica,Arial,sans-serif;font-size:13px">${vars.role}</p>
              </div>
              <div style="margin:0;padding:20px 56px 28px;border-top:0.5px solid #ede9e2">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                  <tbody><tr>
                    <td style="padding-right:16px">
                      <a href="${vars.vcard_url}" rel="noopener noreferrer" target="_blank" style="display:inline-block;padding:10px 22px;background:transparent;border:0.5px solid #ccc;border-radius:2px;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;color:#555;font-family:'HelveticaNeueThin',Helvetica,Arial,sans-serif">Save contact</a>
                    </td>
                    <td>
                      <a href="${vars.profile_url}" rel="noopener noreferrer" target="_blank" style="display:inline-block;padding:10px 22px;background:transparent;border:0.5px solid #ccc;border-radius:2px;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;color:#555;font-family:'HelveticaNeueThin',Helvetica,Arial,sans-serif">View profile</a>
                    </td>
                  </tr></tbody>
                </table>
              </div>
            </div>
          </td></tr></tbody>
        </table>
      </td></tr></tbody>
    </table>
  </body>
</html>`;
}

export async function sendGuestExchangeEmail(
  guestEmail: string,
  guestName: string,
  profile: Profile
): Promise<void> {
  const fromAddress = process.env.EMAIL_FROM_ADDRESS;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';
  const to = process.env.NODE_ENV === 'production' ? guestEmail : 'delivered+exchange@resend.dev';
  if (!fromAddress) return;

  const when = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const vars = {
    when,
    email: profile.social_links?.email ?? '',
    full_name: profile.full_name ?? '',
    role: profile.role ?? '',
    vcard_url: profile.username ? `${appUrl}/api/vcard/${profile.username}` : '',
    profile_url: profile.username ? `${appUrl}/p/${profile.username}` : '',
  };

  console.log('[exchange-email] to:', to, 'vars:', vars);

  const { data, error } = await resend.emails.send({
    from: fromAddress,
    to,
    subject: `${profile.full_name ?? 'Your contact'} on Blackbook`,
    html: buildExchangeEmailHtml(vars),
  });

  if (error) {
    console.error('[exchange-email] FAILED:', error);
    throw error;
  }

  console.log('[exchange-email] sent:', data?.id);
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
