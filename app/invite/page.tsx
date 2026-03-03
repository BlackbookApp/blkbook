import { getInviteByCode } from '@/lib/data/invitations';
import InviteClient from './invite-client';

interface Props {
  searchParams: Promise<{ ref?: string }>;
}

const InvitationPage = async ({ searchParams }: Props) => {
  const { ref } = await searchParams;

  let inviterName: string | null = null;
  let validCode = false;

  if (ref) {
    const invite = await getInviteByCode(ref);
    if (invite) {
      validCode = true;
      inviterName = invite.profiles?.full_name ?? null;
    }
  }

  return <InviteClient inviteCode={validCode ? ref! : null} inviterName={inviterName} />;
};

export default InvitationPage;
