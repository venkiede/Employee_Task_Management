import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { createProject, updateProject } from '../../store/slices/projectSlice';
import api from '../../api/axios';
import toast from 'react-hot-toast';

import Input from '../common/Input';
import Button from '../common/Button';

const ProjectForm = ({ project, onClose }) => {
  const isEditing = !!project;
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: isEditing ? {
      name: project.name,
      description: project.description,
      status: project.status,
      start_date: project.start_date || '',
      end_date: project.end_date || '',
      team_members: project.team_members ? project.team_members.map(String) : []
    } : {
      status: 'pending',
      team_members: []
    }
  });

  // Fetch users for the team members multi-select
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/auth/users/', { params: { page_size: 100 } });
        setUsers(response.data.results || response.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };
    fetchUsers();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    // Convert string array to number array for the API
    data.team_members = data.team_members ? Array.from(data.team_members).map(Number) : [];
    
    // Clean up empty strings for dates to prevent backend errors
    if (!data.start_date) data.start_date = null;
    if (!data.end_date) data.end_date = null;

    try {
      let action;
      if (isEditing) {
        action = await dispatch(updateProject({ id: project.id, data }));
      } else {
        action = await dispatch(createProject(data));
      }

      if (action.meta.requestStatus === 'fulfilled') {
        toast.success(`Project ${isEditing ? 'updated' : 'created'} successfully`);
        onClose();
      } else {
        // Handle field specific errors from Django backend
        let errMsg = 'Operation failed';
        const payload = action.payload;
        
        if (payload?.errors) {
            const firstKey = Object.keys(payload.errors)[0];
            const errorVal = payload.errors[firstKey];
            errMsg = Array.isArray(errorVal) ? `${firstKey}: ${errorVal[0]}` : `${firstKey}: ${errorVal}`;
        } else if (payload?.message) {
            errMsg = payload.message;
        } else if (typeof payload === 'string') {
            errMsg = payload;
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
        label="Project Name"
        placeholder="e.g., Website Redesign"
        error={errors.name?.message}
        {...register('name', { required: 'Project name is required' })}
      />

      <div className="flex flex-col space-y-1.5">
        <label className="text-sm font-medium text-body">Description</label>
        <textarea
          className="flex min-h-[100px] w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-heading placeholder:text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors custom-scrollbar"
          placeholder="Describe the project goals and scope..."
          {...register('description')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col space-y-1.5">
          <label className="text-sm font-medium text-body">Status</label>
          <select
            className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
            {...register('status')}
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="flex flex-col space-y-1.5">
          <label className="text-sm font-medium text-body">Team Members</label>
          <select
            multiple
            className="flex w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors custom-scrollbar h-24"
            {...register('team_members')}
          >
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>
            ))}
          </select>
          <span className="text-xs text-faint">Hold Ctrl/Cmd to select multiple</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Start Date"
          type="date"
          error={errors.start_date?.message}
          {...register('start_date')}
        />
        <Input
          label="End Date"
          type="date"
          error={errors.end_date?.message}
          {...register('end_date')}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
        <Button variant="ghost" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" isLoading={loading}>
          {isEditing ? 'Save Changes' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;
