import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../../store/slices/taskSlice';
import TaskCard from '../../components/tasks/TaskCard';
import KanbanBoard from '../../components/tasks/KanbanBoard';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import TaskForm from '../../components/tasks/TaskForm';
import { Plus, Search, LayoutGrid, List, FolderKanban } from 'lucide-react';

const PROJECT_STATUS_TABS = [
  {
    value: 'completed',
    label: 'Completed',
    defaultTaskStatus: 'completed',
    helper: 'Completed projects are selected by default, and the task filter starts on completed tasks.'
  },
  {
    value: 'in_progress',
    label: 'In Progress',
    defaultTaskStatus: 'in_progress',
    helper: 'Browse active work inside projects that are currently in progress.'
  },
  {
    value: 'pending',
    label: 'Pending',
    defaultTaskStatus: 'todo',
    helper: 'See upcoming to-do work inside projects that are still pending.'
  }
];

const TASK_STATUS_LABELS = {
  todo: 'To Do',
  in_progress: 'In Progress',
  completed: 'Completed',
  overdue: 'Overdue'
};

const TaskListPage = () => {
  const dispatch = useDispatch();
  const { list: tasks, loading } = useSelector((state) => state.tasks || { list: [], loading: false });
  const { user } = useSelector((state) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeProjectStatus, setActiveProjectStatus] = useState(PROJECT_STATUS_TABS[0].value);
  const [taskStatusFilter, setTaskStatusFilter] = useState(PROJECT_STATUS_TABS[0].defaultTaskStatus);
  const [priorityFilter, setPriorityFilter] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeTab = PROJECT_STATUS_TABS.find((tab) => tab.value === activeProjectStatus) || PROJECT_STATUS_TABS[0];

  const buildTaskParams = () => ({
    search: searchTerm.trim() || undefined,
    project_status: activeProjectStatus,
    status: taskStatusFilter || undefined,
    priority: priorityFilter || undefined,
    page_size: 100
  });

  const refreshTasks = () => dispatch(fetchTasks(buildTaskParams()));

  useEffect(() => {
    dispatch(fetchTasks({
      search: searchTerm.trim() || undefined,
      project_status: activeProjectStatus,
      status: taskStatusFilter || undefined,
      priority: priorityFilter || undefined,
      page_size: 100
    }));
  }, [dispatch, searchTerm, activeProjectStatus, taskStatusFilter, priorityFilter]);

  const handleProjectStatusChange = (tab) => {
    setActiveProjectStatus(tab.value);
    setTaskStatusFilter(tab.defaultTaskStatus);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setPriorityFilter('');
    setTaskStatusFilter(activeTab.defaultTaskStatus);
  };

  const hasCustomFilters = Boolean(
    searchTerm.trim() ||
    priorityFilter ||
    taskStatusFilter !== activeTab.defaultTaskStatus
  );

  const taskStatusSummary = taskStatusFilter
    ? `${TASK_STATUS_LABELS[taskStatusFilter]} tasks`
    : 'All tasks';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading tracking-tight">Tasks</h1>
          <p className="text-subtle text-sm mt-1">Switch between project statuses and review the matching tasks without fighting the layout.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center bg-surface border border-border rounded-lg p-1">
            <button 
              type="button"
              aria-pressed={viewMode === 'list'}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-muted-bg text-heading' : 'text-subtle hover:text-heading'}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <List size={18} />
            </button>
            <button 
              type="button"
              aria-pressed={viewMode === 'board'}
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

      <div className="rounded-2xl border border-border bg-surface p-4 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-heading">Project Status Tabs</p>
            <p className="text-xs text-subtle mt-1">{activeTab.helper}</p>
          </div>

          <div className="overflow-x-auto pb-1 lg:pb-0">
            <div className="flex min-w-max gap-2">
              {PROJECT_STATUS_TABS.map((tab) => {
                const isActive = tab.value === activeProjectStatus;

                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => handleProjectStatusChange(tab)}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                      isActive
                        ? 'border-primary-500 bg-primary-500 text-white shadow-soft'
                        : 'border-border bg-background text-subtle hover:border-primary-500/40 hover:text-heading'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 xl:flex-row">
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
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:flex">
          <select
            className="w-full sm:w-40 bg-surface border border-border rounded-lg px-4 py-2 text-sm text-heading focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            value={taskStatusFilter}
            onChange={(e) => setTaskStatusFilter(e.target.value)}
          >
            <option value="">All Task Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
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

      <div className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-subtle shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing <span className="font-medium text-heading">{taskStatusSummary}</span> from{' '}
            <span className="font-medium text-heading">{activeTab.label.toLowerCase()} projects</span>.
          </p>

          {hasCustomFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-left text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      <div className="min-h-[320px]">
        {loading ? (
          <div className={`grid gap-4 ${viewMode === 'board' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}`}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-56 bg-surface rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : viewMode === 'board' ? (
          <KanbanBoard tasks={tasks} onTaskStatusUpdated={refreshTasks} />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <TaskCard key={task.id} task={task} onStatusUpdated={refreshTasks} />
              ))
            ) : (
              <div className="col-span-full rounded-2xl border border-dashed border-border bg-surface px-6 py-14 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted-bg text-subtle">
                  <FolderKanban size={24} />
                </div>
                <h3 className="text-lg font-semibold text-heading">No tasks found</h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-subtle">
                  {hasCustomFilters
                    ? 'Try clearing the search or filter values to widen the results.'
                    : `There are no ${taskStatusSummary.toLowerCase()} in ${activeTab.label.toLowerCase()} projects right now.`}
                </p>
                {hasCustomFilters && (
                  <div className="mt-5">
                    <Button variant="ghost" onClick={resetFilters}>
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* New Task Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task" size="md">
        <TaskForm onClose={() => setIsModalOpen(false)} onSuccess={refreshTasks} />
      </Modal>
    </div>
  );
};

export default TaskListPage;
