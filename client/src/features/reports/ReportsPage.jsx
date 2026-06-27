import { useMemo, useState } from 'react';
import { DataTable, FilterBar } from '../../components/DataTable';
import { ErrorState, LoadingState } from '../../components/Feedback';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Select } from '../../components/ui/Select';
import { StatusBadge } from '../../components/ui/Badge';
import { useAsync } from '../../hooks/useAsync';
import { reportsApi } from '../../services/resources';
import { downloadPdf } from '../../utils/download';
import { formatCurrency, formatDate } from '../../utils/format';

const TABS = [
  { id: 'summary', label: 'Summary' },
  { id: 'collections', label: 'Collections' },
  { id: 'outstanding', label: 'Outstanding' },
  { id: 'by-zone', label: 'By Zone' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'paid', label: 'Paid' },
  { value: 'unpaid', label: 'Unpaid' },
  { value: 'partial', label: 'Partial' },
  { value: 'overdue', label: 'Overdue' },
];

const METHOD_OPTIONS = [
  { value: '', label: 'All methods' },
  { value: 'cash', label: 'Cash' },
  { value: 'bank', label: 'Bank' },
  { value: 'mobile_money', label: 'Mobile money' },
  { value: 'other', label: 'Other' },
];

function StatCard({ label, value }) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 to-emerald-500" />
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold text-slate-500">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-black text-slate-950">{value}</p>
      </CardContent>
    </Card>
  );
}

function TabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? 'bg-slate-950 text-white shadow-sm shadow-slate-950/20'
          : 'bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 hover:text-slate-950'
      }`}
    >
      {children}
    </button>
  );
}

export default function ReportsPage() {
  const [tab, setTab] = useState('summary');
  const [taxYear, setTaxYear] = useState('');
  const [zone, setZone] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [status, setStatus] = useState('');
  const [method, setMethod] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [downloadingAll, setDownloadingAll] = useState(false);

  const filters = useMemo(
    () => ({
      taxYear,
      zone,
      propertyType,
      status,
      method,
      from,
      to,
    }),
    [taxYear, zone, propertyType, status, method, from, to]
  );

  const { data, loading, error, reload } = useAsync(() => {
    if (tab === 'summary') return reportsApi.summary(filters);
    if (tab === 'collections') return reportsApi.collections(filters);
    if (tab === 'outstanding') return reportsApi.outstanding(filters);
    return reportsApi.byZone(filters);
  }, [tab, filters]);

  const reportData = data?.data;

  const summaryCards = reportData
    ? [
        { label: 'Properties', value: reportData.totalProperties ?? 0 },
        { label: 'Total bills', value: reportData.totalBills ?? 0 },
        { label: 'Total billed', value: formatCurrency(reportData.totalBilled) },
        { label: 'Total collected', value: formatCurrency(reportData.totalCollected) },
        { label: 'Outstanding', value: formatCurrency(reportData.totalOutstanding) },
        { label: 'Paid bills', value: reportData.paidCount ?? 0 },
        { label: 'Unpaid bills', value: reportData.unpaidCount ?? 0 },
        { label: 'Overdue bills', value: reportData.overdueCount ?? 0 },
      ]
    : [];

  const collectionRows = reportData?.payments || [];
  const outstandingRows = reportData?.bills || [];
  const zoneRows = reportData?.rows || [];

  async function handleDownloadAllReports() {
    setDownloadingAll(true);
    try {
      const dateStamp = new Date().toISOString().slice(0, 10);
      await downloadPdf(reportsApi.allPdfPath(filters), `hptms-all-reports-${dateStamp}.pdf`);
    } catch (downloadError) {
      window.alert(downloadError.message || 'Unable to download reports.');
    } finally {
      setDownloadingAll(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Summary, collection, outstanding, and zone breakdown reports with filters."
        actions={
          <>
            <Button onClick={handleDownloadAllReports} disabled={downloadingAll}>
              {downloadingAll ? 'Preparing...' : 'Download all reports'}
            </Button>
            <Button variant="outline" onClick={reload}>
              Refresh
            </Button>
          </>
        }
      />

      <div className="flex flex-wrap gap-2">
        {TABS.map((item) => (
          <TabButton key={item.id} active={tab === item.id} onClick={() => setTab(item.id)}>
            {item.label}
          </TabButton>
        ))}
      </div>

      <FilterBar>
        {(tab === 'summary' || tab === 'collections' || tab === 'outstanding' || tab === 'by-zone') && (
          <div className="min-w-[120px] flex-1">
            <Label htmlFor="taxYear">Tax year</Label>
            <Input id="taxYear" type="number" placeholder="2026" value={taxYear} onChange={(e) => setTaxYear(e.target.value)} />
          </div>
        )}
        {tab !== 'by-zone' && (
          <>
            <div className="min-w-[140px] flex-1">
              <Label htmlFor="zone">Zone</Label>
              <Input id="zone" placeholder="Zone A" value={zone} onChange={(e) => setZone(e.target.value)} />
            </div>
            <div className="min-w-[160px] flex-1">
              <Label htmlFor="propertyType">Property type</Label>
              <Input
                id="propertyType"
                placeholder="Residential"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              />
            </div>
          </>
        )}
        {(tab === 'summary' || tab === 'outstanding') && (
          <div className="min-w-[160px] flex-1">
            <Label htmlFor="status">Status</Label>
            <Select id="status" value={status} onChange={(e) => setStatus(e.target.value)} options={STATUS_OPTIONS} />
          </div>
        )}
        {tab === 'collections' && (
          <>
            <div className="min-w-[160px] flex-1">
              <Label htmlFor="method">Method</Label>
              <Select id="method" value={method} onChange={(e) => setMethod(e.target.value)} options={METHOD_OPTIONS} />
            </div>
            <div className="min-w-[160px] flex-1">
              <Label htmlFor="from">From</Label>
              <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="min-w-[160px] flex-1">
              <Label htmlFor="to">To</Label>
              <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </>
        )}
        {tab === 'summary' && (
          <>
            <div className="min-w-[160px] flex-1">
              <Label htmlFor="from">From</Label>
              <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="min-w-[160px] flex-1">
              <Label htmlFor="to">To</Label>
              <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </>
        )}
      </FilterBar>

      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={reload} />}

      {!loading && !error && tab === 'summary' && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <StatCard key={card.label} label={card.label} value={card.value} />
          ))}
        </div>
      )}

      {!loading && !error && tab === 'collections' && (
        <>
          <StatCard label="Total collected" value={formatCurrency(reportData?.totalCollected || 0)} />
          <DataTable
            columns={[
              { key: 'paymentDate', label: 'Date', render: (row) => formatDate(row.paymentDate) },
              { key: 'amountPaid', label: 'Amount', render: (row) => formatCurrency(row.amountPaid) },
              { key: 'method', label: 'Method', render: (row) => row.method?.replace('_', ' ') },
              { key: 'referenceNo', label: 'Reference', render: (row) => row.referenceNo || '—' },
              {
                key: 'bill',
                label: 'Bill',
                render: (row) => row.billId?.billNo || '—',
              },
              {
                key: 'owner',
                label: 'Owner',
                render: (row) => row.billId?.assessmentId?.propertyId?.ownerId?.fullName || '—',
              },
            ]}
            rows={collectionRows}
            emptyMessage="No payments match the selected filters."
          />
        </>
      )}

      {!loading && !error && tab === 'outstanding' && (
        <>
          <StatCard label="Total outstanding" value={formatCurrency(reportData?.totalOutstanding || 0)} />
          <DataTable
            columns={[
              { key: 'billNo', label: 'Bill #' },
              {
                key: 'owner',
                label: 'Owner',
                render: (row) => row.assessmentId?.propertyId?.ownerId?.fullName || '—',
              },
              {
                key: 'zone',
                label: 'Zone',
                render: (row) => row.assessmentId?.propertyId?.zone || '—',
              },
              { key: 'amountDue', label: 'Due', render: (row) => formatCurrency(row.amountDue) },
              { key: 'balance', label: 'Balance', render: (row) => formatCurrency(row.balance) },
              { key: 'dueDate', label: 'Due date', render: (row) => formatDate(row.dueDate) },
              {
                key: 'status',
                label: 'Status',
                render: (row) => <StatusBadge status={row.status} />,
              },
            ]}
            rows={outstandingRows}
            emptyMessage="No outstanding bills match the selected filters."
          />
        </>
      )}

      {!loading && !error && tab === 'by-zone' && (
        <DataTable
          columns={[
            { key: 'zone', label: 'Zone' },
            { key: 'propertyCount', label: 'Properties' },
            { key: 'billCount', label: 'Bills' },
            { key: 'totalBilled', label: 'Billed', render: (row) => formatCurrency(row.totalBilled) },
            { key: 'totalCollected', label: 'Collected', render: (row) => formatCurrency(row.totalCollected) },
            { key: 'outstanding', label: 'Outstanding', render: (row) => formatCurrency(row.outstanding) },
          ]}
          rows={zoneRows}
          emptyMessage="No zone data available for the selected tax year."
        />
      )}
    </div>
  );
}
