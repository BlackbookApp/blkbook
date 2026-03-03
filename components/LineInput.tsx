import { forwardRef } from 'react';

type LineInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const LineInput = forwardRef<HTMLInputElement, LineInputProps>(
  ({ className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={`w-full font-normal bg-transparent border-b border-border py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition-colors ${className}`}
      {...props}
    />
  )
);
LineInput.displayName = 'LineInput';

export default LineInput;
