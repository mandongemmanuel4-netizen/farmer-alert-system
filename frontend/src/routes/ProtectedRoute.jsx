import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wrap any portal's routes with this to enforce role separation.
 * Usage: <ProtectedRoute allowedRoles={['farmer']}><FarmerDashboard /></ProtectedRoute>
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Logged in, but wrong portal — send them to their own dashboard instead of a dead end
    return <Navigate to={`/${user.role}`} replace />;
  }

  return children;
}
