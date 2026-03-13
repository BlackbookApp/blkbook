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
          className="border-none rounded-none max-h-[85vh] backdrop-blur-[20px] bb-drawer-panel"
          aria-describedby={undefined}
        >
          <DrawerTitle className="sr-only">Add Connection</DrawerTitle>
          <div className="px-6 pt-2 pb-6">
            <Text variant="label" align="center" className="mb-4">
              Add Connection
            </Text>

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
                      <div className="flex gap-2 flex-1 min-w-0">
                        <Text variant="label" className="group-hover:opacity-70 transition-opacity">
                          {option.label}
                        </Text>
                        <Text variant="label-micro" color="muted" className="font-light">
                          {option.description}
                        </Text>
                      </div>
                    </button>
                  </div>
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
