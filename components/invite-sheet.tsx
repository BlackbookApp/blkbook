'use client';

import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Copy, Share2, Check, UserPlus } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useInvite } from '@/hooks/use-invite';

interface InviteSheetProps {
  children: React.ReactNode;
}

export function InviteSheet({ children }: InviteSheetProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const {
    invitesRemaining,
    inviteUrl,
    generatedCode,
    isPending,
    handleGenerate,
    handleShare,
    reset,
  } = useInvite();

  const handleCopy = async () => {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) reset();
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom" className="bb-drawer-panel rounded-t-xl pb-10">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-display font-light text-[15px] uppercase tracking-tight text-center">
            Invite to Haizel
          </SheetTitle>
        </SheetHeader>

        <div className="max-w-[300px] mx-auto space-y-6">
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
