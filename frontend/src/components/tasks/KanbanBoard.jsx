import React from 'react';
import TaskCard from './TaskCard';

const KanbanBoard = ({ tasks }) => {
  // Columns definition based on status
  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-muted-bg border-t-4 border-border-subtle' },
    { id: 'in_progress', title: 'In Progress', color: 'bg-muted-bg border-t-4 border-primary-500' },
    { id: 'completed', title: 'Completed', color: 'bg-muted-bg border-t-4 border-success-500' },
    { id: 'overdue', title: 'Overdue', color: 'bg-muted-bg border-t-4 border-danger-500' },
  ];

  const getTasksByStatus = (statusId) => {
    return tasks.filter(task => {
      if (statusId === 'overdue') return task.is_overdue && task.status !== 'completed';
      if (task.is_overdue && task.status !== 'completed') return false; // Put overdue tasks ONLY in overdue column
      return task.status === statusId;
    });
  };

  return (
    <div className="flex flex-nowrap items-start gap-6 overflow-x-auto pb-6 h-full min-h-[500px] custom-scrollbar">
      {columns.map(column => {
        const columnTasks = getTasksByStatus(column.id);
        
        return (
          <div key={column.id} className={`flex flex-col min-w-[300px] w-[300px] rounded-xl border border-border shrink-0 ${column.color}`}>
            <div className="p-4 flex justify-between items-center bg-surface/50 rounded-t-lg">
              <h3 className="font-semibold text-heading">{column.title}</h3>
              <span className="bg-border text-body text-xs font-bold px-2 py-1 rounded-full">
                {columnTasks.length}
              </span>
            </div>
            
            <div className="flex-1 p-3 flex flex-col gap-3 min-h-[150px]">
              {columnTasks.length > 0 ? (
                columnTasks.map(task => (
                  <TaskCard key={task.id} task={task} isKanban={true} />
                ))
              ) : (
                <div className="flex-1 flex items-center justify-center border-2 border-dashed border-border-subtle rounded-lg p-6 text-center text-sm text-subtle">
                  Drop tasks here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
