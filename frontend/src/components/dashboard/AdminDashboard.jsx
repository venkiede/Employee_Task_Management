import { useEffect, useState } from 'react';
import api from '../../api/axios';
import StatCard from '../common/StatCard';
import { 
  FolderKanban, 
  CheckSquare, 
  AlertCircle, 
  Clock, 
  Users, 
  Activity 
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/dashboard/admin/');
        setData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch admin dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-6">
      <div className="h-8 bg-surface rounded w-1/4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map(i => <div key={i} className="h-32 bg-surface rounded-xl"></div>)}
      </div>
      <div className="h-64 bg-surface rounded-xl"></div>
    </div>;
  }

  if (!data) return <div className="text-subtle">Failed to load dashboard data.</div>;

  const pieData = [
    { name: 'To Do', value: data.tasks.todo, color: '#FCA5A5' },
    { name: 'In Progress', value: data.tasks.in_progress, color: '#FDBA74' },
    { name: 'Completed', value: data.tasks.completed, color: '#86EFAC' },
  ].filter(item => item.value > 0);

  const barData = [
    { name: 'To Do', count: data.tasks.todo || 0, fill: '#FCA5A5' },
    { name: 'In Progress', count: data.tasks.in_progress || 0, fill: '#FDBA74' },
    { name: 'Completed', count: data.tasks.completed || 0, fill: '#86EFAC' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-heading tracking-tight">Overview</h1>
          <p className="text-subtle text-sm mt-1">Here's what's happening across the workspace.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="col-span-1 sm:col-span-2 lg:col-span-1 xl:col-span-2">
          <StatCard 
            title="Total Projects" 
            value={data.projects.total} 
            icon={<FolderKanban size={24} />} 
            bgClass="bg-indigo-500/10" colorClass="text-indigo-500"
          />
        </div>
        <div className="col-span-1 sm:col-span-2 lg:col-span-1 xl:col-span-2">
          <StatCard 
            title="Total Tasks" 
            value={data.tasks.total} 
            icon={<CheckSquare size={24} />} 
            bgClass="bg-blue-500/10" colorClass="text-blue-500"
          />
        </div>
        <StatCard 
          title="Team Members" 
          value={data.team.total} 
          icon={<Users size={24} />} 
          bgClass="bg-violet-500/10" colorClass="text-violet-500"
        />
        <StatCard 
          title="Overdue" 
          value={data.tasks.overdue} 
          icon={<AlertCircle size={24} />} 
          bgClass="bg-danger-500/10" colorClass="text-danger-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Charts */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-heading mb-6">Task Status Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0)" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--chart-bg)', 
                    borderColor: 'var(--chart-border)', 
                    borderRadius: '0.5rem', 
                    color: 'var(--color-heading)' 
                  }}
                  itemStyle={{ color: 'var(--color-heading)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {pieData.map(item => (
              <div key={item.name} className="flex items-center gap-2 text-sm text-body">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                {item.name} ({item.value})
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-heading mb-6">Tasks by Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--color-faint)" tick={{ fill: 'var(--chart-text)' }} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--color-faint)" tick={{ fill: 'var(--chart-text)' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'var(--chart-cursor)', opacity: 0.4 }}
                  contentStyle={{ 
                    backgroundColor: 'var(--chart-bg)', 
                    borderColor: 'var(--chart-border)', 
                    borderRadius: '0.5rem', 
                    color: 'var(--color-heading)' 
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-6">
          <Activity size={20} className="text-primary-500" />
          <h3 className="text-lg font-semibold text-heading">Recent Activity</h3>
        </div>
        
        {data.recent_activities?.length > 0 ? (
          <div className="space-y-6">
            {data.recent_activities.map((activity, idx) => (
              <div key={activity.id} className="relative pl-6">
                {/* Timeline line */}
                {idx !== data.recent_activities.length - 1 && (
                  <div className="absolute left-2 top-6 bottom-[-1.5rem] w-px bg-border"></div>
                )}
                {/* Timeline dot */}
                <div className="absolute left-1 top-1.5 w-2 h-2 rounded-full bg-primary-500 ring-4 ring-surface"></div>
                
                <p className="text-sm text-body">
                  <span className="font-semibold text-heading">{activity.user}</span> {activity.action} <span className="font-medium text-subtle">{activity.target_model}</span>
                </p>
                <p className="text-xs text-faint mt-1">
                  {new Date(activity.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-subtle">No recent activity.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
