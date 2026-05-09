import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Bell, 
  Users, 
  Settings 
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const { sidebarOpen } = useSelector((state) => state.ui);

  const isAdmin = user?.role === 'admin';

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Projects', path: '/projects', icon: <FolderKanban size={20} /> },
    { name: 'Tasks', path: '/tasks', icon: <CheckSquare size={20} /> },
    { name: 'Notifications', path: '/notifications', icon: <Bell size={20} /> },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Team', path: '/team', icon: <Users size={20} /> });
  }

  return (
    <aside 
      className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <span className="text-xl font-bold text-heading tracking-tight">Ether</span>
        </div>
      </div>

      <div className="p-4 flex flex-col justify-between h-[calc(100vh-4rem)]">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm
                ${isActive 
                  ? 'bg-primary-500/10 text-primary-600' 
                  : 'text-subtle hover:bg-muted-bg hover:text-heading'}
              `}
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto">
          <NavLink
            to="/profile"
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm
              ${isActive 
                ? 'bg-primary-500/10 text-primary-600' 
                : 'text-subtle hover:bg-muted-bg hover:text-heading'}
            `}
          >
            <Settings size={20} />
            Profile Settings
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
