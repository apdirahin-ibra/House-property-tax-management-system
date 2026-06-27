import { Alert } from './ui/Alert';
import { Spinner } from './ui/Spinner';

export function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <Spinner size="lg" />
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <Alert variant="destructive" className="flex items-center justify-between gap-4">
      <span>{message}</span>
      {onRetry && (
        <button type="button" onClick={onRetry} className="text-sm underline">
          Retry
        </button>
      )}
    </Alert>
  );
}

export function EmptyState({ message = 'No records found.' }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white/70 p-10 text-center">
      <p className="text-sm font-semibold text-slate-500">{message}</p>
    </div>
  );
}
