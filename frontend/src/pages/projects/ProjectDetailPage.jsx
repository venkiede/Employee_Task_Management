import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectById, deleteProject, clearCurrentProject } from '../../store/slices/projectSlice';
import { FolderKanban, Calendar, Users, Edit, Trash2, ArrowLeft, CheckSquare, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ProjectForm from '../../components/projects/ProjectForm';
// import TaskList from '../../components/tasks/TaskList'; // We'll implement this later

const ProjectDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentProject: project, loading } = useSelector(state => state.projects);
  const { user } = useSelector(state => state.auth);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    dispatch(fetchProjectById(id));
    return () => {
      dispatch(clearCurrentProject());
    };
  }, [dispatch, id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const action = await dispatch(deleteProject(id));
      if (deleteProject.fulfilled.match(action)) {
        toast.success('Project deleted successfully');
        navigate('/projects');
      } else {
        toast.error('Failed to delete project');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (loading || !project) {
    return <div className="animate-pulse space-y-6 p-4">
      <div className="h-8 w-24 bg-surface rounded mb-4"></div>
      <div className="h-48 bg-surface rounded-xl mb-6"></div>
      <div className="h-64 bg-surface rounded-xl"></div>
    </div>;
  }

  const statusColors = {
    pending: 'bg-warning-500 text-warning-500 border-warning-500/20',
    in_progress: 'bg-primary-500 text-primary-500 border-primary-500/20',
    completed: 'bg-success-500 text-success-500 border-success-500/20'
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <Link to="/projects" className="inline-flex items-center text-sm font-medium text-subtle hover:text-heading transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Back to Projects
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

      {/* Project Info Header */}
      <div className="bg-surface border border-border rounded-xl p-6 lg:p-8 shadow-sm relative overflow-hidden">
        {/* Decorative background blob */}
        <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-muted-bg text-primary-500">
                <FolderKanban size={28} />
              </div>
              <span className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider border rounded-full bg-opacity-10 ${statusColors[project.status]}`}>
                {project.status.replace('_', ' ')}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-heading mb-2">{project.name}</h1>
            <p className="text-subtle text-base leading-relaxed max-w-3xl mb-6">
              {project.description || "No description provided for this project."}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-body">
                <Calendar size={16} className="text-subtle" />
                <span>
                  {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'N/A'} - {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'No deadline'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-body">
                <span className="text-subtle text-xs uppercase tracking-wider font-semibold">Created By:</span>
                <span>{project.created_by_name}</span>
              </div>
            </div>
          </div>

          {/* Progress Circle & Stats */}
          <div className="flex flex-col items-center bg-muted-bg p-6 rounded-xl border border-border-subtle min-w-[200px]">
            <div className="text-sm font-medium text-subtle mb-2">Project Progress</div>
            <div className="text-4xl font-bold text-heading mb-4">{project.progress_percentage}%</div>
            
            <div className="w-full bg-border-subtle h-2 rounded-full mb-4 overflow-hidden">
              <div className="bg-primary-500 h-full rounded-full transition-all duration-1000" style={{ width: `${project.progress_percentage}%` }}></div>
            </div>
            
            <div className="w-full flex justify-between text-xs text-subtle mt-2 pt-4 border-t border-border">
              <div className="flex items-center gap-1.5"><CheckSquare size={14}/> {project.completed_task_count}/{project.task_count} Tasks</div>
              <div className="flex items-center gap-1.5"><Users size={14}/> {project.team_members?.length || 0} Members</div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout for the rest */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area - Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-border rounded-xl p-6 min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-heading">Project Tasks</h3>
              {/* <Button size="sm" variant="secondary" icon={<Plus size={16}/>}>Add Task</Button> */}
            </div>
            {/* TaskList component will go here */}
            <div className="flex flex-col items-center justify-center py-12 text-subtle border border-dashed border-border-subtle rounded-lg">
              <CheckSquare size={48} className="mb-4 opacity-20" />
              <p>Task list will be integrated here.</p>
            </div>
          </div>
        </div>

        {/* Sidebar - Team Members */}
        <div className="space-y-6">
          <div className="bg-surface border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-heading mb-6 flex items-center gap-2">
              <Users size={18} className="text-primary-500" />
              Team Members
            </h3>
            
            {project.team_members_detail?.length > 0 ? (
              <div className="space-y-4">
                {project.team_members_detail.map(member => (
                  <div key={member.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted-bg flex items-center justify-center text-xs font-bold text-heading border border-border-subtle">
                        {member.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-heading group-hover:text-primary-500 transition-colors">{member.full_name}</div>
                        <div className="text-xs text-subtle">{member.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-subtle py-4 text-center">No team members assigned.</p>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Project" size="lg">
        <ProjectForm project={project} onClose={() => setIsEditModalOpen(false)} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Project">
        <div className="space-y-4">
          <div className="p-4 bg-danger-500/10 border border-danger-500/20 rounded-lg flex items-start gap-3 text-danger-500">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p className="text-sm">
              Are you sure you want to delete the project <strong>"{project.name}"</strong>? This action cannot be undone and will delete all associated tasks.
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>Delete Project</Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default ProjectDetailPage;
