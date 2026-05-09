import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Bell, 
  Users, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { toggleSidebarCollapsed } from '../../store/slices/uiSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { sidebarOpen, sidebarCollapsed } = useSelector((state) => state.ui);

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
        fixed inset-y-0 left-0 z-50 bg-surface border-r border-border transform transition-all duration-300 ease-in-out lg:static lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${sidebarCollapsed ? 'w-20' : 'w-64'}
      `}
    >
      <div className={`h-16 flex items-center border-b border-border transition-all duration-300 ${sidebarCollapsed ? 'justify-center' : 'px-6'}`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center shadow-sm shrink-0">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          {!sidebarCollapsed && (
            <span className="text-sm font-bold text-heading tracking-tight whitespace-nowrap animate-in fade-in duration-500">
              Employee Task Management System
            </span>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col justify-between h-[calc(100vh-4rem)] relative">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium text-sm group relative
                ${isActive 
                  ? 'bg-primary-500/10 text-primary-600' 
                  : 'text-subtle hover:bg-muted-bg hover:text-heading'}
                ${sidebarCollapsed ? 'justify-center px-0 w-12 mx-auto' : ''}
              `}
            >
              <div className="shrink-0">{item.icon}</div>
              {!sidebarCollapsed && (
                <span className="whitespace-nowrap animate-in slide-in-from-left-2 duration-300">{item.name}</span>
              )}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-heading text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg whitespace-nowrap z-[60]">
                  {item.name}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-2">
          <NavLink
            to="/profile"
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium text-sm group relative
              ${isActive 
                ? 'bg-primary-500/10 text-primary-600' 
                : 'text-subtle hover:bg-muted-bg hover:text-heading'}
              ${sidebarCollapsed ? 'justify-center px-0 w-12 mx-auto' : ''}
            `}
          >
            <div className="shrink-0"><Settings size={20} /></div>
            {!sidebarCollapsed && (
              <span className="whitespace-nowrap animate-in slide-in-from-left-2 duration-300">Profile Settings</span>
            )}
            {sidebarCollapsed && (
              <div className="absolute left-full ml-4 px-2 py-1 bg-heading text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg whitespace-nowrap z-[60]">
                Profile Settings
              </div>
            )}
          </NavLink>

          {/* Desktop Collapse Toggle - Moved below Profile Settings */}
          <button
            onClick={() => dispatch(toggleSidebarCollapsed())}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium text-sm w-full
              text-subtle hover:bg-muted-bg hover:text-heading active:scale-95
              ${sidebarCollapsed ? 'justify-center px-0 w-12 mx-auto' : ''}
            `}
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <div className="shrink-0">
              {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </div>
            {!sidebarCollapsed && (
              <span className="whitespace-nowrap animate-in slide-in-from-left-2 duration-300">Collapse Menu</span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
