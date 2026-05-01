export function FieldCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border border-bb-rule bg-background">
      <p className="font-helvetica text-[10px] uppercase tracking-[0.15em] text-bb-muted/50 px-4 pt-3">
        {label}
      </p>
      {children}
    </div>
  );
}
