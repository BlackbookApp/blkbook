import { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { MessageSquare, Link2, Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from '@/components/ui/drawer';
import { useToast } from '@/hooks/use-toast';

interface ShareDrawerProps {
  profileUrl: string;
  profileName: string;
  children: React.ReactNode;
}

const ShareDrawer = ({ profileUrl, profileName, children }: ShareDrawerProps) => {
  const { toast } = useToast();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast({
        title: 'Link copied',
        description: 'Ready to share',
      });
    } catch {
      toast({
        title: 'Copy failed',
        description: 'Please copy manually',
        variant: 'destructive',
      });
    }
  };

  const handleSendSMS = () => {
    const message = encodeURIComponent(`Connect with me: ${profileUrl}`);
    window.location.href = `sms:?body=${message}`;
  };

  const handleDownloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `${profileName.toLowerCase().replace(/\s+/g, '-')}-blackbook-qr.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast({
        title: 'QR downloaded',
        description: 'Saved to your device',
      });
    }
  };

  return (
    <>
      <Drawer>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent className="bg-background border-border">
          <div className="px-6 pb-8 pt-2">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-[10px] tracking-widest uppercase text-muted-foreground">
                Share your Blackbook
              </p>
              <DrawerClose className="p-1 hover:bg-secondary rounded-full transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </DrawerClose>
            </div>

            {/* QR Code */}
            <div
              ref={qrRef}
              className="flex flex-col items-center mb-8 cursor-pointer group"
              onClick={() => setIsFullscreen(true)}
            >
              <div className="p-6 bg-white rounded-2xl border border-border/50 transition-transform group-hover:scale-[1.02]">
                <QRCodeCanvas
                  value={profileUrl}
                  size={160}
                  level="H"
                  marginSize={0}
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>
              <p className="text-[10px] text-muted-foreground/60 mt-4 tracking-wide">
                Scan to view my Blackbook
              </p>
              <p className="text-[9px] text-muted-foreground/40 mt-1">Tap to expand</p>
            </div>

            {/* Share Options */}
            <div className="space-y-1">
              <button
                onClick={handleSendSMS}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-secondary/50 transition-colors group"
              >
                <MessageSquare className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="text-sm tracking-wide">Send via SMS</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-secondary/50 transition-colors group"
              >
                <Link2 className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="text-sm tracking-wide">Copy Link</span>
              </button>
              <button
                onClick={handleDownloadQR}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-secondary/50 transition-colors group"
              >
                <Download className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="text-sm tracking-wide">Download QR Code</span>
              </button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Fullscreen QR Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsFullscreen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center"
            >
              <QRCodeCanvas
                value={profileUrl}
                size={280}
                level="H"
                marginSize={0}
                bgColor="#ffffff"
                fgColor="#000000"
              />
              <p className="text-xs text-muted-foreground mt-8 tracking-widest uppercase">
                {profileName}
              </p>
              <p className="text-[10px] text-muted-foreground/50 mt-2">Tap anywhere to close</p>
            </motion.div>

            <button
              className="absolute top-6 right-6 p-3 hover:bg-secondary rounded-full transition-colors"
              onClick={() => setIsFullscreen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ShareDrawer;
