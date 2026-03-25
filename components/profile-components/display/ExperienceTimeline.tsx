'use client';

interface ExperienceItem {
  role: string;
  company: string;
  start_year: string | null;
  end_year: string | null;
  description: string | null;
  type: string | null;
  location: string | null;
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

function extractYear(s: string | null): number | null {
  if (!s) return null;
  const match = s.match(/\b(\d{4})\b/);
  return match ? parseInt(match[1]) : null;
}

function getCompanyDuration(items: ExperienceItem[]): string {
  const starts = items.map((i) => extractYear(i.start_year)).filter((y): y is number => y !== null);
  if (starts.length === 0) return '';
  const earliest = Math.min(...starts);
  const ends = items
    .map((i) =>
      i.end_year === null ? new Date().getFullYear() : (extractYear(i.end_year) ?? null)
    )
    .filter((y): y is number => y !== null);
  const latest = ends.length > 0 ? Math.max(...ends) : new Date().getFullYear();
  const diff = latest - earliest;
  if (diff <= 0) return '';
  return `${diff}+ Yrs`;
}

function getPeriod(start: string | null, end: string | null): string {
  if (!start) return '';
  return `${start} – ${end ?? 'Present'}`;
}

export function ExperienceTimeline({ data }: { data: ExperienceTimelineData }) {
  if (!data.items || data.items.length === 0) {
    return <EmptyState message="Add your experience" />;
  }

  // Group by company, preserving order of first appearance
  const companies: string[] = [];
  const grouped: Record<string, ExperienceItem[]> = {};
  for (const item of data.items) {
    const key = item.company || '';
    if (!grouped[key]) {
      companies.push(key);
      grouped[key] = [];
    }
    grouped[key].push(item);
  }

  return (
    <div className="space-y-8">
      {companies.map((company) => {
        const items = grouped[company];
        const duration = getCompanyDuration(items);
        return (
          <div key={company}>
            {company && (
              <p className="font-helvetica text-[9px] font-light uppercase tracking-[0.25em] text-bb-muted/60 mb-5">
                {company}
                {duration ? ` · ${duration}` : ''}
              </p>
            )}
            <div className="space-y-6">
              {items.map((item, i) => (
                <div key={i} className="border-l border-bb-dark pl-5">
                  <h3 className="font-granjon text-[16px] tracking-tight text-bb-dark">
                    {item.role}
                  </h3>
                  {item.type && (
                    <p className="font-helvetica text-[10px] uppercase tracking-[0.1em] text-bb-muted mt-1">
                      {item.type}
                    </p>
                  )}
                  {(item.start_year || item.end_year) && (
                    <p className="font-helvetica text-[10px] tracking-[0.05em] font-light text-[#bbbbbb] mt-0.5">
                      {getPeriod(item.start_year, item.end_year)}
                    </p>
                  )}
                  {item.location && (
                    <p className="font-helvetica text-[10px] tracking-[0.05em] font-light text-[#bbbbbb] mt-0.5">
                      {item.location}
                    </p>
                  )}
                  {item.description && (
                    <p className="font-granjon text-[13px] text-bb-muted leading-[1.8] mt-2">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
