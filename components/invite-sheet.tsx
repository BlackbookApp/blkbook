'use client';

import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Copy, Share2, Check, UserPlus } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCreateInvite } from '@/hooks/use-invitations';
import { useProfile } from '@/hooks/use-profile';
import { toast } from '@/hooks/use-toast';

interface InviteSheetProps {
  children: React.ReactNode;
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? '';

export function InviteSheet({ children }: InviteSheetProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const { data: profile } = useProfile();
  const { mutate: createInvite, isPending } = useCreateInvite();

  const inviteUrl = generatedCode ? `${APP_URL}/invite?ref=${generatedCode}` : null;

  const handleGenerate = () => {
    createInvite(undefined, {
      onSuccess: (result) => {
        if ('error' in result) {
          toast({ title: 'Error', description: result.error, variant: 'destructive' });
        } else {
          setGeneratedCode(result.code);
        }
      },
    });
  };

  const handleCopy = async () => {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: 'Copied', description: 'Invite link copied to clipboard' });
  };

  const handleShare = async () => {
    if (!inviteUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on Blackbook',
          text: "You've been invited to Blackbook — a private network for creative professionals.",
          url: inviteUrl,
        });
      } catch {
        // user cancelled
      }
    } else {
      await handleCopy();
    }
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setGeneratedCode(null);
  };

  const invitesRemaining = profile?.invites_remaining ?? 0;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom" className="bb-drawer-panel rounded-t-xl pb-10">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-display font-light text-[15px] uppercase tracking-tight text-center">
            Invite to Blackbook
          </SheetTitle>
        </SheetHeader>

        <div className="max-w-[300px] mx-auto space-y-6">
          <p className="blackbook-label text-center leading-relaxed">
            Share a golden ticket. Your guest joins directly — no queue.
          </p>

          <p className="blackbook-label text-center">
            <span className="text-bb-dark font-medium">{invitesRemaining}</span>
            <span className="text-bb-muted"> invitations remaining</span>
          </p>

          {!generatedCode ? (
            <Button
              variant="blackbook"
              className="w-full"
              onClick={handleGenerate}
              disabled={isPending || invitesRemaining <= 0}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {isPending ? 'Generating…' : 'Generate Invite Link'}
            </Button>
          ) : (
            <div className="space-y-5">
              {/* QR Code */}
              <div className="flex justify-center p-4 bg-bb-cream">
                <QRCodeCanvas value={inviteUrl!} size={160} bgColor="#F5F4F0" fgColor="#0E0E0E" />
              </div>

              {/* URL display */}
              <div className="border border-border px-4 py-3">
                <p className="blackbook-label truncate text-center">{inviteUrl}</p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button variant="blackbook" className="w-full" onClick={handleCopy}>
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? 'Copied' : 'Copy Link'}
                </Button>
                <Button variant="blackbook-secondary" className="w-full" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>

              <p className="text-[9px] text-bb-muted text-center tracking-wide">
                This invitation is personal and non-transferable. Expires in 30 days.
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
