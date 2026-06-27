import { useMemo, useState } from 'react';
import { DataTable, FilterBar } from '../../components/DataTable';
import { ErrorState, LoadingState } from '../../components/Feedback';
import { Modal } from '../../components/Modal';
import { PageHeader } from '../../components/PageHeader';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { useAsync } from '../../hooks/useAsync';
import { ownersApi } from '../../services/resources';
import { formatDateTime, getId } from '../../utils/format';

const emptyForm = { fullName: '', phone: '', email: '', nationalId: '', address: '' };

export default function OwnersPage({ canEdit = true }) {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const { data, loading, error, reload } = useAsync(
    () => ownersApi.list({ search }),
    [search]
  );

  const owners = data?.data || [];

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (owner) => {
    setEditing(owner);
    setForm({
      fullName: owner.fullName,
      phone: owner.phone,
      email: owner.email || '',
      nationalId: owner.nationalId || '',
      address: owner.address || '',
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
        email: form.email || undefined,
        nationalId: form.nationalId || undefined,
      };
      if (editing) {
        await ownersApi.update(getId(editing), payload);
      } else {
        await ownersApi.create(payload);
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
      { key: 'fullName', label: 'Full name', render: (row) => row.fullName },
      { key: 'phone', label: 'Phone', render: (row) => row.phone },
      { key: 'linkedUser', label: 'Linked account', render: (row) => row.userId?.email || 'Not linked' },
      { key: 'email', label: 'Email', render: (row) => row.email || '—' },
      { key: 'nationalId', label: 'National ID', render: (row) => row.nationalId || '—' },
      { key: 'address', label: 'Address', render: (row) => row.address || '—' },
      { key: 'created', label: 'Registered', render: (row) => formatDateTime(row.createdAt) },
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
        title="Owners"
        description={canEdit ? 'Register and manage property owners.' : 'View registered property owners.'}
        actions={canEdit ? <Button onClick={openCreate}>Register owner</Button> : null}
      />

      <FilterBar>
        <Input
          placeholder="Search name, phone, email, or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </FilterBar>

      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && <DataTable columns={columns} rows={owners} emptyMessage="No owners found." />}

      {canEdit && (
        <Modal
          open={modalOpen}
          title={editing ? 'Edit owner' : 'Register owner'}
          onClose={() => setModalOpen(false)}
          footer={
            <>
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={saving}>
                {saving ? 'Saving...' : editing ? 'Update' : 'Register'}
              </Button>
            </>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && <Alert variant="destructive">{formError}</Alert>}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (optional)</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationalId">National ID (optional)</Label>
              <Input id="nationalId" value={form.nationalId} onChange={(e) => setForm({ ...form, nationalId: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
