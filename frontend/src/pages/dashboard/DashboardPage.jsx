import { useSelector } from 'react-redux';
import AdminDashboard from '../../components/dashboard/AdminDashboard';
import MemberDashboard from '../../components/dashboard/MemberDashboard';

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return null;

  return user.role === 'admin' ? <AdminDashboard /> : <MemberDashboard />;
};

export default DashboardPage;
