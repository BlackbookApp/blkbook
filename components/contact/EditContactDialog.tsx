import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { VaultContact, VaultContactInsert } from '@/lib/data/vault-contacts';

type EditFields = Pick<VaultContactInsert, 'name' | 'role' | 'email' | 'phone' | 'instagram'>;

const FIELDS: { key: keyof EditFields; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'instagram', label: 'Instagram' },
];

interface EditContactDialogProps {
  contact: VaultContact;
  open: boolean;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (fields: EditFields) => void;
}

export function EditContactDialog({
  contact,
  open,
  isPending,
  onOpenChange,
  onSave,
}: EditContactDialogProps) {
  const [form, setForm] = useState<EditFields>({
    name: contact.name ?? '',
    role: contact.role ?? '',
    email: contact.email ?? '',
    phone: contact.phone ?? '',
    instagram: contact.instagram ?? '',
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-border">
        <DialogHeader>
          <DialogTitle className="font-garamond font-normal text-lg tracking-tight uppercase">
            Edit Contact
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {FIELDS.map(({ key, label }) => (
            <div key={key}>
              <label className="font-helvetica text-[10px] font-normal uppercase tracking-[0.12em] mb-2 block text-bb-muted">
                {label}
              </label>
              <Input
                value={form[key] ?? ''}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="font-garamond italic text-[14px] bg-transparent border-border"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 py-3 font-helvetica text-[11px] font-normal uppercase tracking-[0.1em] border border-border text-bb-dark bg-transparent transition-opacity hover:opacity-70"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={isPending}
            className="flex-1 py-3 font-helvetica text-[11px] font-normal uppercase tracking-[0.1em] bg-bb-dark text-white transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
