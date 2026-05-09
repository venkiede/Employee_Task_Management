import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, Search, Bell, LogOut, User, Sun, Moon } from 'lucide-react';
import { toggleSidebar, toggleTheme } from '../../store/slices/uiSlice';
import { logoutUser } from '../../store/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread notification count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await api.get('/notifications/unread-count/');
        // UnreadCountView uses success_response, so data is wrapped
        setUnreadCount(response.data.data?.unread_count || 0);
      } catch (error) {
        // Silently fail — the bell just won't show a badge
      }
    };
    fetchUnreadCount();
    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8 z-40 sticky top-0">
      <div className="flex items-center gap-4">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="text-subtle hover:text-heading lg:hidden p-2 -ml-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <Menu size={24} />
        </button>
        
        {/* Optional Search Bar inside Navbar */}
        <div className="hidden sm:flex items-center bg-muted-bg rounded-lg px-3 py-1.5 border border-border-subtle focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 transition-all">
          <Search size={16} className="text-subtle" />
          <input 
            type="text" 
            placeholder="Search across workspace..." 
            className="bg-transparent border-none focus:ring-0 text-sm text-heading px-2 w-64 placeholder:text-faint"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <button 
          onClick={() => dispatch(toggleTheme())}
          className="text-subtle hover:text-heading transition-colors p-2 rounded-full hover:bg-muted-bg"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <Link to="/notifications" className="relative text-subtle hover:text-heading transition-colors p-2 rounded-full hover:bg-muted-bg">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-danger-500 rounded-full border-2 border-surface flex items-center justify-center">
              <span className="text-[10px] font-bold text-white leading-none">{unreadCount > 9 ? '9+' : unreadCount}</span>
            </span>
          )}
        </Link>

        <div className="h-6 w-px bg-border hidden sm:block"></div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-medium text-heading leading-none">{user?.full_name}</span>
            <span className="text-xs text-subtle mt-1 capitalize">{user?.role}</span>
          </div>
          
          {/* Avatar Dropdown wrapper */}
          <div className="relative group cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center border-2 border-surface overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-sm font-bold">
                  {user?.full_name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            {/* Simple dropdown */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-border rounded-lg shadow-soft py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right z-50">
              <button onClick={() => navigate('/profile')} className="w-full text-left px-4 py-2 text-sm text-body hover:bg-muted-bg hover:text-heading flex items-center gap-2">
                <User size={16} /> Profile
              </button>
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-danger-500 hover:bg-danger-500/10 flex items-center gap-2">
                <LogOut size={16} /> Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
