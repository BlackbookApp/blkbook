'use client';

interface ExperienceItem {
  role: string;
  company: string;
  start_year: string | null;
  end_year: string | null;
  description: string | null;
}

interface ExperienceTimelineData {
  items: ExperienceItem[];
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

function getYearsLabel(start: string | null, end: string | null): string {
  if (!start) return '';
  const endVal = end ?? 'Present';
  if (start === endVal) return start;
  return `${start} – ${endVal}`;
}

export function ExperienceTimeline({ data }: { data: ExperienceTimelineData }) {
  if (!data.items || data.items.length === 0) {
    return <EmptyState message="Add your experience" />;
  }

  return (
    <div className="space-y-4">
      {data.items.map((item, i) => (
        <div key={i} className="border-l border-foreground pl-5">
          <p className="font-helvetica text-[9px] uppercase text-bb-muted mb-1">{item.company}</p>
          <p className="font-granjon text-[16px] text-foreground">{item.role}</p>
          {(item.start_year || item.end_year) && (
            <p className="font-helvetica text-[10px] text-bb-muted/40 mt-0.5">
              {getYearsLabel(item.start_year, item.end_year)}
            </p>
          )}
          {item.description && (
            <p className="font-granjon italic text-[13px] text-foreground/60 leading-[1.8] mt-1">
              {item.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
