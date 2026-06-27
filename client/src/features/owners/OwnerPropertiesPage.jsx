import { useMemo, useState } from 'react';
import { DataTable, FilterBar } from '../../components/DataTable';
import { ErrorState, LoadingState } from '../../components/Feedback';
import { PageHeader } from '../../components/PageHeader';
import { Input } from '../../components/ui/Input';
import { StatusBadge } from '../../components/ui/Badge';
import { useAsync } from '../../hooks/useAsync';
import { propertiesApi } from '../../services/resources';
import { formatCurrency } from '../../utils/format';

export default function OwnerPropertiesPage() {
  const [search, setSearch] = useState('');

  const { data, loading, error, reload } = useAsync(
    () => propertiesApi.ownerList({ search }),
    [search]
  );

  const properties = data?.data || [];

  const columns = useMemo(
    () => [
      { key: 'propertyCode', label: 'Code', render: (row) => row.propertyCode },
      { key: 'district', label: 'District', render: (row) => row.district },
      { key: 'zone', label: 'Zone', render: (row) => row.zone },
      { key: 'propertyType', label: 'Type', render: (row) => row.propertyType },
      { key: 'assessedValue', label: 'Assessed value', render: (row) => formatCurrency(row.assessedValue) },
      { key: 'usageStatus', label: 'Usage', render: (row) => <StatusBadge status={row.usageStatus} /> },
      { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <PageHeader title="My properties" description="Properties registered under your account." />
      <FilterBar>
        <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
      </FilterBar>
      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && <DataTable columns={columns} rows={properties} emptyMessage="No properties found." />}
    </div>
  );
}
