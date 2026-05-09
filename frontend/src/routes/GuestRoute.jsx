import { Navigate, Outlet } from 'react-router-dom';
import { getTokens } from '../utils/storage';

const GuestRoute = () => {
  const { access } = getTokens();

  // If user is already logged in, redirect away from guest pages (like login/signup)
  if (access) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
