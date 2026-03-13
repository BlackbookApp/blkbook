'use client';

import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Check, Copy } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Text } from './ui/text';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? '';

interface ShareProfileModalProps {
  open: boolean;
  onClose: () => void;
  username: string;
}

export function ShareProfileModal({ open, onClose, username }: ShareProfileModalProps) {
  const [copied, setCopied] = useState(false);

  const fullUrl = `${APP_URL}/p/${username}`;
  const displayUrl = fullUrl;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast({ title: 'Link copied' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: 'Copy failed', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-[300px]">
        <DialogHeader>
          <DialogTitle className="">
            <Text variant="h3" as="h3">
              Share your profile
            </Text>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-2">
          {/* QR Code */}
          <div className="p-4 border border-border">
            <QRCodeCanvas value={fullUrl} size={160} bgColor="transparent" fgColor="currentColor" />
          </div>

          {/* Display URL */}
          <p className="blackbook-label text-bb-muted">{displayUrl}</p>

          {/* Copy button */}
          <Button variant="blackbook" className="w-full" onClick={handleCopy}>
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? 'Copied' : 'Copy Link'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
