'use client';

interface LogoData {
  url: string | null;
  label: string | null;
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

export function Logo({ data }: { data: LogoData }) {
  if (!data.url && !data.label) {
    return <EmptyState message="Upload your logo" />;
  }

  return (
    <div className="flex justify-center items-center py-2">
      {data.url ? (
        <img src={data.url} alt={data.label ?? 'Logo'} className="h-12 object-contain opacity-80" />
      ) : (
        <span className="font-granjon text-[18px] tracking-wide text-foreground">{data.label}</span>
      )}
    </div>
  );
}
