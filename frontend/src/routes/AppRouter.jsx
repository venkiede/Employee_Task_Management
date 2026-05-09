import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProfile } from '../store/slices/authSlice';
import { getTokens } from '../utils/storage';

import ProtectedRoute from './ProtectedRoute';
import GuestRoute from './GuestRoute';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Pages
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import ProjectListPage from '../pages/projects/ProjectListPage';
import ProjectDetailPage from '../pages/projects/ProjectDetailPage';
import TaskListPage from '../pages/tasks/TaskListPage';
import TaskDetailPage from '../pages/tasks/TaskDetailPage';
import TeamPage from '../pages/team/TeamPage';
import NotificationCenterPage from '../pages/notifications/NotificationCenterPage';
import ProfilePage from '../pages/profile/ProfilePage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRouter = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const { access } = getTokens();
    if (access) {
      dispatch(fetchProfile());
    }
  }, [dispatch]);

  return (
    <Routes>
      {/* Guest Routes (Login, Signup) */}
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectListPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/tasks" element={<TaskListPage />} />
          <Route path="/tasks/:id" element={<TaskDetailPage />} />
          <Route path="/notifications" element={<NotificationCenterPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Admin Only */}
          <Route element={<ProtectedRoute requireAdmin={true} />}>
            <Route path="/team" element={<TeamPage />} />
          </Route>
        </Route>
      </Route>

      {/* Default Redirect & 404 */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;
