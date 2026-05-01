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
    <meta name="x-apple-disable-message-reformatting" />
    <meta content="telephone=no,address=no,email=no,date=no,url=no" name="format-detection" />
  </head>
  <body>
    <table border="0" width="100%" cellpadding="0" cellspacing="0" role="presentation" align="center">
      <tbody>
        <tr>
          <td>
            <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
              <tbody>
                <tr>
                  <td>
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%">
                      <tbody>
                        <tr>
                          <td>
                            <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:0;margin-right:auto;margin-bottom:0;margin-left:auto;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0">
                              <tbody>
                                <tr>
                                  <td>
                                    <tr style="margin:0;padding:0">
                                      <td data-id="__react-email-column" style="margin:0;padding:0">
                                        <p style="margin:0;padding:0"><br /></p>
                                        <p style="margin:0;padding:0"><br /></p>
                                        <div style="margin:0 auto;padding:0;max-width:560px;background:#faf9f7;border-radius:2px;overflow:hidden;border:0.5px solid #e4e0d8">
                                          <div style="margin:0;padding:52px 56px 0">
                                            <p style="margin:0 0 52px;padding:0;font-size:13px;letter-spacing:0.18em;color:#222;text-transform:uppercase;font-family:&#x27;GranjonRegular&#x27;, Georgia, serif">HAIZEL</p>
                                            <p style="margin:0;padding:0;font-size:11px;letter-spacing:0.06em;color:#aaa;font-family:&#x27;HelveticaNeueThin&#x27;, Helvetica, Arial, sans-serif">${vars.when}</p>
                                          </div>
                                          <div style="margin:0;padding:36px 56px 0">
                                            <p style="margin:0 0 20px;padding:0;font-size:16px;color:#222;line-height:1.6;font-family:&#x27;GranjonItalic&#x27;, Georgia, serif;font-style:italic"><em>It was a pleasure to meet you.</em></p>
                                            <p style="margin:0;padding:0;font-size:15px;color:#555;line-height:1.85;font-family:&#x27;GranjonRegular&#x27;, Georgia, serif">As promised, my details are below. Let&#x27;s stay in touch.</p>
                                          </div>
                                          <div style="margin:0;padding:36px 56px">
                                            <div style="margin:0;padding:0;border-left:1px solid #d8d4cc;padding-left:24px;flex-direction:column;gap:18px">
                                              <div style="margin:0;padding:0">
                                                <p style="margin:0 0 5px;padding:0;font-size:10px;letter-spacing:0.14em;color:#bbb;text-transform:uppercase;font-family:&#x27;HelveticaNeueThin&#x27;, Helvetica, Arial, sans-serif">When</p>
                                                <p style="margin:0;padding:0;font-size:15px;color:#333;font-family:&#x27;HelveticaNeueThin&#x27;, Helvetica, Arial, sans-serif">${vars.when}</p>
                                              </div>
                                              <div style="margin:0;padding:0"><p style="margin:0;padding:0"><br /></p></div>
                                              <div style="margin:0;padding:0">
                                                <p style="margin:0 0 5px;padding:0;font-size:10px;letter-spacing:0.14em;color:#bbb;text-transform:uppercase;font-family:&#x27;HelveticaNeueThin&#x27;, Helvetica, Arial, sans-serif">Email</p>
                                                <p style="margin:0;padding:0;font-size:15px;color:#333;font-family:&#x27;HelveticaNeueThin&#x27;, Helvetica, Arial, sans-serif">${vars.email}</p>
                                              </div>
                                            </div>
                                          </div>
                                          <div style="margin:0;padding:8px 56px 48px">
                                            <p style="margin:0 0 6px;padding:0;font-family:&#x27;GranjonRegular&#x27;, Georgia, serif;font-size:20px;color:#222;letter-spacing:0.1em;text-transform:uppercase">${vars.full_name}</p>
                                            <p style="margin:0;padding:0"><span style="color:#aaaaaa">${vars.role}</span></p>
                                          </div>
                                          <div style="margin:0;padding:20px 56px 28px;border-top:0.5px solid #ede9e2;display:flex;gap:16px">
                                            <div style="margin:0;padding:0">
                                              <p style="margin:0;padding:0;margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;padding-top:0px;padding-right:16px;padding-bottom:0px;padding-left:0px">
                                                <span style="display:inline-block;padding-top:10px;padding-right:22px;padding-bottom:10px;padding-left:22px;background-color:transparent;border-top-width:0.5px;border-right-width:0.5px;border-bottom-width:0.5px;border-left-width:0.5px;border-top-style:solid;border-right-style:solid;border-bottom-style:solid;border-left-style:solid;border-top-color:rgb(204,204,204);border-right-color:rgb(204,204,204);border-bottom-color:rgb(204,204,204);border-left-color:rgb(204,204,204);border-top-left-radius:2px;border-top-right-radius:2px;border-bottom-right-radius:2px;border-bottom-left-radius:2px;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;font-family:HelveticaNeueThin, Helvetica, Arial, sans-serif;cursor:pointer"><a href="${vars.vcard_url}" rel="noopener noreferrer nofollow" style="color:#555555;text-decoration-line:none" target="_blank">Save contact</a></span>
                                              </p>
                                            </div>
                                            <div style="margin:0;padding:0">
                                              <p style="margin:0;padding:0">
                                                <a href="${vars.profile_url}" rel="noopener noreferrer nofollow" style="color:#555;text-decoration-line:none;display:inline-block;padding:10px 22px;background:transparent;border:0.5px solid #ccc;border-radius:2px;font-size:10px;letter-spacing:0.12em;text-decoration:none;text-transform:uppercase;font-family:&#x27;HelveticaNeueThin&#x27;, Helvetica, Arial, sans-serif;cursor:pointer" target="_blank">View profile</a>
                                              </p>
                                            </div>
                                          </div>
                                          <p style="margin:0;padding:0"><br /></p>
                                        </div>
                                      </td>
                                    </tr>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <p style="margin:0;padding:0"><br /></p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
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
    subject: `${profile.full_name ?? 'Your contact'} on Haizel`,
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

export async function sendInviteEmail(
  inviteeName: string,
  inviteeEmail: string,
  inviterName: string,
  inviteUrl: string,
  note?: string
): Promise<void> {
  const fromRaw = process.env.EMAIL_FROM_ADDRESS;
  if (!fromRaw) return;
  // Extract bare email from "Name <email>" or plain "email" formats
  const emailMatch = fromRaw.match(/<([^>]+)>/) ?? fromRaw.match(/(\S+@\S+)/);
  const fromAddress = emailMatch ? emailMatch[1] : fromRaw;
  const to = process.env.NODE_ENV === 'production' ? inviteeEmail : 'delivered+invite@resend.dev';

  const noteHtml = note
    ? `<div style="margin:0;padding:20px 56px 0"><p style="margin:0;padding:0;font-size:15px;color:#555;line-height:1.85;font-family:'GranjonItalic',Georgia,serif;font-style:italic">"${note}"</p></div>`
    : '';

  const html = [
    '<!DOCTYPE html>',
    '<html><head>',
    '<meta content="width=device-width" name="viewport"/>',
    '<meta content="text/html; charset=UTF-8" http-equiv="Content-Type"/>',
    '</head><body>',
    '<div style="margin:0 auto;padding:0;max-width:560px;background:#faf9f7;border-radius:2px;overflow:hidden;border:0.5px solid #e4e0d8">',
    '<div style="margin:0;padding:52px 56px 0">',
    '<p style="margin:0 0 52px;padding:0;font-size:13px;letter-spacing:0.18em;color:#222;text-transform:uppercase;font-family:\'GranjonRegular\',Georgia,serif">HAIZEL</p>',
    '</div>',
    '<div style="margin:0;padding:36px 56px 0">',
    `<p style="margin:0 0 12px;padding:0;font-size:16px;color:#222;line-height:1.6;font-family:'GranjonItalic',Georgia,serif;font-style:italic"><em>${inviterName} has invited you.</em></p>`,
    `<p style="margin:0;padding:0;font-size:15px;color:#555;line-height:1.85;font-family:'GranjonRegular',Georgia,serif">You have been personally invited to join Haizel — a private network for creative professionals.</p>`,
    '</div>',
    noteHtml,
    '<div style="margin:0;padding:36px 56px">',
    `<a href="${inviteUrl}" style="display:inline-block;background:#0E0E0E;color:#F5F4F0;padding:14px 28px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;font-family:'HelveticaNeueThin',Helvetica,Arial,sans-serif">Accept invitation</a>`,
    '</div>',
    '<div style="margin:0;padding:20px 56px 48px;border-top:0.5px solid #ede9e2">',
    '<p style="margin:0;padding:0;font-size:11px;color:#aaa;font-family:\'HelveticaNeueThin\',Helvetica,Arial,sans-serif">This invite is single-use and expires in 30 days.</p>',
    '</div>',
    '</div>',
    '</body></html>',
  ].join('');

  const { error } = await resend.emails.send({
    from: `${inviterName} via Haizel <${fromAddress}>`,
    to,
    subject: `${inviterName} invited you to Haizel`,
    html,
  });

  if (error) {
    console.error('[invite-email] FAILED:', error);
    throw error;
  }
}

export async function sendPasswordResetEmail(email: string, resetLink: string): Promise<void> {
  const fromAddress = process.env.EMAIL_FROM_ADDRESS;
  const to = process.env.NODE_ENV === 'production' ? email : 'delivered+reset@resend.dev';
  if (!fromAddress) return;

  const html = [
    '<div style="font-family:helvetica,sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;color:#0E0E0E;">',
    '<p style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:32px;">HAIZEL</p>',
    '<h1 style="font-size:24px;font-weight:400;margin-bottom:16px;">Reset your password.</h1>',
    '<p style="font-size:14px;line-height:1.6;color:#9A9691;margin-bottom:32px;">Click below to set a new password for your account. This link expires in 1 hour and can only be used once.</p>',
    `<a href="${resetLink}" style="display:inline-block;background:#0E0E0E;color:#F5F4F0;padding:14px 28px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;">Reset password</a>`,
    '<p style="font-size:11px;color:#9A9691;margin-top:32px;">If you did not request a password reset, you can safely ignore this email.</p>',
    '</div>',
  ].join('');

  const { error } = await resend.emails.send({
    from: fromAddress,
    to,
    subject: 'Reset your Haizel password',
    html,
  });

  if (error) {
    console.error('[reset-email] FAILED:', error);
    throw error;
  }
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
    subject: "You're in — your Haizel invite is ready",
    html: [
      '<div style="font-family:helvetica,sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;color:#0E0E0E;">',
      '<p style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:32px;">HAIZEL</p>',
      `<h1 style="font-size:24px;font-weight:400;margin-bottom:16px;">You are approved, ${fullName}.</h1>`,
      '<p style="font-size:14px;line-height:1.6;color:#9A9691;margin-bottom:32px;">Your request to join Haizel has been approved. Click below to create your account.</p>',
      `<a href="${inviteUrl}" style="display:inline-block;background:#0E0E0E;color:#F5F4F0;padding:14px 28px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;">Create account</a>`,
      '<p style="font-size:11px;color:#9A9691;margin-top:32px;">This invite is single-use and expires in 7 days.</p>',
      '</div>',
    ].join(''),
  });
}
