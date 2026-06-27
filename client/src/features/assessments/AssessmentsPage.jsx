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
import { assessmentsApi, propertiesApi } from '../../services/resources';
import { formatCurrency, formatDateTime, getId } from '../../utils/format';

export default function AssessmentsPage() {
  const [taxYear, setTaxYear] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState({
    propertyId: '',
    taxYear: new Date().getFullYear(),
    penalty: 0,
    discount: 0,
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const { data, loading, error, reload } = useAsync(
    () => assessmentsApi.list({ taxYear }),
    [taxYear]
  );

  useEffect(() => {
    propertiesApi.list({ status: 'active' }).then((res) => setProperties(res.data || [])).catch(() => setProperties([]));
  }, []);

  const assessments = data?.data || [];

  const handleGenerate = async (event) => {
    event.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      await assessmentsApi.generate({
        propertyId: form.propertyId,
        taxYear: Number(form.taxYear),
        penalty: Number(form.penalty) || 0,
        discount: Number(form.discount) || 0,
      });
      setModalOpen(false);
      reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const columns = useMemo(
    () => [
      { key: 'property', label: 'Property', render: (row) => row.propertyId?.propertyCode || '—' },
      { key: 'owner', label: 'Owner', render: (row) => row.propertyId?.ownerId?.fullName || '—' },
      { key: 'taxYear', label: 'Tax year', render: (row) => row.taxYear },
      { key: 'baseTax', label: 'Base tax', render: (row) => formatCurrency(row.baseTax) },
      { key: 'penalty', label: 'Penalty', render: (row) => formatCurrency(row.penalty) },
      { key: 'discount', label: 'Discount', render: (row) => formatCurrency(row.discount) },
      { key: 'totalDue', label: 'Total due', render: (row) => formatCurrency(row.totalDue) },
      { key: 'assessedBy', label: 'Assessed by', render: (row) => row.assessedBy?.name || '—' },
      { key: 'created', label: 'Created', render: (row) => formatDateTime(row.createdAt) },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assessments"
        description="Generate annual tax assessments from configured rates."
        actions={<Button onClick={() => { setFormError(''); setModalOpen(true); }}>Generate assessment</Button>}
      />

      <FilterBar>
        <Input type="number" placeholder="Filter by tax year" value={taxYear} onChange={(e) => setTaxYear(e.target.value)} className="max-w-[180px]" />
      </FilterBar>

      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && <DataTable columns={columns} rows={assessments} emptyMessage="No assessments found." />}

      <Modal
        open={modalOpen}
        title="Generate assessment"
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleGenerate} disabled={saving}>{saving ? 'Generating...' : 'Generate'}</Button>
          </>
        }
      >
        <form onSubmit={handleGenerate} className="space-y-4">
          {formError && <Alert variant="destructive">{formError}</Alert>}
          <div className="space-y-2">
            <Label htmlFor="propertyId">Property</Label>
            <Select id="propertyId" value={form.propertyId} onChange={(e) => setForm({ ...form, propertyId: e.target.value })} required>
              <option value="">Select property</option>
              {properties.map((property) => (
                <option key={getId(property)} value={getId(property)}>
                  {property.propertyCode} — {property.zone} / {property.propertyType}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="taxYear">Tax year</Label>
              <Input id="taxYear" type="number" value={form.taxYear} onChange={(e) => setForm({ ...form, taxYear: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="penalty">Penalty</Label>
              <Input id="penalty" type="number" min="0" step="0.01" value={form.penalty} onChange={(e) => setForm({ ...form, penalty: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Discount</Label>
              <Input id="discount" type="number" min="0" step="0.01" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
