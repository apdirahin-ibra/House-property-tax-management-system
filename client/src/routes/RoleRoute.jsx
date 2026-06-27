import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { getRoleHomePath } from '../utils/storage';

export default function RoleRoute({ allowedRoles }) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    const redirect = user ? getRoleHomePath(user.role) : '/login';
    return <Navigate to={redirect} replace />;
  }

  return <Outlet />;
}
