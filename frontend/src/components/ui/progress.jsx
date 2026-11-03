import * as React from 'react';
import { cn } from '../../lib/utils.js';

export const Progress = React.forwardRef(({ className, value = 0, indicatorClassName, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative h-2 w-full overflow-hidden rounded-full bg-zinc-100',
      className
    )}
    {...props}
  >
    <div
      className={cn('h-full w-full flex-1 bg-zinc-900 transition-all', indicatorClassName)}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </div>
));
Progress.displayName = 'Progress';
