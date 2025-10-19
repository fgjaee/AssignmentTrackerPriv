
import React, { useState, useEffect, useContext } from 'react';
import { Task, Tag, TagType } from '../../types';
import { EFFORT_POINT_MIN, EFFORT_POINT_MAX, TASK_CATEGORIES } from '../../constants';
import { TagInput } from '../common/TagInput';
import { AppDataContext } from '../../App';

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (task: Task) => void;
  onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [effortPoints, setEffortPoints] = useState<number>(EFFORT_POINT_MIN);
  const [category, setCategory] = useState<string>(TASK_CATEGORIES[0]);
  const [recommendedAttributes, setRecommendedAttributes] = useState<Tag[]>([]);
  
  const appContext = useContext(AppDataContext);

  useEffect(() => {
    if (task) {
      setName(task.name);
      setDescription(task.description);
      setEffortPoints(task.effortPoints);
      setCategory(task.category);
      setRecommendedAttributes(task.recommendedAttributes);
    } else {
      // Reset for new task
      setName('');
      setDescription('');
      setEffortPoints(EFFORT_POINT_MIN);
      setCategory(TASK_CATEGORIES[0]);
      setRecommendedAttributes([]);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !category.trim()) {
        alert("Task name and category are required.");
        return;
    }
    const taskData: Omit<Task, 'id'> = {
      name,
      description,
      effortPoints,
      category,
      recommendedAttributes,
    };
    onSubmit({ ...taskData, id: task?.id || crypto.randomUUID() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="taskName" className="block text-sm font-medium text-gray-700">Task Name</label>
        <input
          type="text"
          id="taskName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="taskDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="effortPoints" className="block text-sm font-medium text-gray-700">Effort Points ({EFFORT_POINT_MIN}-{EFFORT_POINT_MAX})</label>
          <input
            type="number"
            id="effortPoints"
            value={effortPoints}
            onChange={(e) => setEffortPoints(Math.max(EFFORT_POINT_MIN, Math.min(EFFORT_POINT_MAX, parseInt(e.target.value))))}
            min={EFFORT_POINT_MIN}
            max={EFFORT_POINT_MAX}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            {TASK_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-800 mb-2">Recommended Attributes</h4>
        <TagInput
          selectedTags={recommendedAttributes}
          onTagsChange={setRecommendedAttributes}
          availableTagTypes={[TagType.STRENGTH, TagType.SPECIALTY]} // Only strengths/specialties are typically "recommended"
          placeholder="Add attributes beneficial for this task..."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md shadow-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md shadow-sm"
        >
          {task ? 'Save Changes' : 'Add Task'}
        </button>
      </div>
    </form>
  );
};
