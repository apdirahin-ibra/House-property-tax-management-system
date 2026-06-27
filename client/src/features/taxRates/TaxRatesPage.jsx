import { useMemo, useState } from 'react';
import { DataTable, FilterBar } from '../../components/DataTable';
import { ConfirmDialog, Modal } from '../../components/Modal';
import { ErrorState, LoadingState } from '../../components/Feedback';
import { PageHeader } from '../../components/PageHeader';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Select } from '../../components/ui/Select';
import { useAsync } from '../../hooks/useAsync';
import { taxRatesApi } from '../../services/resources';
import { getId } from '../../utils/format';

const emptyForm = {
  zone: 'Zone A',
  propertyType: 'Residential',
  taxYear: new Date().getFullYear(),
  rateType: 'percentage',
  rateValue: '',
};

export default function TaxRatesPage({ canEdit = true }) {
  const [zoneFilter, setZoneFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const { data, loading, error, reload } = useAsync(
    () => taxRatesApi.list({ zone: zoneFilter, taxYear: yearFilter }),
    [zoneFilter, yearFilter]
  );

  const rates = data?.data || [];

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (rate) => {
    setEditing(rate);
    setForm({
      zone: rate.zone,
      propertyType: rate.propertyType,
      taxYear: rate.taxYear,
      rateType: rate.rateType,
      rateValue: rate.rateValue,
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      const payload = { ...form, taxYear: Number(form.taxYear), rateValue: Number(form.rateValue) };
      if (editing) {
        await taxRatesApi.update(getId(editing), payload);
      } else {
        await taxRatesApi.create(payload);
      }
      setModalOpen(false);
      reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await taxRatesApi.remove(getId(deleteTarget));
      setDeleteTarget(null);
      reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const columns = useMemo(
    () => [
      { key: 'zone', label: 'Zone', render: (row) => row.zone },
      { key: 'propertyType', label: 'Property type', render: (row) => row.propertyType },
      { key: 'taxYear', label: 'Tax year', render: (row) => row.taxYear },
      { key: 'rateType', label: 'Rate type', render: (row) => row.rateType },
      {
        key: 'rateValue',
        label: 'Rate value',
        render: (row) => (row.rateType === 'percentage' ? `${row.rateValue}%` : row.rateValue),
      },
      { key: 'createdBy', label: 'Created by', render: (row) => row.createdBy?.name || '—' },
      ...(canEdit
        ? [
            {
              key: 'actions',
              label: 'Actions',
              render: (row) => (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(row)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(row)}>Delete</Button>
                </div>
              ),
            },
          ]
        : []),
    ],
    [canEdit]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tax rates"
        description={canEdit ? 'Configure tax rates by zone, type, and year.' : 'View configured tax rates.'}
        actions={canEdit ? <Button onClick={openCreate}>Add tax rate</Button> : null}
      />

      <FilterBar>
        <Select value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)} className="max-w-[140px]">
          <option value="">All zones</option>
          <option value="Zone A">Zone A</option>
          <option value="Zone B">Zone B</option>
          <option value="Zone C">Zone C</option>
        </Select>
        <Input type="number" placeholder="Tax year" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="max-w-[140px]" />
      </FilterBar>

      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && <DataTable columns={columns} rows={rates} emptyMessage="No tax rates found." />}

      {canEdit && (
        <>
          <Modal
            open={modalOpen}
            title={editing ? 'Edit tax rate' : 'Add tax rate'}
            onClose={() => setModalOpen(false)}
            footer={
              <>
                <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</Button>
              </>
            }
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && <Alert variant="destructive">{formError}</Alert>}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="zone">Zone</Label>
                  <Select id="zone" value={form.zone} onChange={(e) => setForm({ ...form, zone: e.target.value })}>
                    <option value="Zone A">Zone A</option>
                    <option value="Zone B">Zone B</option>
                    <option value="Zone C">Zone C</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property type</Label>
                  <Select id="propertyType" value={form.propertyType} onChange={(e) => setForm({ ...form, propertyType: e.target.value })}>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="taxYear">Tax year</Label>
                  <Input id="taxYear" type="number" value={form.taxYear} onChange={(e) => setForm({ ...form, taxYear: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rateType">Rate type</Label>
                  <Select id="rateType" value={form.rateType} onChange={(e) => setForm({ ...form, rateType: e.target.value })}>
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed</option>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rateValue">Rate value</Label>
                <Input id="rateValue" type="number" min="0" step="0.01" value={form.rateValue} onChange={(e) => setForm({ ...form, rateValue: e.target.value })} required />
              </div>
            </form>
          </Modal>

          <ConfirmDialog
            open={Boolean(deleteTarget)}
            title="Delete tax rate"
            message={`Delete rate for ${deleteTarget?.zone} / ${deleteTarget?.propertyType} (${deleteTarget?.taxYear})?`}
            confirmLabel="Delete"
            onConfirm={handleDelete}
            onClose={() => setDeleteTarget(null)}
            loading={saving}
          />
        </>
      )}
    </div>
  );
}
