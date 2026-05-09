import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getTokens } from '../utils/storage';

const ProtectedRoute = ({ requireAdmin = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { access } = getTokens();

  // If no token locally, redirect to login
  if (!access) {
    return <Navigate to="/login" replace />;
  }

  // If we have token but user isn't loaded yet, we might show a loader here.
  // For now, if we have a token, we assume they are at least trying to auth.
  // AppRouter should try to fetch the profile on load if access token exists.

  if (requireAdmin && user && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />; // or unauthorized page
  }

  return <Outlet />;
};

export default ProtectedRoute;
