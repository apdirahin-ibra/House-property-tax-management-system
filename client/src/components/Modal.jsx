import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';

export function Modal({ open, title, description, onClose, children, footer }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <Card className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto">
        <div className="border-b border-slate-200 p-6">
          <h3 className="text-xl font-bold text-slate-950">{title}</h3>
          {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
        <CardContent className="p-6">{children}</CardContent>
        {footer && <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50/80 p-4">{footer}</div>}
      </Card>
    </div>
  );
}

export function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', onConfirm, onClose, loading }) {
  return (
    <Modal
      open={open}
      title={title}
      description={message}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading ? 'Working...' : confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-slate-500">This action cannot be undone.</p>
    </Modal>
  );
}
