import * as React from 'react';
import { cn } from '../../lib/utils';

const Input = React.forwardRef(({ className, type = 'text', ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      'flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-400',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';

export { Input };
