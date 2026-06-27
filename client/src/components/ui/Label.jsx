import { cn } from '../../utils/cn';

export function Label({ className, ...props }) {
  return (
    <label
      className={cn('text-sm font-bold leading-none text-slate-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70', className)}
      {...props}
    />
  );
}
