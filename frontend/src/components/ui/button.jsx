import * as React from 'react';
import { cn } from '../../lib/utils.js';

const buttonVariants = {
  variant: {
    default: 'bg-zinc-900 text-zinc-50 shadow hover:bg-zinc-900/90',
    destructive: 'bg-red-500 text-zinc-50 shadow-xs hover:bg-red-500/90',
    outline: 'border border-zinc-200 bg-white shadow-xs hover:bg-zinc-100 hover:text-zinc-900',
    secondary: 'bg-zinc-100 text-zinc-900 shadow-xs hover:bg-zinc-100/80',
    ghost: 'hover:bg-zinc-100 hover:text-zinc-900',
    link: 'text-zinc-900 underline-offset-4 hover:underline',
    primary: 'bg-blue-600 text-white shadow-xs hover:bg-blue-600/90'
  },
  size: {
    default: 'h-9 px-4 py-2',
    sm: 'h-8 rounded-md px-3 text-xs',
    lg: 'h-10 rounded-md px-8',
    icon: 'h-9 w-9'
  }
};

export const Button = React.forwardRef(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
          buttonVariants.variant[variant] || buttonVariants.variant.default,
          buttonVariants.size[size] || buttonVariants.size.default,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
