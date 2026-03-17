'use client';

import { useState, useRef } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { QRCodeCanvas } from 'qrcode.react';
import { MessageSquare, Mail, Share2, Download, X, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/use-profile';
import { useInvite, INVITE_TOTAL } from '@/hooks/use-invite';
import Logo from '@/components/Logo';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? '';

interface ShareProfileModalProps {
  open: boolean;
  onClose: () => void;
  username: string;
}

export function ShareProfileModal({ open, onClose, username }: ShareProfileModalProps) {
  const { data: profile } = useProfile();
  const {
    invitesUsed,
    invitesRemaining,
    inviteUrl,
    isPending,
    handleGenerate,
    handleCopy,
    handleShare,
  } = useInvite();
  const qrRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fullUrl = `${APP_URL}/p/${username}`;
  const profileName = profile?.full_name ?? username;
  const subtitle = [profile?.role, profile?.location].filter(Boolean).join(' · ');

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      toast({ title: 'Link copied' });
    } catch {
      toast({ title: 'Copy failed', variant: 'destructive' });
    }
  };

  const handleSendSMS = () => {
    window.location.href = `sms:?body=${encodeURIComponent(`Connect with me on Blackbook: ${fullUrl}`)}`;
  };

  const handleSendEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent("Let's connect on Blackbook")}&body=${encodeURIComponent(`Here's my Blackbook profile: ${fullUrl}`)}`;
  };

  const handleShareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: profileName,
          text: 'Check out my Blackbook profile',
          url: fullUrl,
        });
      } catch {
        /* user cancelled */
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `${username}-blackbook-qr.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast({ title: 'QR downloaded' });
    }
  };

  const shareActions = [
    { icon: MessageSquare, label: 'Share via SMS', action: handleSendSMS },
    { icon: Mail, label: 'Share via Email', action: handleSendEmail },
    { icon: Share2, label: 'Share your profile', action: handleShareProfile },
  ];

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-black/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-background overflow-y-auto focus:outline-none"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <DialogPrimitive.Title className="sr-only">
                  Share your profile
                </DialogPrimitive.Title>

                <div className="blackbook-page !py-6 pb-28">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <Logo />
                    <DialogPrimitive.Close className="p-2 hover:bg-secondary rounded-full transition-colors">
                      <X className="w-5 h-5" />
                    </DialogPrimitive.Close>
                  </div>

                  {/* Profile info */}
                  <div className="flex flex-col items-center mt-14 mb-8">
                    <motion.h1
                      className="font-granjon text-xl font-normal uppercase text-center text-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6 }}
                    >
                      {profileName}
                    </motion.h1>
                    {subtitle && (
                      <motion.p
                        className="blackbook-label text-bb-muted mt-2 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                      >
                        {subtitle}
                      </motion.p>
                    )}
                  </div>

                  {/* QR code */}
                  <motion.div
                    ref={qrRef}
                    className="flex justify-center mb-10 cursor-pointer"
                    onClick={() => setIsFullscreen(true)}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                  >
                    <div className="border border-border p-6">
                      <QRCodeCanvas
                        value={fullUrl}
                        size={200}
                        level="H"
                        marginSize={0}
                        bgColor="#ffffff"
                        fgColor="#000000"
                      />
                    </div>
                  </motion.div>

                  {/* Share actions */}
                  <motion.div
                    className="border border-border overflow-hidden mx-2 mb-10"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                  >
                    {shareActions.map((item) => (
                      <button
                        key={item.label}
                        onClick={item.action}
                        className="w-full flex items-center justify-center gap-3 py-4 border-b border-border hover:bg-secondary/50 active:scale-[0.99] transition-all"
                      >
                        <item.icon className="w-5 h-5 text-foreground" />
                        <span className="blackbook-label text-foreground">{item.label}</span>
                      </button>
                    ))}
                    <button
                      onClick={handleDownloadQR}
                      className="w-full flex items-center justify-center gap-3 py-4 hover:bg-secondary/50 active:scale-[0.99] transition-all"
                    >
                      <Download className="w-5 h-5 text-foreground" />
                      <span className="blackbook-label text-foreground">Download QR Code</span>
                    </button>
                  </motion.div>

                  {/* Invite section */}
                  <motion.div
                    className="border border-border p-5 mx-2 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.35 }}
                  >
                    <p className="blackbook-label text-muted-foreground mb-3">Invitations</p>
                    <div className="h-px bg-border mb-3" />
                    <h2 className="font-granjon text-[13px] text-foreground mb-1">
                      An invitation, from you.
                    </h2>
                    <p className="blackbook-label text-muted-foreground leading-relaxed mb-4">
                      Any person you invite will be granted automatic access into Blackbook.
                    </p>
                    <div className="mb-4">
                      <div className="h-[2px] bg-secondary overflow-hidden">
                        <motion.div
                          className="h-full bg-foreground"
                          initial={{ width: 0 }}
                          animate={{ width: `${(invitesUsed / INVITE_TOTAL) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.4 }}
                        />
                      </div>
                      <p className="blackbook-label mt-1 text-right text-muted-foreground">
                        {invitesUsed}/{INVITE_TOTAL}
                      </p>
                    </div>
                    {inviteUrl ? (
                      <div className="flex flex-col gap-2">
                        <div className="border border-border px-3 py-2 flex items-center gap-2">
                          <span className="blackbook-label text-muted-foreground truncate flex-1">
                            {inviteUrl}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleCopy}
                            className="bb-btn-primary flex items-center justify-center gap-2"
                          >
                            <Copy className="w-4 h-4" />
                            Copy Link
                          </button>
                          <button
                            onClick={handleShare}
                            className="bb-btn-primary flex items-center justify-center gap-2"
                          >
                            <Share2 className="w-4 h-4" />
                            Share
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={handleGenerate}
                        disabled={isPending || invitesRemaining === 0}
                        className="bb-btn-primary mt-1 disabled:opacity-50"
                      >
                        {isPending
                          ? 'Generating…'
                          : invitesRemaining === 0
                            ? 'No invites remaining'
                            : 'Generate Invite Link'}
                      </button>
                    )}
                  </motion.div>
                </div>

                {/* Fullscreen QR overlay */}
                <AnimatePresence>
                  {isFullscreen && (
                    <motion.div
                      className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsFullscreen(false)}
                    >
                      <QRCodeCanvas
                        value={fullUrl}
                        size={280}
                        level="H"
                        marginSize={0}
                        bgColor="#ffffff"
                        fgColor="#000000"
                      />
                      <p className="blackbook-label mt-8 tracking-widest uppercase text-muted-foreground">
                        {profileName}
                      </p>
                      <p className="text-[10px] mt-2 text-muted-foreground/50">
                        Tap anywhere to close
                      </p>
                      <button
                        className="absolute top-6 right-6 p-3 hover:bg-secondary rounded-full transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsFullscreen(false);
                        }}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
