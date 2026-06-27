import { useMemo } from 'react';
import { DataTable } from '../../components/DataTable';
import { ErrorState, LoadingState } from '../../components/Feedback';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '../../components/ui/Button';
import { useAsync } from '../../hooks/useAsync';
import { paymentsApi } from '../../services/resources';
import { downloadPdf } from '../../utils/download';
import { formatCurrency, formatDate, getId } from '../../utils/format';

export default function OwnerPaymentsPage() {
  const { data, loading, error, reload } = useAsync(() => paymentsApi.ownerList(), []);

  const payments = data?.data || [];

  const columns = useMemo(
    () => [
      { key: 'billNo', label: 'Bill', render: (row) => row.billId?.billNo || '—' },
      { key: 'property', label: 'Property', render: (row) => row.billId?.assessmentId?.propertyId?.propertyCode || '—' },
      { key: 'amountPaid', label: 'Amount', render: (row) => formatCurrency(row.amountPaid) },
      { key: 'method', label: 'Method', render: (row) => row.method.replace('_', ' ') },
      { key: 'paymentDate', label: 'Date', render: (row) => formatDate(row.paymentDate) },
      {
        key: 'receipt',
        label: 'Receipt',
        render: (row) =>
          row.receipt ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => downloadPdf(`/receipts/${getId(row.receipt)}/pdf`, `${row.receipt.receiptNo}.pdf`)}
            >
              Download
            </Button>
          ) : (
            '—'
          ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <PageHeader title="My payments" description="Your payment history." />
      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && <DataTable columns={columns} rows={payments} emptyMessage="No payments found." />}
    </div>
  );
}
