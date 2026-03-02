'use client';

import { useRouter } from 'next/navigation';
import { Camera, QrCode, PenLine, Users } from 'lucide-react';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';

interface AddDrawerProps {
  children: React.ReactNode;
}

const addOptions = [
  {
    id: 'scan-card',
    icon: Camera,
    label: 'Scan Card',
    description: 'Capture details with your camera',
    path: '/scan-card',
  },
  {
    id: 'scan-qr',
    icon: QrCode,
    label: 'Scan QR',
    description: 'Scan a Blackbook QR code',
    path: '/scan-qr',
  },
  {
    id: 'quick-add',
    icon: PenLine,
    label: 'Quick Add',
    description: 'Name, role, city, notes',
    path: '/quick-add',
  },
  {
    id: 'import-contacts',
    icon: Users,
    label: 'Import from Contacts',
    description: 'Choose from your device',
    path: null,
  },
];

const AddDrawer = ({ children }: AddDrawerProps) => {
  const router = useRouter();

  const handleOptionClick = (option: (typeof addOptions)[0]) => {
    if (option.path) {
      router.push(option.path);
    }
    // For options without paths, we'd implement the functionality later
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent
        className="border-none rounded-none max-h-[85vh] backdrop-blur-[20px]"
        style={{ background: 'rgba(255, 255, 255, 0.92)' }}
      >
        <div className="px-6 pt-2 pb-6">
          {/* Header */}
          <p
            className="text-center mb-4 text-[11px] uppercase tracking-[0.12em] font-normal"
            style={{ fontFamily: "'Helvetica Neue', 'Helvetica', sans-serif" }}
          >
            Add Connection
          </p>

          {/* Options List */}
          <div className="space-y-0">
            {addOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <div key={option.id}>
                  {index > 0 && <div className="h-px bg-border/50" />}
                  <button
                    onClick={() => handleOptionClick(option)}
                    className="w-full flex items-center gap-4 py-3 group text-left"
                  >
                    <div className="w-7 h-7 flex items-center justify-center">
                      <Icon
                        className="w-[16px] h-[16px] text-foreground/70 group-hover:text-foreground transition-colors"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-[11px] uppercase tracking-[0.12em] font-normal group-hover:opacity-70 transition-opacity"
                        style={{ fontFamily: "'Helvetica Neue', 'Helvetica', sans-serif" }}
                      >
                        {option.label}
                      </h3>
                      <p
                        className="text-[10px] font-light"
                        style={{
                          fontFamily: "'Helvetica Neue', 'Helvetica', sans-serif",
                          color: '#9A9691',
                        }}
                      >
                        {option.description}
                      </p>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AddDrawer;
