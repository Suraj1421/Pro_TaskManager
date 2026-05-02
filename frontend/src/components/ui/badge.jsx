import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide',
  {
    variants: {
      variant: {
        default: 'border-white/20 text-slate-200',
        success: 'border-emerald-400/40 text-emerald-200',
        warning: 'border-amber-400/40 text-amber-200',
        danger: 'border-rose-400/40 text-rose-200',
        info: 'border-sky-400/40 text-sky-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Badge = React.forwardRef(({ className, variant, ...props }, ref) => (
  <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
));
Badge.displayName = 'Badge';

export { Badge };
