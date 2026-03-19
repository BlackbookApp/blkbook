'use client';

interface ProfileHeroCenteredData {
  name: string | null;
  image_url: string | null;
  tagline: string | null;
  location: string | null;
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

export function ProfileHeroCentered({ data }: { data: ProfileHeroCenteredData }) {
  if (!data.name && !data.image_url && !data.tagline) {
    return <EmptyState message="Add your name and photo" />;
  }

  return (
    <div className="w-full">
      {data.image_url ? (
        <div
          className="w-full border border-bb-rule overflow-hidden"
          style={{ aspectRatio: '3/4' }}
        >
          <img
            src={data.image_url}
            alt={data.name ?? 'Profile photo'}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div
          className="w-full border border-bb-rule bg-bb-rule/30 flex items-center justify-center"
          style={{ aspectRatio: '3/4' }}
        >
          <span className="font-helvetica text-[9px] uppercase tracking-[0.2em] text-bb-muted/40">
            No photo yet
          </span>
        </div>
      )}
      <div className="mt-4 text-right">
        {data.name && (
          <h1 className="font-granjon text-xl uppercase tracking-wide text-foreground">
            {data.name}
          </h1>
        )}
        {data.tagline && (
          <p className="font-granjon italic text-[17px] text-foreground/80 mt-1">{data.tagline}</p>
        )}
        {data.location && (
          <p className="font-helvetica text-[10px] uppercase tracking-[0.1em] text-bb-muted mt-1">
            {data.location}
          </p>
        )}
      </div>
    </div>
  );
}
