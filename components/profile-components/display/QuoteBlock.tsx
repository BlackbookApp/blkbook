'use client';

interface QuoteBlockData {
  text: string | null;
  attributed: string | null;
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

export function QuoteBlock({ data }: { data: QuoteBlockData }) {
  if (!data.text) {
    return <EmptyState message="Add a quote" />;
  }

  return (
    <div className="text-center px-4">
      <p className="font-granjon italic text-[15px] leading-relaxed text-foreground">{data.text}</p>
      {data.attributed && (
        <p className="font-granjon text-[11px] uppercase tracking-[0.12em] text-bb-muted mt-2">
          — {data.attributed}
        </p>
      )}
    </div>
  );
}
