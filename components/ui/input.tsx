import * as React from 'react';

import { cn } from '@/lib/utils';

const variantClasses = {
  primary:
    'w-full bg-transparent border-b border-border py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition-colors',
  secondary:
    'w-full bg-transparent px-3 py-2.5 text-xs tracking-wide border border-border text-foreground focus:outline-none',
};

interface InputProps extends React.ComponentProps<'input'> {
  variant?: 'primary' | 'secondary';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = 'primary', ...props }, ref) => {
    return (
      <input type={type} className={cn(variantClasses[variant], className)} ref={ref} {...props} />
    );
  }
);
Input.displayName = 'Input';

export { Input };
