import { useEffect, useMemo, useState } from 'react';
import { DataTable, FilterBar } from '../../components/DataTable';
import { ErrorState, LoadingState } from '../../components/Feedback';
import { Modal } from '../../components/Modal';
import { PageHeader } from '../../components/PageHeader';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Select } from '../../components/ui/Select';
import { useAsync } from '../../hooks/useAsync';
import { billsApi, paymentsApi } from '../../services/resources';
import { downloadPdf } from '../../utils/download';
import { formatCurrency, formatDate, getId } from '../../utils/format';

export default function PaymentsPage({ canCreate = true }) {
  const [methodFilter, setMethodFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [unpaidBills, setUnpaidBills] = useState([]);
  const [form, setForm] = useState({
    billId: '',
    amountPaid: '',
    method: 'cash',
    referenceNo: '',
    paymentDate: new Date().toISOString().slice(0, 10),
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const { data, loading, error, reload } = useAsync(
    () => paymentsApi.list({ method: methodFilter }),
    [methodFilter]
  );

  useEffect(() => {
    billsApi.list().then((res) => {
      const open = (res.data || []).filter((bill) => bill.balance > 0 && bill.status !== 'cancelled');
      setUnpaidBills(open);
    }).catch(() => setUnpaidBills([]));
  }, [modalOpen]);

  const payments = data?.data || [];

  const handleCreate = async (event) => {
    event.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      await paymentsApi.create({
        ...form,
        amountPaid: Number(form.amountPaid),
        referenceNo: form.referenceNo || undefined,
      });
      setModalOpen(false);
      reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const selectedBill = unpaidBills.find((bill) => getId(bill) === form.billId);

  const columns = useMemo(
    () => [
      { key: 'billNo', label: 'Bill', render: (row) => row.billId?.billNo || '—' },
      { key: 'property', label: 'Property', render: (row) => row.billId?.assessmentId?.propertyId?.propertyCode || '—' },
      { key: 'owner', label: 'Owner', render: (row) => row.billId?.assessmentId?.propertyId?.ownerId?.fullName || '—' },
      { key: 'amountPaid', label: 'Amount', render: (row) => formatCurrency(row.amountPaid) },
      { key: 'method', label: 'Method', render: (row) => row.method.replace('_', ' ') },
      { key: 'referenceNo', label: 'Reference', render: (row) => row.referenceNo || '—' },
      { key: 'paymentDate', label: 'Date', render: (row) => formatDate(row.paymentDate) },
      { key: 'recordedBy', label: 'Recorded by', render: (row) => row.recordedBy?.name || '—' },
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
      <PageHeader
        title="Payments"
        description="View payment history and record new payments."
        actions={canCreate ? <Button onClick={() => { setFormError(''); setModalOpen(true); }}>Record payment</Button> : null}
      />

      <FilterBar>
        <Select value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)} className="max-w-[180px]">
          <option value="">All methods</option>
          <option value="cash">Cash</option>
          <option value="bank">Bank</option>
          <option value="mobile_money">Mobile money</option>
          <option value="other">Other</option>
        </Select>
      </FilterBar>

      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && <DataTable columns={columns} rows={payments} emptyMessage="No payments found." />}

      {canCreate && (
        <Modal
          open={modalOpen}
          title="Record payment"
          onClose={() => setModalOpen(false)}
          footer={
            <>
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={saving}>{saving ? 'Saving...' : 'Record payment'}</Button>
            </>
          }
        >
          <form onSubmit={handleCreate} className="space-y-4">
            {formError && <Alert variant="destructive">{formError}</Alert>}
            <div className="space-y-2">
              <Label htmlFor="billId">Bill</Label>
              <Select id="billId" value={form.billId} onChange={(e) => setForm({ ...form, billId: e.target.value })} required>
                <option value="">Select bill</option>
                {unpaidBills.map((bill) => (
                  <option key={getId(bill)} value={getId(bill)}>
                    {bill.billNo} — balance {formatCurrency(bill.balance)}
                  </option>
                ))}
              </Select>
            </div>
            {selectedBill && (
              <p className="text-sm text-muted-foreground">Outstanding balance: {formatCurrency(selectedBill.balance)}</p>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="amountPaid">Amount paid</Label>
                <Input id="amountPaid" type="number" min="0.01" step="0.01" value={form.amountPaid} onChange={(e) => setForm({ ...form, amountPaid: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="method">Method</Label>
                <Select id="method" value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}>
                  <option value="cash">Cash</option>
                  <option value="bank">Bank</option>
                  <option value="mobile_money">Mobile money</option>
                  <option value="other">Other</option>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="referenceNo">Reference no. (optional)</Label>
                <Input id="referenceNo" value={form.referenceNo} onChange={(e) => setForm({ ...form, referenceNo: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentDate">Payment date</Label>
                <Input id="paymentDate" type="date" value={form.paymentDate} onChange={(e) => setForm({ ...form, paymentDate: e.target.value })} required />
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
