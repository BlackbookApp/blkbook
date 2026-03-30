'use client';

interface RecognitionItem {
  title: string;
  year: string | null;
  url: string | null;
}

interface RecognitionListData {
  items: RecognitionItem[];
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

export function RecognitionList({ data }: { data: RecognitionListData }) {
  if (!data.items || data.items.length === 0) {
    return <EmptyState message="Add awards or credentials" />;
  }

  return (
    <div>
      <p className="font-helvetica text-[10px] tracking-[0.2em] uppercase text-[#888] mb-2">
        Recognition
      </p>
      <div className="h-px bg-bb-rule mb-4" />
      <div className="space-y-3">
        {data.items.map((item, i) => (
          <div key={i} className="flex items-baseline justify-between">
            <p className="font-granjon text-[14px] tracking-tight text-[#555]">{item.title}</p>
            {item.year && (
              <span className="font-helvetica text-[10px] text-bb-muted ml-4 shrink-0">
                {item.year}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
