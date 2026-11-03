import { Toaster as Sonner } from 'sonner';

export function Toaster({ ...props }) {
  return (
    <Sonner
      theme="light"
      position="top-center"
      richColors
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-white group-[.toaster]:text-zinc-950 group-[.toaster]:border-zinc-200 group-[.toaster]:shadow-xl group-[.toaster]:rounded-xl font-sans',
          description: 'group-[.toast]:text-zinc-500 font-sans',
          actionButton:
            'group-[.toast]:bg-zinc-900 group-[.toast]:text-zinc-50 font-medium',
          cancelButton:
            'group-[.toast]:bg-zinc-100 group-[.toast]:text-zinc-600 font-medium',
          error:
            'group-[.toaster]:!bg-red-600 group-[.toaster]:!text-white group-[.toaster]:!border-red-700 shadow-xl shadow-red-950/20',
          success:
            'group-[.toaster]:!bg-emerald-600 group-[.toaster]:!text-white group-[.toaster]:!border-emerald-700 shadow-xl',
        },
      }}
      {...props}
    />
  );
}
