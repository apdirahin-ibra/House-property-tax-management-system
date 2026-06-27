import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { ErrorState, LoadingState } from '../../components/Feedback';
import { ownersApi, propertiesApi, billsApi, paymentsApi } from '../../services/resources';
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

export default function OfficerDashboard() {
  const { stats, loading, error } = useDashboardStats([
    () => ownersApi.list(),
    () => propertiesApi.list({ status: 'active' }),
    () => billsApi.list({ status: 'unpaid' }),
    () => paymentsApi.list(),
  ]);

  const owners = stats?.[0]?.data || [];
  const properties = stats?.[1]?.data || [];
  const pendingBills = stats?.[2]?.data || [];
  const payments = stats?.[3]?.data || [];

  const today = new Date().toDateString();
  const todayCollections = payments
    .filter((payment) => new Date(payment.paymentDate).toDateString() === today)
    .reduce((sum, payment) => sum + (payment.amountPaid || 0), 0);

  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-xs font-bold uppercase text-cyan-700">Operations desk</p>
        <h2 className="text-3xl font-bold text-slate-950">Officer Dashboard</h2>
        <p className="mt-1 text-base text-slate-500">Register properties, issue bills, and record payments.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Registered owners" value={owners.length} loading={loading} tone="cyan" />
        <StatCard label="Active properties" value={properties.length} loading={loading} tone="emerald" />
        <StatCard label="Pending bills" value={pendingBills.length} loading={loading} tone="amber" />
        <StatCard label="Today's collections" value={formatCurrency(todayCollections)} loading={loading} tone="rose" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workflow</CardTitle>
        </CardHeader>
        <CardContent className="text-sm font-medium text-slate-500">
          Register owners → add properties → generate assessments → create bills → record payments → issue receipts.
        </CardContent>
      </Card>

      {loading && <LoadingState />}
    </div>
  );
}
