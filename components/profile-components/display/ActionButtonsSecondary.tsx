'use client';

interface ButtonItem {
  label: string;
  url: string | null;
  style: 'primary' | 'secondary' | null;
}

interface ActionButtonsSecondaryData {
  buttons: ButtonItem[];
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-6 text-center">
      <p className="font-helvetica text-[9px] uppercase tracking-[0.2em] text-bb-muted/40">
        {message}
      </p>
    </div>
  );
}

export function ActionButtonsSecondary({ data }: { data: ActionButtonsSecondaryData }) {
  if (!data.buttons || data.buttons.length === 0) {
    return <EmptyState message="Add action buttons" />;
  }

  const secondaryButtons = data.buttons.filter((b) => b.style === 'secondary');

  return (
    <div className="space-y-2">
      {data.buttons.map((btn, i) => {
        if (btn.style === 'primary') {
          return (
            <a key={i} href={btn.url ?? '#'} className="bb-btn-primary block text-center">
              {btn.label}
            </a>
          );
        }

        const isSecondary = btn.style === 'secondary';
        const secondaryIndex = secondaryButtons.indexOf(btn);
        const isFirstOfPair = isSecondary && secondaryIndex % 2 === 0;
        const hasNextSecondary = isSecondary && secondaryIndex + 1 < secondaryButtons.length;

        if (isFirstOfPair && hasNextSecondary) {
          const nextBtn = secondaryButtons[secondaryIndex + 1];
          return (
            <div key={i} className="grid grid-cols-2 gap-2">
              <a
                href={btn.url ?? '#'}
                className="border border-bb-rule py-3 font-helvetica text-[11px] uppercase tracking-[0.1em] text-foreground hover:opacity-70 transition-all text-center"
              >
                {btn.label}
              </a>
              <a
                href={nextBtn.url ?? '#'}
                className="border border-bb-rule py-3 font-helvetica text-[11px] uppercase tracking-[0.1em] text-foreground hover:opacity-70 transition-all text-center"
              >
                {nextBtn.label}
              </a>
            </div>
          );
        }

        if (isSecondary && secondaryIndex % 2 === 1) return null;

        return (
          <a
            key={i}
            href={btn.url ?? '#'}
            className="border border-bb-rule py-3 w-full font-helvetica text-[11px] uppercase tracking-[0.1em] text-foreground hover:opacity-70 transition-all block text-center"
          >
            {btn.label}
          </a>
        );
      })}
    </div>
  );
}
