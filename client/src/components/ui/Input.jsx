import { cn } from '../../utils/cn';

export function Input({ className, type = 'text', ...props }) {
  return (
    <input
      type={type}
      className={cn(
        'flex h-11 w-full rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-950 shadow-sm shadow-slate-950/[0.03] ring-offset-background placeholder:text-slate-400 transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:border-cyan-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}
