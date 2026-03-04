import { forwardRef } from 'react';
import { Input } from '@/components/ui/input';

type LineInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const LineInput = forwardRef<HTMLInputElement, LineInputProps>((props, ref) => (
  <Input variant="primary" ref={ref} {...props} />
));
LineInput.displayName = 'LineInput';

export default LineInput;
