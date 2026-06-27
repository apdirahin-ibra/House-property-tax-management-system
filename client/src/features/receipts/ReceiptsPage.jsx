import { useMemo, useState } from 'react';
import { DataTable, FilterBar } from '../../components/DataTable';
import { ErrorState, LoadingState } from '../../components/Feedback';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '../../components/ui/Button';
import { useAsync } from '../../hooks/useAsync';
import { paymentsApi } from '../../services/resources';
import { downloadPdf } from '../../utils/download';
import { formatCurrency, formatDate, getId } from '../../utils/format';

export default function ReceiptsPage({ ownerMode = false }) {
  const [downloading, setDownloading] = useState(null);

  const { data, loading, error, reload } = useAsync(
    () => (ownerMode ? paymentsApi.ownerList() : paymentsApi.list()),
    [ownerMode]
  );

  const receipts = (data?.data || []).filter((payment) => payment.receipt);

  const handleDownload = async (payment) => {
    const receiptId = getId(payment.receipt);
    setDownloading(receiptId);
    try {
      await downloadPdf(`/receipts/${receiptId}/pdf`, `${payment.receipt.receiptNo}.pdf`);
    } catch (err) {
      alert(err.message);
    } finally {
      setDownloading(null);
    }
  };

  const columns = useMemo(
    () => [
      { key: 'receiptNo', label: 'Receipt no.', render: (row) => row.receipt.receiptNo },
      { key: 'billNo', label: 'Bill', render: (row) => row.billId?.billNo || '—' },
      { key: 'property', label: 'Property', render: (row) => row.billId?.assessmentId?.propertyId?.propertyCode || '—' },
      { key: 'amountPaid', label: 'Amount', render: (row) => formatCurrency(row.amountPaid) },
      { key: 'paymentDate', label: 'Payment date', render: (row) => formatDate(row.paymentDate) },
      {
        key: 'actions',
        label: 'Actions',
        render: (row) => (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDownload(row)}
            disabled={downloading === getId(row.receipt)}
          >
            {downloading === getId(row.receipt) ? 'Downloading...' : 'Download PDF'}
          </Button>
        ),
      },
    ],
    [downloading]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={ownerMode ? 'My receipts' : 'Receipts'}
        description="Download payment receipt PDFs."
      />

      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && (
        <DataTable columns={columns} rows={receipts} emptyMessage="No receipts found." />
      )}
    </div>
  );
}
