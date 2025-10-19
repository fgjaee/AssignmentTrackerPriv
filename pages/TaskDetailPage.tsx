
import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Task } from '../types';
import { AppDataContext } from '../App';
import { TaskForm } from '../components/tasks/TaskForm';
import { TagBadge } from '../components/common/TagBadge';
import { EditIcon } from '../components/common/Icon';

const TaskDetailPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const appContext = useContext(AppDataContext);
  
  const [task, setTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (appContext && taskId) {
      const foundTask = appContext.tasks.find(t => t.id === taskId);
      setTask(foundTask || null);
      if (!foundTask) {
        // navigate('/tasks');
      }
    }
  }, [appContext, taskId, navigate]);

  if (!appContext) return <div>Loading context...</div>;
  if (!task) return <div>Task not found. <button onClick={() => navigate('/tasks')} className="text-primary-600 hover:underline">Return to Task Library</button></div>;

  const { updateTask } = appContext;

  const handleEditSubmit = (updatedTaskData: Task) => {
    updateTask(updatedTaskData);
    setTask(updatedTaskData); // Update local state
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit {task.name}</h2>
        <TaskForm task={task} onSubmit={handleEditSubmit} onCancel={() => setIsEditing(false)} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-white shadow-xl rounded-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
            <h2 className="text-3xl font-bold text-primary-700">{task.name}</h2>
            <p className="text-md text-gray-500">Category: {task.category} &bull; Effort: {task.effortPoints}</p>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="bg-secondary-500 hover:bg-secondary-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md inline-flex items-center"
        >
          <EditIcon className="w-5 h-5 mr-2"/> Edit Task
        </button>
      </div>

      {task.description && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-1">Description</h3>
          <p className="text-gray-600 bg-gray-50 p-3 rounded-md whitespace-pre-wrap">{task.description}</p>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-1">Recommended Attributes</h3>
        {task.recommendedAttributes.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {task.recommendedAttributes.map(attr => <TagBadge key={attr.id} tag={attr} />)}
          </div>
        ) : (
          <p className="text-gray-500 italic">No recommended attributes for this task.</p>
        )}
      </div>
      
      <button
        onClick={() => navigate('/tasks')}
        className="mt-8 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-800 border border-primary-600 rounded-md"
      >
        Back to Task Library
      </button>
    </div>
  );
};

export default TaskDetailPage;
