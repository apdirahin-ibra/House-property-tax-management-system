import { Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from '../features/landing/LandingPage';
import LoginPage from '../features/auth/LoginPage';
import AdminDashboard from '../features/dashboard/AdminDashboard';
import OfficerDashboard from '../features/dashboard/OfficerDashboard';
import OwnerDashboard from '../features/dashboard/OwnerDashboard';
import UsersPage from '../features/users/UsersPage';
import OwnersPage from '../features/owners/OwnersPage';
import OwnerPropertiesPage from '../features/owners/OwnerPropertiesPage';
import OwnerBillsPage from '../features/owners/OwnerBillsPage';
import OwnerPaymentsPage from '../features/owners/OwnerPaymentsPage';
import PropertiesPage from '../features/properties/PropertiesPage';
import TaxRatesPage from '../features/taxRates/TaxRatesPage';
import AssessmentsPage from '../features/assessments/AssessmentsPage';
import BillsPage from '../features/bills/BillsPage';
import PaymentsPage from '../features/payments/PaymentsPage';
import ReceiptsPage from '../features/receipts/ReceiptsPage';
import ReportsPage from '../features/reports/ReportsPage';
import AuditLogsPage from '../features/auditLogs/AuditLogsPage';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import { useAuth } from '../features/auth/AuthContext';
import { adminNav, officerNav, ownerNav } from '../utils/navigation';
import { getRoleHomePath } from '../utils/storage';

function RootRedirect() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return <Navigate to={getRoleHomePath(user.role)} replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<RootRedirect />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<DashboardLayout navItems={adminNav} title="Admin Panel" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="owners" element={<OwnersPage canEdit={false} />} />
            <Route path="properties" element={<PropertiesPage canEdit={false} />} />
            <Route path="tax-rates" element={<TaxRatesPage />} />
            <Route path="bills" element={<BillsPage canCreate={false} />} />
            <Route path="payments" element={<PaymentsPage canCreate={false} />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="audit-logs" element={<AuditLogsPage />} />
          </Route>
        </Route>

        <Route element={<RoleRoute allowedRoles={['officer']} />}>
          <Route path="/officer" element={<DashboardLayout navItems={officerNav} title="Officer Panel" />}>
            <Route index element={<OfficerDashboard />} />
            <Route path="owners" element={<OwnersPage />} />
            <Route path="properties" element={<PropertiesPage />} />
            <Route path="assessments" element={<AssessmentsPage />} />
            <Route path="bills" element={<BillsPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="receipts" element={<ReceiptsPage />} />
            <Route path="reports" element={<ReportsPage />} />
          </Route>
        </Route>

        <Route element={<RoleRoute allowedRoles={['owner']} />}>
          <Route path="/owner" element={<DashboardLayout navItems={ownerNav} title="Owner Portal" />}>
            <Route index element={<OwnerDashboard />} />
            <Route path="properties" element={<OwnerPropertiesPage />} />
            <Route path="bills" element={<OwnerBillsPage />} />
            <Route path="payments" element={<OwnerPaymentsPage />} />
            <Route path="receipts" element={<ReceiptsPage ownerMode />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
