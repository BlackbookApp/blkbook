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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  useVaultContact,
  useUpdateVaultContact,
  useDeleteVaultContact,
} from '@/hooks/use-vault-contacts';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProfileUsernameAction } from '@/app/actions/profiles';

const ContactDetail = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: contact, isLoading } = useVaultContact(id);
  const updateContact = useUpdateVaultContact();
  const deleteContact = useDeleteVaultContact();

  const { data: profileUsername } = useQuery({
    queryKey: ['profile-username', contact?.profile_id],
    queryFn: () => getProfileUsernameAction(contact!.profile_id!),
    enabled: !!contact?.profile_id,
    staleTime: Infinity,
  });

  const handleAddNote = (note: string) => {
    if (!contact) return;
    const appended = contact.notes ? `${contact.notes}\n${note}` : note;
    updateContact.mutate({ id, input: { notes: appended } });
  };

  const handleSaveEdit = (fields: Parameters<typeof updateContact.mutate>[0]['input']) => {
    updateContact.mutate({ id, input: fields });
    setShowEditDialog(false);
  };

  const handleConfirmDelete = () => {
    deleteContact.mutate(id, {
      onSuccess: () => router.push(routes.vault),
    });
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
    month: 'short',
    day: 'numeric',
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

        {profileUsername && (
          <a
            href={routes.publicProfile(profileUsername)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full py-4 border-b border-border mb-6 group"
          >
            <div>
              <p className="font-helvetica text-[11px] font-normal uppercase tracking-[0.12em] mb-1.5 text-bb-muted">
                Haizel Profile
              </p>
              <p className="font-garamond text-[14px] italic font-normal tracking-tight text-bb-dark">
                haizel.io/p/{profileUsername}
              </p>
            </div>
            <span className="font-helvetica text-[10px] uppercase tracking-[0.12em] text-bb-muted group-hover:text-bb-dark transition-colors">
              View →
            </span>
          </a>
        )}

        {contact.linkedin_url && (
          <a
            href={contact.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full py-4 border-b border-border mb-6 group"
          >
            <div>
              <p className="font-helvetica text-[11px] font-normal uppercase tracking-[0.12em] mb-1.5 text-bb-muted">
                LinkedIn
              </p>
              <p className="font-granjon text-[14px] italic font-normal tracking-tight text-bb-dark">
                {contact.linkedin_url.replace('https://www.linkedin.com/in/', 'in/')}
              </p>
            </div>
            <span className="font-helvetica text-[10px] uppercase tracking-[0.12em] text-bb-muted group-hover:text-bb-dark transition-colors">
              View →
            </span>
          </a>
        )}

        <ContactNotes notes={contact.notes} onAddNote={handleAddNote} />

        <button
          onClick={() => setShowDeleteDialog(true)}
          className="w-full border border-border py-3 mt-4 text-center font-helvetica text-[11px] font-normal uppercase tracking-[0.12em] text-destructive transition-opacity hover:opacity-60"
        >
          Delete Contact
        </button>

        <p className="font-helvetica text-[10px] font-normal uppercase tracking-[0.12em] text-bb-muted/60 mt-4 mb-8 text-center">
          Added {addedDate}
          {contact.city && `, ${contact.city}`}
        </p>
      </div>

      <EditContactDialog
        key={String(showEditDialog)}
        contact={contact}
        open={showEditDialog}
        isPending={updateContact.isPending}
        onOpenChange={setShowEditDialog}
        onSave={handleSaveEdit}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-background border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-granjon text-[16px] font-normal uppercase tracking-[0.01em]">
              Delete Contact
            </AlertDialogTitle>
            <AlertDialogDescription className="font-helvetica text-[13px] font-light text-bb-muted">
              Are you sure you want to delete {contact.name}? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-3">
            <AlertDialogCancel className="flex-1 py-3 font-helvetica text-[11px] font-normal uppercase tracking-[0.1em] border-border text-bb-dark bg-transparent mt-0 rounded-none">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteContact.isPending}
              className="flex-1 py-3 font-helvetica text-[11px] font-normal uppercase tracking-[0.1em] bg-destructive text-white rounded-none hover:bg-destructive/90 disabled:opacity-50"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNav />
    </div>
  );
};

export default ContactDetail;
