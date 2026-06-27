import { cn } from '../../utils/cn';

export function Spinner({ className, size = 'md' }) {
  const sizeClass = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-8 w-8' : 'h-6 w-6';

  return (
    <div
      className={cn('animate-spin rounded-full border-2 border-muted border-t-primary', sizeClass, className)}
      role="status"
      aria-label="Loading"
    />
  );
}
