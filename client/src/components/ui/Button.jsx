import { cn } from '../../utils/cn';

const variants = {
  default:
    'bg-slate-950 text-white shadow-sm shadow-slate-950/20 hover:bg-slate-800',
  secondary: 'bg-teal-50 text-teal-900 hover:bg-teal-100',
  outline:
    'border border-slate-200 bg-white text-slate-900 shadow-sm hover:border-slate-300 hover:bg-slate-50',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
  destructive: 'bg-rose-600 text-white shadow-sm shadow-rose-600/20 hover:bg-rose-700',
};

const sizes = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3',
  lg: 'h-11 rounded-md px-8',
  icon: 'h-10 w-10',
};

export function Button({
  className,
  variant = 'default',
  size = 'default',
  type = 'button',
  disabled,
  children,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
