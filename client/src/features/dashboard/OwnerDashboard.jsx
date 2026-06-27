import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { ErrorState, LoadingState } from '../../components/Feedback';
import { propertiesApi, billsApi, paymentsApi } from '../../services/resources';
import { formatCurrency } from '../../utils/format';
import { useDashboardStats } from './AdminDashboard';

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

export default function OwnerDashboard() {
  const { stats, loading, error } = useDashboardStats([
    () => propertiesApi.ownerList(),
    () => billsApi.ownerList(),
    () => paymentsApi.ownerList(),
  ]);

  const properties = stats?.[0]?.data || [];
  const bills = stats?.[1]?.data || [];
  const payments = stats?.[2]?.data || [];

  const outstanding = bills.reduce((sum, bill) => sum + (bill.balance || 0), 0);
  const paidThisYear = payments.reduce((sum, payment) => sum + (payment.amountPaid || 0), 0);
  const pendingNotices = bills.filter((bill) => ['unpaid', 'overdue', 'partial'].includes(bill.status)).length;

  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-xs font-bold uppercase text-cyan-700">Owner self-service</p>
        <h2 className="text-3xl font-bold text-slate-950">Owner Portal</h2>
        <p className="mt-1 text-base text-slate-500">View your properties, bills, payments, and receipts.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="My properties" value={properties.length} loading={loading} tone="cyan" />
        <StatCard label="Outstanding balance" value={formatCurrency(outstanding)} loading={loading} tone="rose" />
        <StatCard label="Paid this year" value={formatCurrency(paidThisYear)} loading={loading} tone="emerald" />
        <StatCard label="Pending notices" value={pendingNotices} loading={loading} tone="amber" />
      </div>

      {loading && <LoadingState />}
    </div>
  );
}
