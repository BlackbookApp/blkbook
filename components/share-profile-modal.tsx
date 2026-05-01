'use client';

import { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { MessageSquare, Link2, Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/use-profile';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '');

interface ShareProfileModalProps {
  open: boolean;
  onClose: () => void;
  username: string;
}

export function ShareProfileModal({ open, onClose, username }: ShareProfileModalProps) {
  const { data: profile } = useProfile();
  const qrRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fullUrl = `${APP_URL}/p/${username}`;
  const profileName = profile?.full_name ?? username;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      toast({ title: 'Link copied' });
    } catch {
      toast({ title: 'Copy failed', variant: 'destructive' });
    }
  };

  const handleSendSMS = () => {
    window.location.href = `sms:?body=${encodeURIComponent(`Connect with me on Haizel: ${fullUrl}`)}`;
  };

  const handleDownloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `${username}-haizel-qr.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast({ title: 'QR downloaded' });
    }
  };

  const shareActions = [
    {
      icon: MessageSquare,
      label: 'Send via SMS',
      description: 'Text the link from your phone',
      action: handleSendSMS,
    },
    {
      icon: Link2,
      label: 'Copy link',
      description: 'Paste anywhere you like',
      action: handleCopyLink,
    },
    {
      icon: Download,
      label: 'Download QR code',
      description: 'Save the image to your device',
      action: handleDownloadQR,
    },
  ];

  return (
    <Drawer open={open} onOpenChange={(next) => !next && onClose()}>
      <DrawerContent
        className="border-none rounded-none max-h-[90vh] bg-white"
        aria-describedby={undefined}
      >
        <DrawerTitle className="sr-only">Share your profile</DrawerTitle>

        <AnimatePresence>
          {isFullscreen && (
            <motion.div
              className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsFullscreen(false);
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFullscreen(false);
                }}
              >
                <div className="p-6 bg-white border border-bb-rule rounded-[6px]">
                  <QRCodeCanvas
                    value={fullUrl}
                    size={280}
                    level="H"
                    marginSize={0}
                    bgColor="#ffffff"
                    fgColor="#0e0e0d"
                  />
                </div>
                <p className="font-helvetica text-[11px] uppercase tracking-[0.22em] text-bb-dark mt-8">
                  {profileName}
                </p>
                <p className="font-granjon italic text-[13px] text-bb-muted mt-2">
                  Tap anywhere to close
                </p>
              </motion.div>
              <button
                className="absolute top-6 right-6 w-9 h-9 rounded-full flex items-center justify-center bg-white border border-bb-rule hover:opacity-70 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFullscreen(false);
                }}
                aria-label="Close"
              >
                <X className="w-4 h-4 text-bb-dark/60" strokeWidth={1.5} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="px-6 sm:px-8 pt-6 pb-8 overflow-y-auto">
          {/* Close button */}
          <div className="flex justify-end absolute top-4 right-2">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-bb-dark/60" strokeWidth={1.5} />
            </button>
          </div>

          {/* Profile section */}
          <div className="text-center mb-7">
            <p className="font-helvetica text-[10px] uppercase tracking-[0.28em] mb-3">
              Share profile
            </p>
            <h2 className="font-granjon normal-case text-[1.6rem] leading-[1.15] tracking-[-0.005em] text-bb-dark mb-2">
              Share your <em className="italic">Haizel</em> profile
            </h2>
            <p className="font-helvetica text-[13.5px] leading-[1.65] ">
              Let them scan, save, or open your profile in seconds.
            </p>
          </div>

          {/* QR code */}
          <div
            ref={qrRef}
            className="flex flex-col items-center mb-7 cursor-pointer group"
            onClick={() => setIsFullscreen(true)}
          >
            <div className="p-5 bg-white border border-bb-rule rounded-[6px] transition-transform group-hover:scale-[1.02]">
              <QRCodeCanvas
                value={fullUrl}
                size={150}
                level="H"
                marginSize={0}
                bgColor="#ffffff"
                fgColor="#0e0e0d"
              />
            </div>
            <p className="font-granjon italic text-[13px] text-bb-muted mt-3">Tap to expand</p>
          </div>

          {/* Share actions */}
          <div className="h-px w-full bg-bb-rule" />
          <div>
            {
              // eslint-disable-next-line react-hooks/refs
              shareActions.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className="group w-full flex items-center gap-4 py-[18px] text-left border-b border-bb-rule transition-opacity hover:opacity-70"
                  >
                    <div className="w-10 h-10 flex items-center justify-center shrink-0 rounded-[4px] border border-bb-rule">
                      <Icon className="w-[15px] h-[15px] text-bb-dark/60" strokeWidth={1.4} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-granjon text-[14px] uppercase tracking-[0.04em] text-bb-dark leading-tight mb-1">
                        {item.label}
                      </p>
                      <p className="font-helvetica text-[13.5px] tracking-normal normal-case ">
                        {item.description}
                      </p>
                    </div>
                    <span
                      aria-hidden
                      className="font-helvetica text-[14px] text-bb-dark/60 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </button>
                );
              })
            }
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
