'use client';

import { useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { QRCodeCanvas } from 'qrcode.react';
import { Check, Copy, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Text } from './ui/text';
import { cn } from '@/lib/utils';

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
    <DialogPrimitive.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            {/* Overlay */}
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-black/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
            </DialogPrimitive.Overlay>

            {/* Content */}
            <DialogPrimitive.Content asChild forceMount>
              <motion.div
                className={cn(
                  'fixed left-1/2 top-1/2 z-50 w-full max-w-[300px]',
                  'border bg-background p-6 shadow-lg',
                  'focus:outline-none'
                )}
                initial={{ opacity: 0, y: 24, scale: 0.96, x: '-50%' }}
                animate={{ opacity: 1, y: '-50%', scale: 1, x: '-50%' }}
                exit={{ opacity: 0, y: 16, scale: 0.97, x: '-50%' }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Close button */}
                <DialogPrimitive.Close className="absolute right-4 top-4 opacity-70 hover:opacity-100 transition-opacity">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </DialogPrimitive.Close>

                {/* Title */}
                <DialogPrimitive.Title asChild>
                  <Text variant="h3" as="h3" className="mb-6">
                    Share your profile
                  </Text>
                </DialogPrimitive.Title>

                <div className="flex flex-col items-center gap-6">
                  {/* QR Code */}
                  <div className="p-4 border border-border">
                    <QRCodeCanvas
                      value={fullUrl}
                      size={160}
                      bgColor="transparent"
                      fgColor="currentColor"
                    />
                  </div>

                  {/* Display URL */}
                  <p className="blackbook-label text-bb-muted">{displayUrl}</p>

                  {/* Copy button */}
                  <Button variant="blackbook" className="w-full" onClick={handleCopy}>
                    <AnimatePresence mode="wait" initial={false}>
                      {copied ? (
                        <motion.span
                          key="copied"
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.18 }}
                        >
                          <Check className="w-4 h-4" /> Copied
                        </motion.span>
                      ) : (
                        <motion.span
                          key="copy"
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.18 }}
                        >
                          <Copy className="w-4 h-4" /> Copy Link
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
