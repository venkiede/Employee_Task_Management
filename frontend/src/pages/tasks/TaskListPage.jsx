import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../../store/slices/taskSlice';
import TaskCard from '../../components/tasks/TaskCard';
import KanbanBoard from '../../components/tasks/KanbanBoard';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import TaskForm from '../../components/tasks/TaskForm';
import { Plus, Search, Filter, LayoutGrid, List } from 'lucide-react';

const TaskListPage = () => {
  const dispatch = useDispatch();
  const { list: tasks, loading } = useSelector((state) => state.tasks || { list: [], loading: false });
  const { user } = useSelector((state) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [viewMode, setViewMode] = useState('board'); // 'list' or 'board'
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks({ 
      search: searchTerm, 
      status: statusFilter,
      priority: priorityFilter,
      page_size: viewMode === 'board' ? 100 : 20 // Board needs more tasks
    }));
  }, [dispatch, searchTerm, statusFilter, priorityFilter, viewMode]);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-heading tracking-tight">Tasks</h1>
          <p className="text-subtle text-sm mt-1">Manage and track all tasks across projects.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center bg-surface border border-border rounded-lg p-1">
            <button 
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-muted-bg text-heading' : 'text-subtle hover:text-heading'}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <List size={18} />
            </button>
            <button 
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'board' ? 'bg-muted-bg text-heading' : 'text-subtle hover:text-heading'}`}
              onClick={() => setViewMode('board')}
              title="Kanban Board"
            >
              <LayoutGrid size={18} />
            </button>
          </div>

          {user?.role === 'admin' && (
            <Button icon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>
              New Task
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-subtle">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-heading placeholder:text-faint focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4">
          <select
            className="w-full sm:w-40 bg-surface border border-border rounded-lg px-4 py-2 text-sm text-heading focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          
          <select
            className="w-full sm:w-40 bg-surface border border-border rounded-lg px-4 py-2 text-sm text-heading focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex gap-6 animate-pulse mt-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="min-w-[300px] h-[500px] bg-surface rounded-xl"></div>
            ))}
          </div>
        ) : viewMode === 'board' ? (
          <KanbanBoard tasks={tasks} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-subtle bg-surface border border-dashed border-border rounded-xl">
                No tasks found matching your criteria.
              </div>
            )}
          </div>
        )}
      </div>

      {/* New Task Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task" size="md">
        <TaskForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default TaskListPage;
