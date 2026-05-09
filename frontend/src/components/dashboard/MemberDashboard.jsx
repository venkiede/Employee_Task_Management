import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import StatCard from '../common/StatCard';
import { CheckSquare, AlertCircle, Clock, FolderKanban, Calendar } from 'lucide-react';

const MemberDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/dashboard/member/');
        setData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch member dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-6">
      <div className="h-8 bg-surface rounded w-1/4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-surface rounded-xl"></div>)}
      </div>
      <div className="h-64 bg-surface rounded-xl"></div>
    </div>;
  }

  if (!data) return <div className="text-subtle">Failed to load dashboard data.</div>;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-heading tracking-tight">My Workspace</h1>
        <p className="text-subtle text-sm mt-1">Here's your current workload and upcoming deadlines.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Assigned Tasks" 
          value={data.tasks.total} 
          icon={<CheckSquare size={24} />} 
          bgClass="bg-blue-500/10" colorClass="text-blue-500"
        />
        <StatCard 
          title="Pending" 
          value={data.tasks.todo + data.tasks.in_progress} 
          icon={<Clock size={24} />} 
          bgClass="bg-warning-500/10" colorClass="text-warning-500"
        />
        <StatCard 
          title="Completed" 
          value={data.tasks.completed} 
          icon={<CheckSquare size={24} />} 
          bgClass="bg-success-500/10" colorClass="text-success-500"
        />
        <StatCard 
          title="Overdue" 
          value={data.tasks.overdue} 
          icon={<AlertCircle size={24} />} 
          bgClass="bg-danger-500/10" colorClass="text-danger-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Deadlines Table */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-6 overflow-hidden flex flex-col shadow-soft">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-heading flex items-center gap-2">
              <Calendar size={18} className="text-primary-500" />
              Upcoming Deadlines
            </h3>
            <Link to="/tasks" className="text-sm text-primary-500 hover:text-primary-400 font-medium">View all</Link>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            {data.upcoming_deadlines?.length > 0 ? (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-subtle uppercase bg-muted-bg border-y border-border">
                  <tr>
                    <th className="px-4 py-3 font-medium">Task</th>
                    <th className="px-4 py-3 font-medium">Project</th>
                    <th className="px-4 py-3 font-medium">Priority</th>
                    <th className="px-4 py-3 font-medium">Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {data.upcoming_deadlines.map(task => (
                    <tr key={task.id} className="border-b border-border hover:bg-muted-bg/50 transition-colors">
                      <td className="px-4 py-4 font-medium text-heading">{task.title}</td>
                      <td className="px-4 py-4 text-body">{task.project}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border
                          ${task.priority === 'high' ? 'bg-danger-500/10 text-danger-500 border-danger-500/20' : 
                            task.priority === 'medium' ? 'bg-warning-500/10 text-warning-500 border-warning-500/20' : 
                            'bg-success-500/10 text-success-500 border-success-500/20'}
                        `}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-body">
                        {new Date(task.deadline).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12 text-subtle">
                <CheckSquare size={48} className="mb-4 opacity-20" />
                <p>No upcoming deadlines in the next 7 days.</p>
                <p className="text-xs mt-1">You're all caught up!</p>
              </div>
            )}
          </div>
        </div>

        {/* My Projects */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-soft">
          <div className="flex items-center gap-2 mb-6">
            <FolderKanban size={20} className="text-accent-500" />
            <h3 className="text-lg font-semibold text-heading">My Projects</h3>
          </div>
          
          <div className="flex flex-col items-center justify-center py-10 bg-muted-bg rounded-lg border border-border-subtle border-dashed">
            <span className="text-4xl font-bold text-heading mb-2">{data.projects_count}</span>
            <span className="text-sm text-subtle">Active Projects</span>
            <Link to="/projects" className="mt-6 text-sm text-primary-500 hover:text-primary-400 font-medium">
              Browse Projects →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
