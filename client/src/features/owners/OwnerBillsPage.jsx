import { useMemo, useState } from 'react';
import { DataTable, FilterBar } from '../../components/DataTable';
import { ErrorState, LoadingState } from '../../components/Feedback';
import { Modal } from '../../components/Modal';
import { PageHeader } from '../../components/PageHeader';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Select } from '../../components/ui/Select';
import { StatusBadge } from '../../components/ui/Badge';
import { useAsync } from '../../hooks/useAsync';
import { billsApi, paymentsApi } from '../../services/resources';
import { downloadPdf } from '../../utils/download';
import { formatCurrency, formatDate, getId } from '../../utils/format';

export default function OwnerBillsPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [downloading, setDownloading] = useState(null);
  const [payingBill, setPayingBill] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    provider: 'evc',
    phone: '',
    amountPaid: '',
    referenceNo: '',
  });
  const [paymentError, setPaymentError] = useState('');
  const [savingPayment, setSavingPayment] = useState(false);

  const { data, loading, error, reload } = useAsync(
    () => billsApi.ownerList({ status: statusFilter }),
    [statusFilter]
  );

  const bills = data?.data || [];

  const handleDownload = async (bill) => {
    setDownloading(getId(bill));
    try {
      await downloadPdf(`/bills/${getId(bill)}/pdf`, `${bill.billNo}.pdf`);
    } catch (err) {
      alert(err.message);
    } finally {
      setDownloading(null);
    }
  };

  const openPayNow = (bill) => {
    setPayingBill(bill);
    setPaymentError('');
    setPaymentForm({
      provider: 'evc',
      phone: '',
      amountPaid: String(bill.balance || bill.amountDue || ''),
      referenceNo: '',
    });
  };

  const handlePayNow = async (event) => {
    event.preventDefault();
    setPaymentError('');
    setSavingPayment(true);

    try {
      await paymentsApi.ownerPay({
        billId: getId(payingBill),
        provider: paymentForm.provider,
        phone: paymentForm.phone,
        amountPaid: Number(paymentForm.amountPaid),
        referenceNo: paymentForm.referenceNo || undefined,
      });
      setPayingBill(null);
      reload();
    } catch (err) {
      setPaymentError(err.message || 'Payment failed');
    } finally {
      setSavingPayment(false);
    }
  };

  const columns = useMemo(
    () => [
      { key: 'billNo', label: 'Bill no.', render: (row) => row.billNo },
      { key: 'property', label: 'Property', render: (row) => row.assessmentId?.propertyId?.propertyCode || '—' },
      { key: 'dueDate', label: 'Due date', render: (row) => formatDate(row.dueDate) },
      { key: 'amountDue', label: 'Amount due', render: (row) => formatCurrency(row.amountDue) },
      { key: 'balance', label: 'Balance', render: (row) => formatCurrency(row.balance) },
      { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
      {
        key: 'actions',
        label: 'Actions',
        render: (row) => (
          <div className="flex flex-wrap gap-2">
            {row.balance > 0 && row.status !== 'cancelled' && (
              <Button size="sm" onClick={() => openPayNow(row)}>
                Pay Now
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => handleDownload(row)} disabled={downloading === getId(row)}>
              {downloading === getId(row) ? 'Downloading...' : 'PDF'}
            </Button>
          </div>
        ),
      },
    ],
    [downloading]
  );

  return (
    <div className="space-y-6">
      <PageHeader title="My bills" description="View bills and outstanding balances." />
      <FilterBar>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="max-w-[160px]">
          <option value="">All statuses</option>
          <option value="unpaid">Unpaid</option>
          <option value="partial">Partial</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </Select>
      </FilterBar>
      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && <DataTable columns={columns} rows={bills} emptyMessage="No bills found." />}

      <Modal
        open={Boolean(payingBill)}
        title="Pay bill"
        description={payingBill ? `${payingBill.billNo} - balance ${formatCurrency(payingBill.balance)}` : ''}
        onClose={() => setPayingBill(null)}
        footer={
          <>
            <Button variant="outline" onClick={() => setPayingBill(null)} disabled={savingPayment}>
              Cancel
            </Button>
            <Button onClick={handlePayNow} disabled={savingPayment}>
              {savingPayment ? 'Processing...' : 'Pay Now'}
            </Button>
          </>
        }
      >
        <form onSubmit={handlePayNow} className="space-y-4">
          {paymentError && <Alert variant="destructive">{paymentError}</Alert>}

          <div className="space-y-2">
            <Label htmlFor="provider">Payment service</Label>
            <Select
              id="provider"
              value={paymentForm.provider}
              onChange={(e) => setPaymentForm({ ...paymentForm, provider: e.target.value })}
            >
              <option value="evc">EVC Plus</option>
              <option value="edahab">eDahab</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Payment phone</Label>
            <Input
              id="phone"
              placeholder="+25261..."
              value={paymentForm.phone}
              onChange={(e) => setPaymentForm({ ...paymentForm, phone: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amountPaid">Amount</Label>
            <Input
              id="amountPaid"
              type="number"
              min="0.01"
              step="0.01"
              max={payingBill?.balance || undefined}
              value={paymentForm.amountPaid}
              onChange={(e) => setPaymentForm({ ...paymentForm, amountPaid: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="referenceNo">Transaction reference (optional)</Label>
            <Input
              id="referenceNo"
              placeholder="Leave blank to auto-generate"
              value={paymentForm.referenceNo}
              onChange={(e) => setPaymentForm({ ...paymentForm, referenceNo: e.target.value })}
            />
          </div>

          <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs font-medium text-amber-800">
            Demo payment only. No real money is transferred through EVC Plus or eDahab.
          </p>
        </form>
      </Modal>
    </div>
  );
}
