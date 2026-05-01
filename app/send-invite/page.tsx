'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  AuthShell,
  AuthHeading,
  AuthField,
  PrimaryButton,
  QuietLink,
  authTokens,
} from '@/components/auth/AuthShell';
import { sendInviteEmailAction } from '@/app/actions/invitations';
import { useInvite, INVITE_TOTAL } from '@/hooks/use-invite';

export default function SendInvitePage() {
  const router = useRouter();
  const { invitesRemaining } = useInvite();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast({ title: 'Missing details', description: 'Please enter both a name and an email' });
      return;
    }
    if (invitesRemaining <= 0) {
      toast({
        title: 'No invitations remaining',
        description: 'You have used all your invitations.',
        variant: 'destructive',
      });
      return;
    }
    setIsSending(true);
    const result = await sendInviteEmailAction(name.trim(), email.trim(), note.trim() || undefined);
    setIsSending(false);
    if (result.error) {
      toast({ title: 'Could not send invite', description: result.error, variant: 'destructive' });
      return;
    }
    toast({ title: 'Invitation sent', description: `Your invite has been sent to ${name}` });
    router.push('/my-blackbook');
  };

  const headerLeft = (
    <button
      type="button"
      onClick={() => router.push('/my-blackbook')}
      aria-label="Back"
      className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
      style={{ background: authTokens.cream, border: `1px solid ${authTokens.hairline}` }}
    >
      <ChevronLeft className="w-4 h-4" strokeWidth={1.5} style={{ color: authTokens.ink }} />
    </button>
  );

  return (
    <AuthShell headerLeft={headerLeft} footerRight="Private invitation">
      <p
        className="uppercase mb-3 text-center"
        style={{
          fontFamily: authTokens.helvetica,
          fontSize: '10px',
          letterSpacing: '0.28em',
          color: authTokens.muted,
        }}
      >
        Your invitation
        {invitesRemaining < INVITE_TOTAL && (
          <span style={{ marginLeft: '0.5em', color: authTokens.hairline }}>
            · {invitesRemaining} remaining
          </span>
        )}
      </p>
      <AuthHeading
        title="Who are you inviting"
        italicWord="inviting"
        subtitle="This invitation comes from you personally. Choose someone you'd genuinely recommend."
      />

      <form onSubmit={handleSend} className="space-y-5">
        <AuthField
          id="invite-name"
          label="Name"
          value={name}
          onChange={setName}
          placeholder="Their full name"
          required
          autoComplete="name"
          isFocused={focusedField === 'name'}
          onFocus={() => setFocusedField('name')}
          onBlur={() => setFocusedField(null)}
        />
        <AuthField
          id="invite-email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="hello@theirdomain.com"
          required
          autoComplete="email"
          isFocused={focusedField === 'email'}
          onFocus={() => setFocusedField('email')}
          onBlur={() => setFocusedField(null)}
        />
        <AuthField
          id="invite-note"
          label="A short note"
          value={note}
          onChange={setNote}
          placeholder="Optional — a line or two on why."
          multiline
          isFocused={focusedField === 'note'}
          onFocus={() => setFocusedField('note')}
          onBlur={() => setFocusedField(null)}
          hint="Personal notes make invites land warmer."
        />
        <div className="pt-2">
          <PrimaryButton type="submit" disabled={isSending}>
            {isSending ? 'Sending…' : 'Send invitation'}
          </PrimaryButton>
          <div className="mt-3 text-center">
            <QuietLink onClick={() => router.push('/my-blackbook')}>Cancel</QuietLink>
          </div>
        </div>
      </form>
    </AuthShell>
  );
}
