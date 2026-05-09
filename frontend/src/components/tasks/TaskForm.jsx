import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, updateTask } from '../../store/slices/taskSlice';
import { fetchProjects } from '../../store/slices/projectSlice';
import api from '../../api/axios';
import toast from 'react-hot-toast';

import Input from '../common/Input';
import Button from '../common/Button';

const TaskForm = ({ task, onClose }) => {
  const isEditing = !!task;
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: isEditing ? {
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      deadline: task.deadline ? task.deadline.split('T')[0] : '',
      project: task.project,
      assigned_to: task.assigned_to || ''
    } : {
      priority: 'medium',
      status: 'todo',
    }
  });

  const selectedProjectId = watch('project');

  // Fetch projects
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await api.get('/projects/', { params: { page_size: 100 } });
        setProjects(response.data.results || response.data);
      } catch (err) {
        console.error("Failed to load projects", err);
      }
    };
    loadProjects();
  }, []);

  // Fetch team members when project changes
  useEffect(() => {
    if (!selectedProjectId) {
      setTeamMembers([]);
      return;
    }
    
    const loadProjectMembers = async () => {
      try {
        const response = await api.get(`/projects/${selectedProjectId}/`);
        setTeamMembers(response.data.team_members_detail || []);
      } catch (err) {
        console.error("Failed to load project members", err);
      }
    };
    loadProjectMembers();
  }, [selectedProjectId]);

  const onSubmit = async (data) => {
    setLoading(true);
    
    // Cleanup data
    if (!data.assigned_to) data.assigned_to = null;
    if (!data.deadline) data.deadline = null;

    try {
      let action;
      if (isEditing) {
        // Only admin can update all fields. Members can only update status (but this form shouldn't show up for members editing someone else's task)
        action = await dispatch(updateTask({ id: task.id, data }));
      } else {
        action = await dispatch(createTask(data));
      }

      if (action.meta.requestStatus === 'fulfilled') {
        toast.success(`Task ${isEditing ? 'updated' : 'created'} successfully`);
        onClose();
      } else {
        let errMsg = 'Operation failed';
        if (action.payload?.errors) {
            const errs = action.payload.errors;
            const firstKey = Object.keys(errs)[0];
            errMsg = `${firstKey}: ${errs[firstKey][0]}`;
        } else if (action.payload?.message) {
            errMsg = action.payload.message;
        }
        toast.error(errMsg);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Task Title"
        placeholder="What needs to be done?"
        error={errors.title?.message}
        {...register('title', { required: 'Task title is required' })}
      />

      <div className="flex flex-col space-y-1.5">
        <label className="text-sm font-medium text-body">Description</label>
        <textarea
          className="flex min-h-[100px] w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-heading placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors custom-scrollbar"
          placeholder="Add details..."
          {...register('description')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col space-y-1.5">
          <label className="text-sm font-medium text-body">Project</label>
          <select
            className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
            {...register('project', { required: 'Project is required' })}
          >
            <option value="">Select a project</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          {errors.project && <span className="text-xs text-danger-500">{errors.project.message}</span>}
        </div>

        <div className="flex flex-col space-y-1.5">
          <label className="text-sm font-medium text-body">Assign To</label>
          <select
            className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors disabled:opacity-50"
            disabled={!selectedProjectId}
            {...register('assigned_to')}
          >
            <option value="">Unassigned</option>
            {teamMembers.map(m => (
              <option key={m.id} value={m.id}>{m.full_name}</option>
            ))}
          </select>
          {!selectedProjectId && <span className="text-xs text-faint">Select a project first</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="flex flex-col space-y-1.5">
          <label className="text-sm font-medium text-body">Priority</label>
          <select
            className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
            {...register('priority')}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="flex flex-col space-y-1.5">
          <label className="text-sm font-medium text-body">Status</label>
          <select
            className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
            {...register('status')}
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <Input
          label="Deadline"
          type="date"
          error={errors.deadline?.message}
          {...register('deadline')}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
        <Button variant="ghost" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={loading}>
          {isEditing ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
