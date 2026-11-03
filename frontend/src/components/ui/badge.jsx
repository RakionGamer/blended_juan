import * as React from 'react';
import { cn } from '../../lib/utils.js';

const badgeVariants = {
  default: 'border-transparent bg-zinc-900 text-zinc-50 shadow hover:bg-zinc-900/80',
  secondary: 'border-transparent bg-zinc-100 text-zinc-900 hover:bg-zinc-100/80',
  destructive: 'border-transparent bg-red-500 text-zinc-50 shadow hover:bg-red-500/80',
  outline: 'text-zinc-950 border-zinc-200',
  success: 'border-transparent bg-emerald-600 text-white shadow hover:bg-emerald-600/80',
  warning: 'border-transparent bg-amber-500 text-zinc-950 shadow hover:bg-amber-500/80'
};

export function Badge({ className, variant = 'default', ...props }) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2',
        badgeVariants[variant] || badgeVariants.default,
        className
      )}
      {...props}
    />
  );
}
