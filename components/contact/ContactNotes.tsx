import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface ContactNotesProps {
  notes: string | null;
  addedDate: string;
  city: string | null;
  onAddNote: (note: string) => void;
}

export function ContactNotes({ notes, addedDate, city, onAddNote }: ContactNotesProps) {
  const [showInput, setShowInput] = useState(false);
  const [newNote, setNewNote] = useState('');

  const handleSave = () => {
    if (!newNote.trim()) return;
    onAddNote(newNote.trim());
    setNewNote('');
    setShowInput(false);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-helvetica text-[11px] font-normal uppercase tracking-[0.12em] text-bb-muted">
          Private Notes
        </h2>
        <button
          onClick={() => setShowInput(true)}
          className="text-bb-muted transition-opacity hover:opacity-60"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {showInput && (
        <div className="mb-4 animate-fade-in">
          <Textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..."
            className="font-garamond italic text-[14px] tracking-tight text-bb-dark border-border bg-transparent resize-none mb-3 focus-visible:ring-0 focus-visible:border-[var(--bb-border)]"
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
              onClick={() => setShowInput(false)}
              className="font-helvetica text-[10px] font-normal uppercase tracking-[0.14em] py-2 px-5 text-bb-muted transition-opacity hover:opacity-60"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {notes && (
        <div className="py-4 border-b border-border">
          <p className="font-garamond text-[14px] italic font-normal leading-[1.7] tracking-tight text-bb-dark/80 whitespace-pre-line">
            {notes}
          </p>
        </div>
      )}

      <p className="font-helvetica text-[10px] font-normal uppercase tracking-[0.12em] text-bb-muted/60 mt-3">
        Added {addedDate}
        {city && `, ${city}`}
      </p>
    </div>
  );
}
