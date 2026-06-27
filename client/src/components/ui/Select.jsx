import { cn } from '../../utils/cn';

export function Select({ className, children, options, ...props }) {
  return (
    <select
      className={cn(
        'flex h-11 w-full rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-950 shadow-sm shadow-slate-950/[0.03] ring-offset-background transition-all focus-visible:border-cyan-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      {options
        ? options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
        : children}
    </select>
  );
}
