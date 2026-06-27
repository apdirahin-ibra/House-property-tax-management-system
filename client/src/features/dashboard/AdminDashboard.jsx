import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { ErrorState, LoadingState } from '../../components/Feedback';
import { StatusBadge } from '../../components/ui/Badge';
import { propertiesApi, billsApi, paymentsApi } from '../../services/resources';
import { formatCurrency, formatDate } from '../../utils/format';

function StatCard({ label, value, loading, tone = 'cyan' }) {
  const tones = {
    cyan: 'from-cyan-500 to-blue-600',
    emerald: 'from-emerald-500 to-teal-600',
    amber: 'from-amber-400 to-orange-500',
    rose: 'from-rose-500 to-red-600',
  };

  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${tones[tone]}`} />
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold text-slate-500">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-black text-slate-950">{loading ? '...' : value}</p>
      </CardContent>
    </Card>
  );
}

function PanelTitle({ title, description }) {
  return (
    <div>
      <h3 className="text-lg font-black text-slate-950">{title}</h3>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    </div>
  );
}

function MiniMetric({ label, value, tone = 'slate' }) {
  const tones = {
    slate: 'bg-slate-50 text-slate-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-800',
    rose: 'bg-rose-50 text-rose-700',
    cyan: 'bg-cyan-50 text-cyan-700',
  };

  return (
    <div className={`rounded-md px-4 py-3 ${tones[tone]}`}>
      <p className="text-xs font-bold uppercase">{label}</p>
      <p className="mt-1 text-xl font-black">{value}</p>
    </div>
  );
}

function ProgressBar({ value }) {
  const width = Math.min(100, Math.max(0, value));
  return (
    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

export function useDashboardStats(fetchers) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    Promise.all(fetchers.map((fn) => fn()))
      .then((results) => {
        if (active) setStats(results);
      })
      .catch((err) => {
        if (active) setError(err.message || 'Failed to load dashboard stats');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { stats, loading, error };
}

export default function AdminDashboard() {
  const { stats, loading, error } = useDashboardStats([
    () => propertiesApi.list(),
    () => billsApi.list(),
    () => paymentsApi.list(),
  ]);

  const properties = stats?.[0]?.data || [];
  const bills = stats?.[1]?.data || [];
  const payments = stats?.[2]?.data || [];

  const totalBilled = bills.reduce((sum, bill) => sum + (bill.amountDue || 0), 0);
  const totalCollected = payments.reduce((sum, payment) => sum + (payment.amountPaid || 0), 0);
  const outstanding = bills.reduce((sum, bill) => sum + (bill.balance || 0), 0);
  const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;
  const activeProperties = properties.filter((property) => property.status === 'active').length;
  const paidBills = bills.filter((bill) => bill.status === 'paid').length;
  const unpaidBills = bills.filter((bill) => bill.status === 'unpaid').length;
  const partialBills = bills.filter((bill) => bill.status === 'partial').length;
  const overdueBills = bills.filter((bill) => bill.status === 'overdue').length;
  const recentBills = bills.slice(0, 5);
  const recentPayments = payments.slice(0, 5);
  const zoneCounts = properties.reduce((acc, property) => {
    const zone = property.zone || 'Unassigned';
    acc[zone] = (acc[zone] || 0) + 1;
    return acc;
  }, {});
  const zoneRows = Object.entries(zoneCounts).sort((a, b) => b[1] - a[1]);

  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-xs font-bold uppercase text-cyan-700">Executive overview</p>
        <h2 className="text-3xl font-bold text-slate-950">Admin Dashboard</h2>
        <p className="mt-1 text-base text-slate-500">Overview of property tax operations and system management.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total properties" value={properties.length} loading={loading} tone="cyan" />
        <StatCard label="Total billed" value={formatCurrency(totalBilled)} loading={loading} tone="amber" />
        <StatCard label="Total collected" value={formatCurrency(totalCollected)} loading={loading} tone="emerald" />
        <StatCard label="Outstanding" value={formatCurrency(outstanding)} loading={loading} tone="rose" />
      </div>

      {loading && <LoadingState />}

      {!loading && (
        <>
          <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <Card>
              <CardHeader>
                <PanelTitle
                  title="Collection health"
                  description="Live picture of billed revenue, collections, and remaining balances."
                />
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-4xl font-black text-slate-950">{collectionRate}%</p>
                    <p className="mt-1 text-sm font-semibold text-slate-500">Collection rate</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:min-w-[360px]">
                    <MiniMetric label="Active properties" value={activeProperties} tone="cyan" />
                    <MiniMetric label="Payments" value={payments.length} tone="emerald" />
                  </div>
                </div>
                <ProgressBar value={collectionRate} />
                <div className="grid gap-3 sm:grid-cols-3">
                  <MiniMetric label="Billed" value={formatCurrency(totalBilled)} tone="amber" />
                  <MiniMetric label="Collected" value={formatCurrency(totalCollected)} tone="emerald" />
                  <MiniMetric label="Outstanding" value={formatCurrency(outstanding)} tone="rose" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <PanelTitle title="Bill status" description="Operational pressure by payment state." />
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  ['Paid', paidBills, 'emerald'],
                  ['Unpaid', unpaidBills, 'cyan'],
                  ['Partial', partialBills, 'amber'],
                  ['Overdue', overdueBills, 'rose'],
                ].map(([label, count, tone]) => (
                  <div key={label} className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50/70 px-4 py-3">
                    <span className="text-sm font-bold text-slate-600">{label}</span>
                    <MiniMetric label="Bills" value={count} tone={tone} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <PanelTitle title="Recent bills" description="Latest issued bills across all properties." />
              </CardHeader>
              <CardContent className="space-y-3">
                {recentBills.length ? (
                  recentBills.map((bill) => (
                    <div key={bill._id || bill.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-slate-100 bg-white px-4 py-3 shadow-sm">
                      <div>
                        <p className="font-black text-slate-950">{bill.billNo}</p>
                        <p className="text-sm text-slate-500">
                          {bill.assessmentId?.propertyId?.propertyCode || 'Property'} - due {formatDate(bill.dueDate)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-black text-slate-900">{formatCurrency(bill.balance)}</p>
                        <StatusBadge status={bill.status} />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="rounded-md border border-dashed border-slate-200 p-6 text-center text-sm font-semibold text-slate-500">
                    No recent bills yet.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <PanelTitle title="Recent payments" description="Latest collections recorded in the system." />
              </CardHeader>
              <CardContent className="space-y-3">
                {recentPayments.length ? (
                  recentPayments.map((payment) => (
                    <div key={payment._id || payment.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-slate-100 bg-white px-4 py-3 shadow-sm">
                      <div>
                        <p className="font-black text-slate-950">{formatCurrency(payment.amountPaid)}</p>
                        <p className="text-sm capitalize text-slate-500">
                          {payment.method?.replace('_', ' ') || 'payment'} - {formatDate(payment.paymentDate)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-slate-500">
                        {payment.billId?.assessmentId?.propertyId?.ownerId?.fullName || payment.recordedBy?.name || 'Recorded'}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="rounded-md border border-dashed border-slate-200 p-6 text-center text-sm font-semibold text-slate-500">
                    No payments recorded yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <PanelTitle title="Property distribution" description="Registered properties grouped by zone." />
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-3">
                {zoneRows.length ? (
                  zoneRows.map(([zone, count]) => (
                    <div key={zone} className="rounded-md border border-slate-100 bg-gradient-to-br from-white to-slate-50 p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-black text-slate-950">{zone}</p>
                        <p className="text-2xl font-black text-slate-950">{count}</p>
                      </div>
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                          style={{ width: `${properties.length ? (count / properties.length) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="rounded-md border border-dashed border-slate-200 p-6 text-center text-sm font-semibold text-slate-500 sm:col-span-3">
                    No properties registered yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
