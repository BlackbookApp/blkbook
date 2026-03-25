'use client';

interface NowBlockData {
  text: string | null;
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

export function NowBlock({ data }: { data: NowBlockData }) {
  if (!data.text) {
    return <EmptyState message="Add what you're currently focused on" />;
  }

  return (
    <div className="text-center">
      <p className="font-helvetica text-[10px] uppercase text-bb-muted mb-4 tracking-wide">
        Currently
      </p>
      <p className="font-granjon italic text-[14px] leading-[1.7] text-foreground/70">
        {data.text}
      </p>
    </div>
  );
}
