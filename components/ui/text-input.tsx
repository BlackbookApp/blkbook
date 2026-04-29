import { cn } from '@/lib/utils';

export function TextInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'w-full bg-transparent px-4 py-[14px] text-[13.5px] font-helvetica text-foreground focus:outline-none placeholder:text-bb-muted/60',
        className
      )}
    />
  );
}
