'use client';

interface TopBioData {
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

export function TopBio({ data }: { data: TopBioData }) {
  if (!data.text) {
    return <EmptyState message="Write a short bio" />;
  }

  return (
    <p className="font-granjon text-[14px] leading-[1.35] tracking-tight text-foreground">
      {data.text}
    </p>
  );
}
