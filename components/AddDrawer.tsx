'use client';

import { startTransition, useEffect, useState } from 'react';
import { Camera, PenLine, QrCode } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import AddContactDrawer from '@/components/AddContactDrawer';
import { routes } from '@/lib/routes';

interface AddDrawerProps {
  children: React.ReactNode;
}

const addOptions = [
  {
    id: 'scan-card',
    icon: Camera,
    label: 'Scan Card',
    description: 'Capture details with your camera',
  },
  {
    id: 'scan-qr',
    icon: QrCode,
    label: 'Scan QR Code',
    description: 'Scan a LinkedIn QR code',
  },
  {
    id: 'quick-add',
    icon: PenLine,
    label: 'Quick Add',
    description: 'Name, role, city, notes',
  },
];

const AddDrawer = ({ children }: AddDrawerProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [addContactOpen, setAddContactOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('openQuickAdd') === 'true') {
      const url = new URL(window.location.href);
      url.searchParams.delete('openQuickAdd');
      window.history.replaceState(null, '', url.toString());
      startTransition(() => {
        setAddContactOpen(true);
      });
    }
  }, []);

  const handleOptionClick = (option: (typeof addOptions)[0]) => {
    if (option.id === 'quick-add') {
      setOpen(false);
      setAddContactOpen(true);
    } else if (option.id === 'scan-qr') {
      setOpen(false);
      router.push(routes.scanQr);
    } else if (option.id === 'scan-card') {
      setOpen(false);
      router.push(routes.scanCard);
    }
  };

  return (
    <>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent
          className="border-none rounded-none max-h-[85vh] bg-white"
          aria-describedby={undefined}
        >
          <DrawerTitle className="sr-only">Add Connection</DrawerTitle>
          <div className="px-6 sm:px-8 pt-6 pb-8">
            <p className="font-helvetica text-[10px] uppercase tracking-[0.28em] text-center mb-3">
              Add connection
            </p>
            <h2 className="font-granjon text-[1.6rem] leading-[1.15] tracking-[-0.005em] text-bb-dark text-center mb-2 normal-case">
              How did you <em className="italic">meet</em>?
            </h2>
            <p className="font-helvetica text-[13.5px] leading-[1.65] text-center mb-7">
              Choose how you&apos;d like to save them to your vault.
            </p>

            <div className="h-px w-full bg-bb-rule" />

            <div>
              {addOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleOptionClick(option)}
                    className="group w-full flex items-center gap-4 py-[18px] text-left border-b border-bb-rule transition-opacity hover:opacity-70"
                  >
                    <div className="w-10 h-10 flex items-center justify-center shrink-0 rounded-[4px] border border-bb-rule">
                      <Icon className="w-[15px] h-[15px] text-bb-dark/60" strokeWidth={1.4} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-granjon text-[14px] uppercase tracking-[0.04em] text-bb-dark leading-tight mb-1">
                        {option.label}
                      </p>
                      <p className="font-helvetica text-[13.5px] leading-[1.65] normal-case ">
                        {option.description}
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
              })}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <AddContactDrawer open={addContactOpen} onOpenChange={setAddContactOpen} />
    </>
  );
};

export default AddDrawer;
