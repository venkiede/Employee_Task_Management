import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../../api/axios';
import { Bell, Check, Trash2, FolderKanban, CheckSquare, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const NotificationCenterPage = () => {
  const { user } = useSelector(state => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications/');
      // NotificationListView is a ListAPIView — returns paginated data directly (not wrapped)
      setNotifications(response.data.results || response.data);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      // Backend uses UpdateAPIView at /notifications/<id>/ — send PATCH with is_read field
      await api.patch(`/notifications/${id}/`, { is_read: true });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      // Backend URL uses hyphens: /notifications/mark-all-read/
      await api.post('/notifications/mark-all-read/');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to update notifications');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'project': return <FolderKanban size={20} className="text-indigo-500" />;
      case 'task': return <CheckSquare size={20} className="text-blue-500" />;
      case 'system': return <Shield size={20} className="text-violet-500" />;
      default: return <Bell size={20} className="text-subtle" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-heading tracking-tight">Notifications</h1>
          <p className="text-subtle text-sm mt-1">Stay updated on your projects and tasks.</p>
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium text-body hover:text-heading hover:bg-muted-bg transition-colors"
          >
            <Check size={16} /> Mark all as read
          </button>
        )}
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : notifications.length > 0 ? (
          <div className="divide-y divide-border">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 sm:p-6 flex gap-4 transition-colors ${notification.is_read ? 'bg-transparent' : 'bg-primary-500/5'}`}
              >
                <div className={`mt-1 p-2 rounded-lg ${notification.is_read ? 'bg-muted-bg' : 'bg-primary-500/20'}`}>
                  {getIcon(notification.notification_type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h4 className={`text-sm font-medium ${notification.is_read ? 'text-body' : 'text-heading'}`}>
                      {notification.title}
                    </h4>
                    <span className="text-xs text-faint whitespace-nowrap">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={`text-sm ${notification.is_read ? 'text-faint' : 'text-subtle'}`}>
                    {notification.message}
                  </p>
                </div>

                {!notification.is_read && (
                  <div className="shrink-0 flex items-center">
                    <button 
                      onClick={() => markAsRead(notification.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-primary-500 hover:bg-primary-500/10 transition-colors"
                      title="Mark as read"
                    >
                      <Check size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-subtle">
            <div className="w-16 h-16 bg-muted-bg rounded-full flex items-center justify-center mb-4">
              <Bell size={32} className="text-faint" />
            </div>
            <p className="text-lg font-medium text-heading mb-1">You're all caught up!</p>
            <p className="text-sm">No new notifications right now.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenterPage;
