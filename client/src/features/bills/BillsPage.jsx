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
import { StatusBadge } from '../../components/ui/Badge';
import { useAsync } from '../../hooks/useAsync';
import { assessmentsApi, billsApi } from '../../services/resources';
import { downloadPdf } from '../../utils/download';
import { formatCurrency, formatDate, getId } from '../../utils/format';

export default function BillsPage({ canCreate = true }) {
  const [statusFilter, setStatusFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [assessments, setAssessments] = useState([]);
  const [form, setForm] = useState({ assessmentId: '', dueDate: '' });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(null);

  const { data, loading, error, reload } = useAsync(
    () => billsApi.list({ status: statusFilter, year: yearFilter }),
    [statusFilter, yearFilter]
  );

  useEffect(() => {
    assessmentsApi.list().then((res) => setAssessments(res.data || [])).catch(() => setAssessments([]));
  }, []);

  const bills = data?.data || [];

  const handleCreate = async (event) => {
    event.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      await billsApi.create(form);
      setModalOpen(false);
      setForm({ assessmentId: '', dueDate: '' });
      reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

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

  const columns = useMemo(
    () => [
      { key: 'billNo', label: 'Bill no.', render: (row) => row.billNo },
      {
        key: 'property',
        label: 'Property',
        render: (row) => row.assessmentId?.propertyId?.propertyCode || '—',
      },
      {
        key: 'owner',
        label: 'Owner',
        render: (row) => row.assessmentId?.propertyId?.ownerId?.fullName || '—',
      },
      { key: 'dueDate', label: 'Due date', render: (row) => formatDate(row.dueDate) },
      { key: 'amountDue', label: 'Amount due', render: (row) => formatCurrency(row.amountDue) },
      { key: 'amountPaid', label: 'Paid', render: (row) => formatCurrency(row.amountPaid) },
      { key: 'balance', label: 'Balance', render: (row) => formatCurrency(row.balance) },
      { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
      {
        key: 'actions',
        label: 'Actions',
        render: (row) => (
          <Button size="sm" variant="outline" onClick={() => handleDownload(row)} disabled={downloading === getId(row)}>
            {downloading === getId(row) ? 'Downloading...' : 'PDF'}
          </Button>
        ),
      },
    ],
    [downloading]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bills"
        description="View tax bills and download PDF copies."
        actions={canCreate ? <Button onClick={() => { setFormError(''); setModalOpen(true); }}>Create bill</Button> : null}
      />

      <FilterBar>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="max-w-[160px]">
          <option value="">All statuses</option>
          <option value="unpaid">Unpaid</option>
          <option value="partial">Partial</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </Select>
        <Input type="number" placeholder="Tax year" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="max-w-[140px]" />
      </FilterBar>

      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && <DataTable columns={columns} rows={bills} emptyMessage="No bills found." />}

      {canCreate && (
        <Modal
          open={modalOpen}
          title="Create bill"
          onClose={() => setModalOpen(false)}
          footer={
            <>
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={saving}>{saving ? 'Creating...' : 'Create bill'}</Button>
            </>
          }
        >
          <form onSubmit={handleCreate} className="space-y-4">
            {formError && <Alert variant="destructive">{formError}</Alert>}
            <div className="space-y-2">
              <Label htmlFor="assessmentId">Assessment</Label>
              <Select id="assessmentId" value={form.assessmentId} onChange={(e) => setForm({ ...form, assessmentId: e.target.value })} required>
                <option value="">Select assessment</option>
                {assessments.map((assessment) => (
                  <option key={getId(assessment)} value={getId(assessment)}>
                    {assessment.propertyId?.propertyCode} — {assessment.taxYear} ({formatCurrency(assessment.totalDue)})
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due date</Label>
              <Input id="dueDate" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
