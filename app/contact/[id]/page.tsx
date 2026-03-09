'use client';

import { useRouter, useParams } from 'next/navigation';
import { routes } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Plus, Instagram } from 'lucide-react';
import Image from 'next/image';
import Logo from '@/components/Logo';
import BottomNav from '@/components/BottomNav';
import contactPhoto from '@/assets/contact-photo.jpg';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
import { Input } from '@/components/ui/input';
import { getContactDetail } from '@/lib/demo-data/contacts';

const ContactDetail = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);

  const [contact, setContact] = useState(() => getContactDetail(id));

  const [editForm, setEditForm] = useState({
    name: contact.name,
    role: contact.role,
    email: contact.email,
    phone: contact.phone,
    instagram: contact.instagram,
  });

  const handleAddNote = () => {
    if (newNote.trim()) {
      setContact((prev) => ({
        ...prev,
        notes: [
          ...prev.notes,
          {
            id: crypto.randomUUID(),
            text: newNote.trim(),
            date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          },
        ],
      }));
      setNewNote('');
      setShowNoteInput(false);
    }
  };

  const handleSaveEdit = () => {
    setContact({ ...contact, ...editForm });
    setShowEditDialog(false);
  };

  const handleSendInvite = () => {
    setInviteSent(true);
  };

  return (
    <div className="blackbook-container bg-background">
      <div className="blackbook-page animate-fade-in pb-24">
        <Logo />

        {/* Header */}
        <div className="flex items-center justify-between mt-4 mb-6">
          <Button
            variant="blackbook-ghost"
            size="sm"
            className="text-muted-foreground/50 px-0"
            onClick={() => router.push(routes.vault)}
          >
            Back
          </Button>
          <Button
            variant="blackbook-ghost"
            size="sm"
            className="text-muted-foreground/50 px-0"
            onClick={() => setShowEditDialog(true)}
          >
            Edit
          </Button>
        </div>

        {/* Profile Photo or Typographic Banner */}
        {contact.hasPhoto ? (
          <>
            <div className="w-full aspect-[3/4] mb-6 border border-foreground relative">
              <Image src={contactPhoto} alt={contact.name} fill className="object-cover" />
            </div>
            <div className="text-center mb-4">
              <Text
                as="h1"
                variant="inherit"
                className="font-display font-light blackbook-title tracking-[0.01em] mb-1"
              >
                {contact.name}
              </Text>
              <Text variant="subtitle" className="mb-1">
                {contact.role}
              </Text>
              {contact.addedLocation && (
                <Text variant="inherit" className="text-xs text-muted-foreground/60 tracking-wide">
                  {contact.addedLocation}
                </Text>
              )}
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-2">
                <Instagram className="w-3 h-3" />
                <span>{contact.instagram}</span>
                <span className="mx-1">·</span>
                <span>{contact.instagramFollowers} followers</span>
              </div>
            </div>
          </>
        ) : (
          <div
            className="w-full -mx-6 px-6 py-8 mb-6 relative overflow-hidden grain-overlay bg-bb-nav"
            style={{ width: 'calc(100% + 3rem)' }}
          >
            <Text
              as="h1"
              variant="inherit"
              className="font-display font-light text-2xl tracking-[0.01em] uppercase text-background mb-0.5"
            >
              {contact.name}
            </Text>
            <Text
              as="p"
              variant="inherit"
              className="font-editorial font-extralight text-[12px] italic normal-case tracking-[0.01em] text-background/60 mb-0"
            >
              {contact.role}
            </Text>
            {contact.addedLocation && (
              <Text
                as="p"
                variant="inherit"
                className="font-display font-light text-[11px] tracking-[0.02em] uppercase text-background/35 mt-0.5"
              >
                {contact.addedLocation}
              </Text>
            )}
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-4 mb-6">
          {contact.email && (
            <a href={`mailto:${contact.email}`} className="block py-3 border-b border-border">
              <Text variant="label" className="mb-1">
                Email
              </Text>
              <Text variant="body-2">{contact.email}</Text>
            </a>
          )}
          {contact.phone && (
            <a href={`tel:${contact.phone}`} className="block py-3 border-b border-border">
              <Text variant="label" className="mb-1">
                Phone
              </Text>
              <Text variant="body-2">{contact.phone}</Text>
            </a>
          )}
        </div>

        {/* Notes */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Text variant="label">Private Notes</Text>
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 text-muted-foreground hover:text-foreground"
              onClick={() => setShowNoteInput(true)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {showNoteInput && (
            <div className="mb-4 animate-fade-in">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note..."
                className="font-editorial italic normal-case text-[13px] tracking-[0.01em] blackbook-input resize-none mb-2"
                rows={3}
                autoFocus
              />
              <div className="flex gap-2">
                <Button variant="blackbook" size="sm" onClick={handleAddNote}>
                  Save
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowNoteInput(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="py-3 border-b border-border">
            <Text variant="body-2" className="leading-relaxed">
              {contact.notes.map((note, i) => (
                <span key={note.id}>
                  {note.text}
                  {i < contact.notes.length - 1 && '. '}
                </span>
              ))}
            </Text>
          </div>

          <Text variant="label" className="text-muted-foreground/40 mt-3 block">
            Added {contact.addedDate}, {contact.addedLocation}
          </Text>
        </div>
      </div>

      {/* Edit Contact Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium tracking-tight">Edit Contact</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {(
              [
                { key: 'name', label: 'Name' },
                { key: 'role', label: 'Role' },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Phone' },
                { key: 'instagram', label: 'Instagram' },
              ] as const
            ).map(({ key, label }) => (
              <div key={key}>
                <Text variant="label" as="label" className="mb-2 block text-muted-foreground">
                  {label}
                </Text>
                <Input
                  value={editForm[key]}
                  onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                  className="blackbook-input"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <Button
              variant="blackbook-secondary"
              size="full"
              onClick={() => setShowEditDialog(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button variant="blackbook" size="full" onClick={handleSaveEdit} className="flex-1">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invite to Blackbook Dialog */}
      <AlertDialog
        open={showInviteDialog}
        onOpenChange={(open) => {
          setShowInviteDialog(open);
          if (!open) setInviteSent(false);
        }}
      >
        <AlertDialogContent className="bg-background border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-medium tracking-tight">
              {inviteSent ? 'Invitation Sent' : 'Invite to Blackbook'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              {inviteSent
                ? `A referral link has been sent to ${contact.name}. They'll receive an invitation to join Blackbook with your endorsement.`
                : `Send a referral invitation to ${contact.name}? They'll receive a personalized link to request access to Blackbook.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-3">
            {inviteSent ? (
              <AlertDialogAction
                onClick={() => {
                  setShowInviteDialog(false);
                  setInviteSent(false);
                }}
                className="flex-1 bg-primary text-primary-foreground py-3 uppercase font-normal tracking-[0.12em] text-[11px] font-helvetica"
              >
                Done
              </AlertDialogAction>
            ) : (
              <>
                <AlertDialogCancel className="flex-1 border-border text-foreground py-3 uppercase font-normal tracking-[0.12em] text-[11px] font-helvetica mt-0">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleSendInvite}
                  className="flex-1 bg-primary text-primary-foreground py-3 uppercase font-normal tracking-[0.12em] text-[11px] font-helvetica"
                >
                  Send Invite
                </AlertDialogAction>
              </>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNav />
    </div>
  );
};

export default ContactDetail;
