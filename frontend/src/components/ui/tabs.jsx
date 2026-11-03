import * as React from 'react';
import { cn } from '../../lib/utils.js';

export function Tabs({ defaultValue, value, onValueChange, className, children, ...props }) {
  const [selected, setSelected] = React.useState(value || defaultValue);

  React.useEffect(() => {
    if (value !== undefined) {
      setSelected(value);
    }
  }, [value]);

  const handleChange = (newVal) => {
    setSelected(newVal);
    if (onValueChange) onValueChange(newVal);
  };

  return (
    <div className={cn('w-full', className)} {...props}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child, {
          selected,
          onSelect: handleChange
        });
      })}
    </div>
  );
}

export function TabsList({ className, children, selected, onSelect, ...props }) {
  return (
    <div
      className={cn(
        'inline-flex h-9 items-center justify-center rounded-lg bg-zinc-100 p-1 text-zinc-500',
        className
      )}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child, {
          selected: selected === child.props.value,
          onClick: () => onSelect(child.props.value)
        });
      })}
    </div>
  );
}

export function TabsTrigger({ className, value, selected, onClick, children, ...props }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
        selected
          ? 'bg-white text-zinc-950 shadow-xs font-semibold'
          : 'text-zinc-500 hover:text-zinc-900',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ className, value, selected, children, ...props }) {
  if (value !== selected) return null;
  return (
    <div
      className={cn(
        'mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
