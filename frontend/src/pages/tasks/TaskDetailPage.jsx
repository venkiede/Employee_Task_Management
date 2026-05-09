import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTaskById, deleteTask, clearCurrentTask, updateTaskStatus } from '../../store/slices/taskSlice';
import { FolderKanban, Calendar, User, Edit, Trash2, ArrowLeft, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import TaskForm from '../../components/tasks/TaskForm';

const TaskDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentTask: task, loading } = useSelector(state => state.tasks);
  const { user } = useSelector(state => state.auth);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isAssignee = task?.assigned_to === user?.id;
  const canEdit = isAdmin || isAssignee;

  useEffect(() => {
    dispatch(fetchTaskById(id));
    return () => {
      dispatch(clearCurrentTask());
    };
  }, [dispatch, id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const action = await dispatch(deleteTask(id));
      if (deleteTask.fulfilled.match(action)) {
        toast.success('Task deleted successfully');
        navigate('/tasks');
      } else {
        toast.error('Failed to delete task');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleStatusChange = (e) => {
    if (!canEdit) return;
    dispatch(updateTaskStatus({ id: task.id, status: e.target.value }));
  };

  if (loading || !task) {
    return <div className="animate-pulse space-y-6 p-4">
      <div className="h-8 w-24 bg-surface rounded mb-4"></div>
      <div className="h-48 bg-surface rounded-xl mb-6"></div>
    </div>;
  }

  const priorityColors = {
    low: 'bg-success-500/10 text-success-500 border-success-500/20',
    medium: 'bg-warning-500/10 text-warning-500 border-warning-500/20',
    high: 'bg-danger-500/10 text-danger-500 border-danger-500/20',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <Link to="/tasks" className="inline-flex items-center text-sm font-medium text-subtle hover:text-heading transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Back to Tasks
        </Link>
        
        {isAdmin && (
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" icon={<Edit size={16} />} onClick={() => setIsEditModalOpen(true)}>
              Edit
            </Button>
            <Button variant="danger" size="sm" icon={<Trash2 size={16} />} onClick={() => setIsDeleteModalOpen(true)}>
              Delete
            </Button>
          </div>
        )}
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 lg:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider border rounded ${priorityColors[task.priority]}`}>
            {task.priority} Priority
          </span>
          {task.is_overdue && task.status !== 'completed' && (
            <span className="flex items-center gap-1 text-xs font-bold text-danger-500 bg-danger-500/10 px-2.5 py-1 rounded">
              <AlertCircle size={14} /> Overdue
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-heading mb-4">{task.title}</h1>
        
        <div className="flex flex-wrap items-center gap-6 text-sm mb-8 pb-6 border-b border-border">
          <div className="flex items-center gap-2 text-body">
            <FolderKanban size={16} className="text-subtle" />
            <Link to={`/projects/${task.project}`} className="hover:text-primary-500 transition-colors">
              {task.project_name}
            </Link>
          </div>
          
          <div className="flex items-center gap-2 text-body">
            <Calendar size={16} className="text-subtle" />
            <span className={task.is_overdue && task.status !== 'completed' ? 'text-danger-500 font-medium' : ''}>
              Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'None'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-body">
            <Clock size={16} className="text-subtle" />
            <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-heading mb-3">Description</h3>
            <div className="text-body leading-relaxed bg-muted-bg p-4 rounded-lg border border-border-subtle min-h-[150px] whitespace-pre-wrap">
              {task.description || <span className="text-faint italic">No description provided.</span>}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-subtle mb-2 uppercase tracking-wider">Status</h3>
              <select
                value={task.status}
                onChange={handleStatusChange}
                disabled={!canEdit}
                className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-heading font-medium focus:ring-2 focus:ring-primary-500 outline-none disabled:opacity-75 disabled:cursor-not-allowed shadow-sm"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                {task.is_overdue && <option value="overdue" disabled>Overdue</option>}
              </select>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-subtle mb-2 uppercase tracking-wider">Assigned To</h3>
              <div className="flex items-center gap-3 bg-muted-bg p-3 rounded-lg border border-border-subtle">
                {task.assigned_to_name ? (
                  <>
                    <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                      {task.assigned_to_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-heading">{task.assigned_to_name}</div>
                      <div className="text-xs text-subtle">{task.assigned_to_email}</div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-subtle">
                    <User size={18} />
                    <span>Unassigned</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-subtle mb-2 uppercase tracking-wider">Created By</h3>
              <div className="text-body bg-muted-bg px-4 py-2.5 rounded-lg border border-border-subtle">
                {task.created_by_name}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isAdmin && (
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Task" size="md">
          <TaskForm task={task} onClose={() => setIsEditModalOpen(false)} />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {isAdmin && (
        <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Task">
          <div className="space-y-4">
            <div className="p-4 bg-danger-500/10 border border-danger-500/20 rounded-lg text-danger-500 text-sm">
              Are you sure you want to delete the task <strong>"{task.title}"</strong>? This action cannot be undone.
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}>Cancel</Button>
              <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>Delete Task</Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default TaskDetailPage;
