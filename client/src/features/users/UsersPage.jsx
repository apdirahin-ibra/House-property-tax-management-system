import { useMemo, useState } from 'react';
import { DataTable, FilterBar } from '../../components/DataTable';
import { ErrorState, LoadingState } from '../../components/Feedback';
import { ConfirmDialog, Modal } from '../../components/Modal';
import { PageHeader } from '../../components/PageHeader';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Select } from '../../components/ui/Select';
import { StatusBadge } from '../../components/ui/Badge';
import { useAsync } from '../../hooks/useAsync';
import { usersApi } from '../../services/resources';
import { formatDateTime, getId } from '../../utils/format';

const emptyForm = { name: '', email: '', password: '', role: 'officer', status: 'active' };

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deactivateTarget, setDeactivateTarget] = useState(null);

  const { data, loading, error, reload } = useAsync(
    () => usersApi.list({ search, role: roleFilter, status: statusFilter }),
    [search, roleFilter, statusFilter]
  );

  const users = data?.data || [];

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (user) => {
    setEditing(user);
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      status: user.status,
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      const payload = { name: form.name, email: form.email, role: form.role, status: form.status };
      if (form.password) payload.password = form.password;

      if (editing) {
        await usersApi.update(getId(editing), payload);
      } else {
        if (!form.password) {
          setFormError('Password is required for new users');
          setSaving(false);
          return;
        }
        await usersApi.create({ ...payload, password: form.password });
      }
      setModalOpen(false);
      reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async () => {
    setSaving(true);
    try {
      await usersApi.deactivate(getId(deactivateTarget));
      setDeactivateTarget(null);
      reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const columns = useMemo(
    () => [
      { key: 'name', label: 'Name', render: (row) => row.name },
      { key: 'email', label: 'Email', render: (row) => row.email },
      { key: 'role', label: 'Role', render: (row) => <StatusBadge status={row.role} /> },
      { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
      { key: 'created', label: 'Created', render: (row) => formatDateTime(row.createdAt) },
      {
        key: 'actions',
        label: 'Actions',
        render: (row) => (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => openEdit(row)}>
              Edit
            </Button>
            {row.status === 'active' && (
              <Button size="sm" variant="destructive" onClick={() => setDeactivateTarget(row)}>
                Deactivate
              </Button>
            )}
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage admin, officer, and owner accounts."
        actions={<Button onClick={openCreate}>Add user</Button>}
      />

      <FilterBar>
        <Input
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="max-w-[160px]">
          <option value="">All roles</option>
          <option value="admin">Admin</option>
          <option value="officer">Officer</option>
          <option value="owner">Owner</option>
        </Select>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="max-w-[160px]">
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
      </FilterBar>

      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && <DataTable columns={columns} rows={users} emptyMessage="No users found." />}

      <Modal
        open={modalOpen}
        title={editing ? 'Edit user' : 'Create user'}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && <Alert variant="destructive">{formError}</Alert>}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{editing ? 'New password (optional)' : 'Password'}</Label>
            <Input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select id="role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="admin">Admin</option>
                <option value="officer">Officer</option>
                <option value="owner">Owner</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select id="status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deactivateTarget)}
        title="Deactivate user"
        message={`Deactivate ${deactivateTarget?.email}? They will no longer be able to sign in.`}
        confirmLabel="Deactivate"
        onConfirm={handleDeactivate}
        onClose={() => setDeactivateTarget(null)}
        loading={saving}
      />
    </div>
  );
}
