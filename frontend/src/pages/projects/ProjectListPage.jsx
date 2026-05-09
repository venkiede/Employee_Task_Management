import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../../store/slices/projectSlice';
import ProjectCard from '../../components/projects/ProjectCard';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ProjectForm from '../../components/projects/ProjectForm';
import { Plus, Search, Filter, FolderKanban } from 'lucide-react';

const ProjectListPage = () => {
  const dispatch = useDispatch();
  const { list: projects, loading } = useSelector((state) => state.projects || { list: [], loading: false });
  const { user } = useSelector((state) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects({ search: searchTerm, status: statusFilter }));
  }, [dispatch, searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-heading tracking-tight">Projects</h1>
          <p className="text-subtle text-sm mt-1">Manage and track your team's projects.</p>
        </div>
        
        {user?.role === 'admin' && (
          <Button icon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>
            New Project
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-subtle">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-heading placeholder:text-faint focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative w-full sm:w-48">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-subtle">
            <Filter size={18} />
          </div>
          <select
            className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-heading appearance-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-surface rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-surface border border-border border-dashed rounded-xl">
          <div className="w-16 h-16 bg-muted-bg rounded-full flex items-center justify-center mb-4">
            <FolderKanban size={32} className="text-subtle" />
          </div>
          <h3 className="text-lg font-medium text-heading mb-1">No projects found</h3>
          <p className="text-subtle text-sm text-center max-w-sm mb-6">
            {searchTerm || statusFilter 
              ? "We couldn't find any projects matching your filters. Try adjusting them." 
              : "Get started by creating your first project and inviting team members."}
          </p>
          {user?.role === 'admin' && !searchTerm && !statusFilter && (
            <Button icon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>
              Create Project
            </Button>
          )}
        </div>
      )}

      {/* New Project Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project" size="lg">
        <ProjectForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default ProjectListPage;
