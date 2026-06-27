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
import { ownersApi, propertiesApi } from '../../services/resources';
import { formatCurrency, formatDateTime, getId } from '../../utils/format';

const emptyForm = {
  ownerId: '',
  district: '',
  zone: 'Zone A',
  propertyType: 'Residential',
  sizeSqm: '',
  assessedValue: '',
  usageStatus: 'occupied',
  status: 'active',
};

export default function PropertiesPage({ canEdit = true }) {
  const [search, setSearch] = useState('');
  const [zoneFilter, setZoneFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [owners, setOwners] = useState([]);

  const { data, loading, error, reload } = useAsync(
    () => propertiesApi.list({ search, zone: zoneFilter, propertyType: typeFilter, status: statusFilter }),
    [search, zoneFilter, typeFilter, statusFilter]
  );

  useEffect(() => {
    ownersApi.list().then((res) => setOwners(res.data || [])).catch(() => setOwners([]));
  }, []);

  const properties = data?.data || [];

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (property) => {
    setEditing(property);
    setForm({
      ownerId: getId(property.ownerId),
      district: property.district,
      zone: property.zone,
      propertyType: property.propertyType,
      sizeSqm: property.sizeSqm ?? '',
      assessedValue: property.assessedValue,
      usageStatus: property.usageStatus,
      status: property.status,
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      const payload = {
        ...form,
        sizeSqm: form.sizeSqm ? Number(form.sizeSqm) : undefined,
        assessedValue: Number(form.assessedValue),
      };
      if (editing) {
        await propertiesApi.update(getId(editing), payload);
      } else {
        await propertiesApi.create(payload);
      }
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
      { key: 'code', label: 'Code', render: (row) => row.propertyCode },
      { key: 'owner', label: 'Owner', render: (row) => row.ownerId?.fullName || '—' },
      { key: 'district', label: 'District', render: (row) => row.district },
      { key: 'zone', label: 'Zone', render: (row) => row.zone },
      { key: 'type', label: 'Type', render: (row) => row.propertyType },
      { key: 'value', label: 'Assessed value', render: (row) => formatCurrency(row.assessedValue) },
      { key: 'usage', label: 'Usage', render: (row) => <StatusBadge status={row.usageStatus} /> },
      { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
      ...(canEdit
        ? [
            {
              key: 'actions',
              label: 'Actions',
              render: (row) => (
                <Button size="sm" variant="outline" onClick={() => openEdit(row)}>
                  Edit
                </Button>
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
        title="Properties"
        description={canEdit ? 'Register and update property records.' : 'View all registered properties.'}
        actions={canEdit ? <Button onClick={openCreate}>Register property</Button> : null}
      />

      <FilterBar>
        <Input placeholder="Search code, district, zone..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <Select value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)} className="max-w-[140px]">
          <option value="">All zones</option>
          <option value="Zone A">Zone A</option>
          <option value="Zone B">Zone B</option>
          <option value="Zone C">Zone C</option>
        </Select>
        <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="max-w-[160px]">
          <option value="">All types</option>
          <option value="Residential">Residential</option>
          <option value="Commercial">Commercial</option>
          <option value="Industrial">Industrial</option>
        </Select>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="max-w-[140px]">
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
      </FilterBar>

      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && <DataTable columns={columns} rows={properties} emptyMessage="No properties found." />}

      {canEdit && (
        <Modal
          open={modalOpen}
          title={editing ? 'Edit property' : 'Register property'}
          onClose={() => setModalOpen(false)}
          footer={
            <>
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Register'}</Button>
            </>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && <Alert variant="destructive">{formError}</Alert>}
            <div className="space-y-2">
              <Label htmlFor="ownerId">Owner</Label>
              <Select id="ownerId" value={form.ownerId} onChange={(e) => setForm({ ...form, ownerId: e.target.value })} required>
                <option value="">Select owner</option>
                {owners.map((owner) => (
                  <option key={getId(owner)} value={getId(owner)}>{owner.fullName}</option>
                ))}
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input id="district" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zone">Zone</Label>
                <Select id="zone" value={form.zone} onChange={(e) => setForm({ ...form, zone: e.target.value })}>
                  <option value="Zone A">Zone A</option>
                  <option value="Zone B">Zone B</option>
                  <option value="Zone C">Zone C</option>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="propertyType">Property type</Label>
                <Select id="propertyType" value={form.propertyType} onChange={(e) => setForm({ ...form, propertyType: e.target.value })}>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Industrial">Industrial</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sizeSqm">Size (sqm)</Label>
                <Input id="sizeSqm" type="number" min="0" value={form.sizeSqm} onChange={(e) => setForm({ ...form, sizeSqm: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="assessedValue">Assessed value</Label>
                <Input id="assessedValue" type="number" min="0" step="0.01" value={form.assessedValue} onChange={(e) => setForm({ ...form, assessedValue: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="usageStatus">Usage status</Label>
                <Select id="usageStatus" value={form.usageStatus} onChange={(e) => setForm({ ...form, usageStatus: e.target.value })}>
                  <option value="occupied">Occupied</option>
                  <option value="vacant">Vacant</option>
                  <option value="rented">Rented</option>
                </Select>
              </div>
            </div>
            {editing && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select id="status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Select>
              </div>
            )}
          </form>
        </Modal>
      )}
    </div>
  );
}
