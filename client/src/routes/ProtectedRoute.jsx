import { Navigate, Outlet } from 'react-router-dom';
import { Spinner } from '../components/ui/Spinner';
import { useAuth } from '../features/auth/AuthContext';
import { getRoleHomePath } from '../utils/storage';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: { pathname: window.location.pathname } }} />;
  }

  return <Outlet />;
}
