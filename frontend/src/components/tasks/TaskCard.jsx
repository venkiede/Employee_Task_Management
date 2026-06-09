import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, FolderKanban } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTaskStatus } from '../../store/slices/taskSlice';

const TaskCard = ({ task, isKanban = false, onStatusUpdated }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  
  // Can member update this task? Only if assigned to them or if they are admin.
  const canUpdate = user?.role === 'admin' || task.assigned_to === user?.id;

  const priorityColors = {
    low: 'bg-success-500/10 text-success-500 border-success-500/20',
    medium: 'bg-warning-500/10 text-warning-500 border-warning-500/20',
    high: 'bg-danger-500/10 text-danger-500 border-danger-500/20',
  };

  const statusColors = {
    todo: 'text-subtle bg-muted-bg',
    in_progress: 'text-primary-600 bg-primary-500/10',
    completed: 'text-success-600 bg-success-500/10',
    overdue: 'text-danger-600 bg-danger-500/10',
  };

  const handleStatusChange = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canUpdate) return;
    const nextStatus = e.target.value;
    const action = await dispatch(updateTaskStatus({ id: task.id, status: nextStatus }));

    if (updateTaskStatus.fulfilled.match(action)) {
      onStatusUpdated?.();
    }
  };

  return (
    <Link 
      to={`/tasks/${task.id}`} 
      className={`block bg-surface border rounded-xl p-4 transition-all duration-200 shadow-soft hover:shadow-md hover:-translate-y-0.5 group relative
        ${task.is_overdue && task.status !== 'completed' ? 'border-danger-500/50' : 'border-border hover:border-primary-500/50'}
      `}
    >
      {task.is_overdue && task.status !== 'completed' && (
        <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-danger-500 animate-pulse -mt-1 -mr-1"></div>
      )}

      <div className="flex justify-between items-start mb-3 gap-2">
        <h4 className="font-medium text-heading group-hover:text-primary-500 transition-colors line-clamp-2 text-sm">
          {task.title}
        </h4>
        <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      {!isKanban && task.description && (
        <p className="text-xs text-subtle mb-4 line-clamp-2">{task.description}</p>
      )}

      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <div className="flex flex-col gap-2 text-xs text-subtle">
          <div className="flex items-center gap-1.5 max-w-[120px]" title={task.project_name}>
            <FolderKanban size={12} className="shrink-0" />
            <span className="truncate">{task.project_name}</span>
          </div>
          
          <div className={`flex items-center gap-1.5 ${task.is_overdue && task.status !== 'completed' ? 'text-danger-500' : ''}`}>
            <Calendar size={12} />
            <span>{task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {/* Status Dropdown (inline update) */}
          <select 
            onClick={(e) => e.preventDefault()}
            onChange={handleStatusChange}
            value={task.status}
            disabled={!canUpdate}
            className={`text-[10px] font-medium px-2 py-1 rounded-md border border-transparent cursor-pointer outline-none appearance-none ${statusColors[task.status]} ${!canUpdate ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            {task.is_overdue && <option value="overdue" disabled>Overdue</option>}
          </select>

          {/* Assignee Avatar */}
          <div className="flex items-center gap-1 text-xs text-subtle" title={task.assigned_to_name || 'Unassigned'}>
            {task.assigned_to_name ? (
              <div className="w-5 h-5 rounded-full bg-muted-bg flex items-center justify-center text-[10px] font-bold text-heading border border-border">
                {task.assigned_to_name.charAt(0).toUpperCase()}
              </div>
            ) : (
              <User size={14} className="opacity-50" />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TaskCard;
