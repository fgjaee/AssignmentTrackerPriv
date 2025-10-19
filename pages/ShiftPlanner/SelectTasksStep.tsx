
import React, { useState, useMemo } from 'react';
import { Task, Tag } from '../../types';
import { TagBadge } from '../../components/common/TagBadge';

interface SelectTasksStepProps {
  allTasks: Task[];
  selectedTaskIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const SelectTasksStep: React.FC<SelectTasksStepProps> = ({ allTasks, selectedTaskIds, onSelectionChange, onNext, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleToggleTask = (taskId: string) => {
    const newSelectedIds = selectedTaskIds.includes(taskId)
      ? selectedTaskIds.filter(id => id !== taskId)
      : [...selectedTaskIds, taskId];
    onSelectionChange(newSelectedIds);
  };

  const totalEffortPoints = useMemo(() => {
    return allTasks
      .filter(task => selectedTaskIds.includes(task.id))
      .reduce((sum, task) => sum + task.effortPoints, 0);
  }, [allTasks, selectedTaskIds]);

  const filteredTasks = allTasks.filter(task => 
    task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-2">
      <h3 className="text-xl font-semibold mb-1 text-gray-700">Step 2: What needs to be done?</h3>
      <p className="text-sm text-gray-500 mb-4">Select all tasks for this shift. Total Effort Points: <span className="font-bold text-primary-600">{totalEffortPoints}</span></p>
      
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
      />
      
      {allTasks.length === 0 && <p className="text-gray-500">No tasks available. Please <a href="#/tasks" className="text-primary-600 hover:underline">add tasks to your library</a> first.</p>}

      <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
        {filteredTasks.map(task => (
          <div
            key={task.id}
            onClick={() => handleToggleTask(task.id)}
            className={`flex items-start p-3 rounded-lg border cursor-pointer transition-all duration-200 ease-in-out
                        ${selectedTaskIds.includes(task.id) ? 'bg-secondary-100 border-secondary-500 shadow-md' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
          >
            <input
              type="checkbox"
              checked={selectedTaskIds.includes(task.id)}
              onChange={() => handleToggleTask(task.id)}
              className="form-checkbox h-5 w-5 text-secondary-600 rounded border-gray-300 focus:ring-secondary-500 mr-4 mt-1"
            />
            <div className="flex-grow">
              <span className="font-medium text-gray-800">{task.name}</span>
              <p className="text-xs text-gray-500">Category: {task.category} | Effort: {task.effortPoints}</p>
              {task.recommendedAttributes.length > 0 && (
                <div className="mt-1">
                  {task.recommendedAttributes.map(attr => <TagBadge key={attr.id} tag={attr} className="mr-1 mb-1"/>)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between">
        <button
          onClick={onBack}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-lg shadow-md"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={selectedTaskIds.length === 0}
          className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Generate Smart List
        </button>
      </div>
    </div>
  );
};
