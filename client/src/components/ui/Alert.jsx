import { cn } from '../../utils/cn';

const variants = {
  default: 'border-slate-200 bg-white text-slate-800',
  destructive: 'border-rose-200 bg-rose-50 text-rose-700',
};

export function Alert({ className, variant = 'default', children, ...props }) {
  return (
    <div
      role="alert"
      className={cn('relative w-full rounded-lg border p-4 text-sm font-medium', variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}
