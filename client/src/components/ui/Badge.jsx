import { cn } from '../../utils/cn';

const variants = {
  default: 'bg-slate-100 text-slate-700 ring-slate-200',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-800 ring-amber-200',
  danger: 'bg-rose-50 text-rose-700 ring-rose-200',
  info: 'bg-cyan-50 text-cyan-700 ring-cyan-200',
};

export function Badge({ className, variant = 'default', children, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
        'ring-1 ring-inset',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

const statusVariants = {
  active: 'success',
  inactive: 'default',
  paid: 'success',
  partial: 'warning',
  unpaid: 'info',
  overdue: 'danger',
  cancelled: 'default',
  occupied: 'success',
  vacant: 'warning',
  rented: 'info',
  admin: 'info',
  officer: 'warning',
  owner: 'success',
};

export function StatusBadge({ status }) {
  if (!status) return '—';
  const variant = statusVariants[status] || 'default';
  return <Badge variant={variant}>{status.replace('_', ' ')}</Badge>;
}
