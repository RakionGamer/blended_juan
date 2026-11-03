import * as React from 'react';
import { X, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { cn } from '../../lib/utils.js';

let toastListeners = [];

export function toast({ title, description, variant = 'default', duration = 4000 }) {
  const id = Math.random().toString(36).substring(2, 9);
  const toastItem = { id, title, description, variant, duration };
  toastListeners.forEach((listener) => listener(toastItem));
}

export function Toaster() {
  const [toasts, setToasts] = React.useState([]);

  React.useEffect(() => {
    const handleNewToast = (newToast) => {
      setToasts((prev) => [...prev, newToast]);
      if (newToast.duration) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
        }, newToast.duration);
      }
    };

    toastListeners.push(handleNewToast);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== handleNewToast);
    };
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        const isDestructive = t.variant === 'destructive';
        const Icon = isDestructive ? AlertCircle : Info;

        return (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 p-4 rounded-lg shadow-lg border text-sm transition-all animate-in slide-in-from-top-2 duration-200',
              isDestructive
                ? 'bg-red-600 text-white border-red-700 shadow-red-900/20'
                : 'bg-zinc-900 text-zinc-50 border-zinc-800 shadow-zinc-950/30'
            )}
          >
            <Icon className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              {t.title && <p className="font-semibold text-sm leading-tight">{t.title}</p>}
              {t.description && (
                <p
                  className={cn(
                    'text-xs mt-1 leading-snug',
                    isDestructive ? 'text-red-100' : 'text-zinc-400'
                  )}
                >
                  {t.description}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className={cn(
                'p-1 rounded-md transition-colors cursor-pointer shrink-0',
                isDestructive ? 'hover:bg-red-700 text-red-200 hover:text-white' : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'
              )}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
