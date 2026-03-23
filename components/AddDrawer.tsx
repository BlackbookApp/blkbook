'use client';

import { useState } from 'react';
import { PenLine } from 'lucide-react';
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Text } from '@/components/ui/text';
import AddContactDrawer from '@/components/AddContactDrawer';

interface AddDrawerProps {
  children: React.ReactNode;
}

const addOptions = [
  // {
  //   id: 'scan-card',
  //   icon: Camera,
  //   label: 'Scan Card',
  //   description: 'Capture details with your camera',
  // },
  // {
  //   id: 'scan-qr',
  //   icon: QrCode,
  //   label: 'Scan QR',
  //   description: 'Scan a Blackbook QR code',
  // },
  {
    id: 'quick-add',
    icon: PenLine,
    label: 'Quick Add',
    description: 'Name, role, city, notes',
  },
  // {
  //   id: 'import-contacts',
  //   icon: Users,
  //   label: 'Import from Contacts',
  //   description: 'Choose from your device',
  // },
];

const AddDrawer = ({ children }: AddDrawerProps) => {
  const [open, setOpen] = useState(false);
  const [addContactOpen, setAddContactOpen] = useState(false);

  const handleOptionClick = (option: (typeof addOptions)[0]) => {
    if (option.id === 'quick-add') {
      setOpen(false);
      setAddContactOpen(true);
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
          <div className="px-6 pt-4 pb-8">
            <div className="flex items-center gap-3 mb-6">
              <Text variant="label" className="shrink-0">
                Add Connection
              </Text>
              <div className="flex-1 h-px bg-border/50" />
            </div>

            <div>
              {addOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleOptionClick(option)}
                    className="w-full flex items-center gap-4 py-4 group text-left border-b border-border/30 last:border-b-0"
                  >
                    <div className="w-11 h-11 flex items-center justify-center shrink-0 rounded-full border border-border/60">
                      <Icon
                        className="w-[16px] h-[16px] text-bb-dark/70 group-hover:text-bb-dark transition-colors"
                        strokeWidth={1.4}
                      />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-granjon text-[13px] text-bb-dark leading-tight mb-0.5 group-hover:opacity-60 transition-opacity">
                        {option.label}
                      </span>
                      <span className="font-helvetica text-[10px] font-light text-bb-muted">
                        {option.description}
                      </span>
                    </div>
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
