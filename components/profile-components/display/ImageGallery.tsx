'use client';

interface ImageItem {
  url: string | null;
  caption: string | null;
}

interface ImageGalleryData {
  images: ImageItem[];
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

export function ImageGallery({ data }: { data: ImageGalleryData }) {
  if (!data.images || data.images.length === 0) {
    return <EmptyState message="Upload images" />;
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {data.images.map((img, i) => (
        <div key={i} className="border border-bb-rule overflow-hidden aspect-square">
          {img.url ? (
            <img
              src={img.url}
              alt={img.caption ?? `Image ${i + 1}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-bb-rule/30" />
          )}
        </div>
      ))}
    </div>
  );
}
