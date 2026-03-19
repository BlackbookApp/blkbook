import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface ContactNotesProps {
  notes: string | null;
  onAddNote: (note: string) => void;
}

export function ContactNotes({ notes, onAddNote }: ContactNotesProps) {
  const [showInput, setShowInput] = useState(false);
  const [newNote, setNewNote] = useState('');

  const handleSave = () => {
    if (!newNote.trim()) return;
    onAddNote(newNote.trim());
    setNewNote('');
    setShowInput(false);
  };

  return (
    <div className="mb-0">
      <h2 className="font-helvetica text-[11px] font-normal uppercase tracking-[0.12em] text-bb-muted mb-4">
        Private Notes
      </h2>

      {notes && (
        <div className="py-4 border-b border-border">
          <p className="font-granjon text-[14px] italic font-normal leading-[1.7] tracking-tight text-bb-dark/80 whitespace-pre-line">
            {notes}
          </p>
        </div>
      )}

      {showInput ? (
        <div className="mt-4 animate-fade-in">
          <Textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="What's worth remembering..."
            className="font-granjon italic text-[14px] tracking-tight text-bb-dark border-border bg-transparent resize-none mb-3 focus-visible:ring-0 focus-visible:border-[var(--bb-border)]"
            rows={3}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="font-helvetica text-[10px] font-normal uppercase tracking-[0.14em] py-2 px-5 bg-bb-dark text-white transition-opacity hover:opacity-80"
            >
              Save
            </button>
            <button
              onClick={() => {
                setShowInput(false);
                setNewNote('');
              }}
              className="font-helvetica text-[10px] font-normal uppercase tracking-[0.14em] py-2 px-5 text-bb-muted transition-opacity hover:opacity-60"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowInput(true)}
          className="w-full border border-border py-3 mt-4 text-center font-helvetica text-[11px] font-normal uppercase tracking-[0.12em] text-bb-dark transition-opacity hover:opacity-60"
        >
          Add Note
        </button>
      )}
    </div>
  );
}
