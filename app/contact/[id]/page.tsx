'use client';

import { useRouter, useParams } from 'next/navigation';
import { routes } from '@/lib/routes';
import Logo from '@/components/Logo';
import BottomNav from '@/components/BottomNav';
import { Text } from '@/components/ui/text';
import { ContactBanner } from '@/components/contact/ContactBanner';
import { ContactInfo } from '@/components/contact/ContactInfo';
import { ContactNotes } from '@/components/contact/ContactNotes';
import { EditContactDialog } from '@/components/contact/EditContactDialog';
import { useVaultContact, useUpdateVaultContact } from '@/hooks/use-vault-contacts';
import { useState } from 'react';

const ContactDetail = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [showEditDialog, setShowEditDialog] = useState(false);

  const { data: contact, isLoading } = useVaultContact(id);
  const updateContact = useUpdateVaultContact();

  const handleAddNote = (note: string) => {
    if (!contact) return;
    const appended = contact.notes ? `${contact.notes}\n${note}` : note;
    updateContact.mutate({ id, input: { notes: appended } });
  };

  const handleSaveEdit = (fields: Parameters<typeof updateContact.mutate>[0]['input']) => {
    updateContact.mutate({ id, input: fields });
    setShowEditDialog(false);
  };

  if (isLoading) {
    return (
      <div className="blackbook-container bg-background">
        <div className="blackbook-page animate-fade-in pb-24">
          <Logo />
        </div>
        <BottomNav />
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="blackbook-container bg-background">
        <div className="blackbook-page animate-fade-in pb-24">
          <Logo />
          <Text variant="body-2" className="mt-8 text-center text-muted-foreground">
            Contact not found.
          </Text>
        </div>
        <BottomNav />
      </div>
    );
  }

  const addedDate = new Date(contact.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="blackbook-container bg-background">
      <div className="blackbook-page animate-fade-in pb-24">
        <Logo />

        <div className="flex items-center justify-between mt-4 mb-6">
          <button
            onClick={() => router.push(routes.vault)}
            className="font-helvetica text-[11px] font-normal uppercase tracking-[0.12em] text-bb-muted transition-opacity hover:opacity-60"
          >
            Back
          </button>
          <button
            onClick={() => setShowEditDialog(true)}
            className="font-helvetica text-[11px] font-normal uppercase tracking-[0.12em] text-bb-muted transition-opacity hover:opacity-60"
          >
            Edit
          </button>
        </div>

        <ContactBanner contact={contact} />
        <ContactInfo contact={contact} />
        <ContactNotes
          notes={contact.notes}
          addedDate={addedDate}
          city={contact.city}
          onAddNote={handleAddNote}
        />
      </div>

      <EditContactDialog
        key={String(showEditDialog)}
        contact={contact}
        open={showEditDialog}
        isPending={updateContact.isPending}
        onOpenChange={setShowEditDialog}
        onSave={handleSaveEdit}
      />

      <BottomNav />
    </div>
  );
};

export default ContactDetail;
