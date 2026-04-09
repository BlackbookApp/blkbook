'use client';

import { startTransition, useEffect, useState } from 'react';
import { z } from 'zod';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { useCreateVaultContact } from '@/hooks/use-vault-contacts';
import { toast } from '@/hooks/use-toast';
import type { LinkedInPrefill } from '@/app/actions/linkedin';
import type { BusinessCardPrefill } from '@/app/actions/scan-business-card';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().optional(),
  city: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  instagram: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface AddContactDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefillData?: LinkedInPrefill | null;
}

const AddContactDrawer = ({ open, onOpenChange, prefillData }: AddContactDrawerProps) => {
  const [form, setForm] = useState<FormData>({
    name: prefillData?.name ?? '',
    role: prefillData?.role ?? '',
    city: prefillData?.city ?? '',
    email: prefillData?.email ?? '',
    phone: '',
    instagram: '',
    notes: prefillData?.notes ?? '',
  });
  const [cardPrefill, setCardPrefill] = useState<BusinessCardPrefill | null>(null);
  const [nameError, setNameError] = useState('');
  const { mutate: createContact, isPending } = useCreateVaultContact();

  useEffect(() => {
    if (!open) return;
    const raw = localStorage.getItem('businessCardPrefill');
    if (!raw) return;
    localStorage.removeItem('businessCardPrefill');

    let parsed: BusinessCardPrefill;
    try {
      parsed = JSON.parse(raw) as BusinessCardPrefill;
    } catch {
      return;
    }

    startTransition(() => {
      setCardPrefill(parsed);
      setForm({
        name: parsed.name ?? '',
        role: parsed.role ?? '',
        city: parsed.city ?? '',
        email: parsed.email ?? '',
        phone: parsed.phone ?? '',
        instagram: '',
        notes: '',
      });
    });

    const coreFieldsPresent =
      parsed.name && parsed.role && parsed.city && parsed.email && parsed.phone;
    if (!coreFieldsPresent) {
      toast({ title: "Some fields couldn't be read — please review" });
    }
  }, [open]);

  const handleChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (field === 'name') setNameError('');
    };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      setNameError(result.error.flatten().fieldErrors.name?.[0] ?? '');
      return;
    }
    const { name, role, city, email, phone, instagram, notes } = result.data;
    createContact(
      {
        name,
        role: role || null,
        city: city || null,
        email: email || null,
        phone: phone || null,
        instagram: instagram || null,
        tiktok: null,
        youtube: null,
        website: prefillData?.website ?? cardPrefill?.website ?? null,
        notes: notes || null,
        photo_url: prefillData?.photo_url ?? null,
        linkedin_url: prefillData?.linkedin_url ?? cardPrefill?.linkedin_url ?? null,
      },
      {
        onSuccess: () => {
          setForm({ name: '', role: '', city: '', email: '', phone: '', instagram: '', notes: '' });
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        className="border-none rounded-none max-h-[90dvh] backdrop-blur-[20px] bb-drawer-panel"
        aria-describedby={undefined}
      >
        <DrawerTitle className="sr-only">Quick Add Contact</DrawerTitle>
        <div className="px-6 pt-2 pb-8 overflow-y-auto">
          <p className="font-helvetica text-center mb-6 text-[11px] uppercase tracking-[0.12em] font-normal">
            Quick Add
          </p>

          <form onSubmit={handleSubmit} className="space-y-0">
            {[
              { field: 'name' as const, label: 'Name', placeholder: 'Full name', required: true },
              { field: 'role' as const, label: 'Role', placeholder: 'Job title or role' },
              { field: 'city' as const, label: 'Location', placeholder: 'City or location' },
              { field: 'email' as const, label: 'Email', placeholder: 'Email address' },
              { field: 'phone' as const, label: 'Phone', placeholder: 'Phone number' },
              { field: 'instagram' as const, label: 'Instagram', placeholder: '@username' },
            ].map(({ field, label, placeholder, required }, index) => (
              <div key={field}>
                {index > 0 && <div className="h-px bg-border/50" />}
                <div className="py-4 flex items-center gap-6">
                  <span className="font-helvetica text-[10px] uppercase tracking-[0.12em] text-bb-muted w-16 shrink-0">
                    {label}
                  </span>
                  <input
                    type="text"
                    value={form[field] ?? ''}
                    onChange={handleChange(field)}
                    placeholder={placeholder}
                    required={required}
                    className="flex-1 bg-transparent font-granjon text-[15px] italic tracking-[-0.025em] text-foreground placeholder:text-foreground/30 outline-none"
                  />
                </div>
                {field === 'name' && nameError && (
                  <p className="font-helvetica text-[10px] text-red-400 pb-1">{nameError}</p>
                )}
              </div>
            ))}

            <div className="h-px bg-border/50" />
            <div className="py-3">
              <span className="font-helvetica text-[10px] uppercase tracking-[0.12em] text-bb-muted block mb-2">
                Notes
              </span>
              <textarea
                value={form.notes ?? ''}
                onChange={handleChange('notes')}
                placeholder="Context, how you met..."
                rows={3}
                className="w-full bg-transparent font-granjon text-[15px] italic tracking-[-0.025em] text-foreground placeholder:text-foreground/30 outline-none resize-none"
              />
            </div>

            <div className="h-px bg-border/50 mb-6" />

            <button
              type="submit"
              disabled={isPending}
              className="bb-btn-primary disabled:opacity-50"
            >
              {isPending ? 'Saving...' : 'Save Contact'}
            </button>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AddContactDrawer;
