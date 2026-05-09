import React from 'react';
import { FolderKanban, Users, CheckSquare, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  const statusColors = {
    pending: 'bg-warning-500 text-warning-500 border-warning-500/20',
    in_progress: 'bg-primary-500 text-primary-500 border-primary-500/20',
    completed: 'bg-success-500 text-success-500 border-success-500/20'
  };

  const statusLabels = {
    pending: 'Pending',
    in_progress: 'In Progress',
    completed: 'Completed'
  };

  return (
    <Link to={`/projects/${project.id}`} className="block group">
      <div className="bg-surface border border-border rounded-xl p-5 hover:border-primary-500/50 shadow-soft hover:shadow-md hover:-translate-y-1 transition-all duration-300">
        
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 rounded-lg bg-muted-bg text-subtle group-hover:bg-primary-500/10 group-hover:text-primary-500 transition-colors">
            <FolderKanban size={20} />
          </div>
          <span className={`px-2.5 py-1 text-xs font-medium border rounded-full bg-opacity-10 ${statusColors[project.status]}`}>
            {statusLabels[project.status]}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-heading mb-1 group-hover:text-primary-500 transition-colors line-clamp-1">
          {project.name}
        </h3>
        <p className="text-sm text-subtle mb-6 line-clamp-2 min-h-[40px]">
          {project.description || "No description provided."}
        </p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-subtle">Progress</span>
            <span className="font-medium text-heading">{project.progress_percentage}%</span>
          </div>
          <div className="h-1.5 w-full bg-border-subtle rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-500 rounded-full transition-all duration-500" 
              style={{ width: `${project.progress_percentage}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
          <div className="flex gap-4 text-xs text-subtle">
            <div className="flex items-center gap-1.5" title="Tasks">
              <CheckSquare size={14} />
              <span>{project.completed_task_count}/{project.task_count}</span>
            </div>
            <div className="flex items-center gap-1.5" title="Team Members">
              <Users size={14} />
              <span>{project.team_member_count}</span>
            </div>
          </div>
          
          <div className="text-xs text-faint flex items-center gap-1">
            <Clock size={12} />
            {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'No deadline'}
          </div>
        </div>

      </div>
    </Link>
  );
};

export default ProjectCard;
