import { useState } from 'react';
import { DataTable, FilterBar } from '../../components/DataTable';
import { ErrorState, LoadingState } from '../../components/Feedback';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Select } from '../../components/ui/Select';
import { useAsync } from '../../hooks/useAsync';
import { auditLogsApi } from '../../services/resources';
import { formatDateTime, getId } from '../../utils/format';

const ACTION_OPTIONS = [
  { value: '', label: 'All actions' },
  { value: 'CREATE', label: 'Create' },
  { value: 'UPDATE', label: 'Update' },
  { value: 'DELETE', label: 'Delete' },
];

const ENTITY_OPTIONS = [
  { value: '', label: 'All entities' },
  { value: 'User', label: 'User' },
  { value: 'Owner', label: 'Owner' },
  { value: 'Property', label: 'Property' },
  { value: 'TaxRate', label: 'Tax rate' },
  { value: 'Assessment', label: 'Assessment' },
  { value: 'Bill', label: 'Bill' },
  { value: 'Payment', label: 'Payment' },
];

export default function AuditLogsPage() {
  const [action, setAction] = useState('');
  const [entityType, setEntityType] = useState('');
  const [search, setSearch] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const { data, loading, error, reload } = useAsync(
    () => auditLogsApi.list({ action, entityType, search, from, to }),
    [action, entityType, search, from, to]
  );

  const logs = data?.data || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description="Review important system actions recorded for accountability."
        actions={
          <Button variant="outline" onClick={reload}>
            Refresh
          </Button>
        }
      />

      <FilterBar>
        <div className="min-w-[180px] flex-1">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search description or action"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="min-w-[160px] flex-1">
          <Label htmlFor="action">Action</Label>
          <Select id="action" value={action} onChange={(e) => setAction(e.target.value)} options={ACTION_OPTIONS} />
        </div>
        <div className="min-w-[160px] flex-1">
          <Label htmlFor="entityType">Entity</Label>
          <Select
            id="entityType"
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
            options={ENTITY_OPTIONS}
          />
        </div>
        <div className="min-w-[160px] flex-1">
          <Label htmlFor="from">From</Label>
          <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div className="min-w-[160px] flex-1">
          <Label htmlFor="to">To</Label>
          <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
      </FilterBar>

      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={reload} />}

      {!loading && !error && (
        <DataTable
          columns={[
            { key: 'createdAt', label: 'When', render: (row) => formatDateTime(row.createdAt) },
            {
              key: 'actor',
              label: 'Actor',
              render: (row) =>
                row.actorId ? `${row.actorId.name} (${row.actorId.role})` : '—',
            },
            { key: 'action', label: 'Action' },
            { key: 'entityType', label: 'Entity' },
            {
              key: 'entityId',
              label: 'Entity ID',
              render: (row) => (row.entityId ? String(row.entityId).slice(-8) : '—'),
            },
            { key: 'description', label: 'Description' },
            { key: 'ipAddress', label: 'IP', render: (row) => row.ipAddress || '—' },
          ]}
          rows={logs.map((log) => ({ ...log, id: getId(log) }))}
          emptyMessage="No audit log entries match the selected filters."
        />
      )}
    </div>
  );
}
