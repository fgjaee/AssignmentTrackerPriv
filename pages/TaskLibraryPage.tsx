
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Task, Tag } from '../types';
import { AppDataContext } from '../App';
import { Modal } from '../components/common/Modal';
import { TaskForm } from '../components/tasks/TaskForm';
import { PlusIcon, EditIcon, DeleteIcon } from '../components/common/Icon';
import { TagBadge } from '../components/common/TagBadge';

const TaskCard: React.FC<{ task: Task; onDelete: (id: string) => void; }> = ({ task, onDelete }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white shadow-lg rounded-lg p-5 transition-shadow hover:shadow-xl">
      <h3 className="text-xl font-semibold text-primary-700 mb-2">{task.name}</h3>
      <p className="text-sm text-gray-500 mb-1">Category: {task.category}</p>
      <p className="text-sm text-gray-500 mb-3">Effort: {task.effortPoints}</p>
      {task.description && <p className="text-sm text-gray-600 mb-3 italic">"{task.description}"</p>}
      {task.recommendedAttributes.length > 0 && (
        <div className="mb-3">
            <p className="text-xs font-medium text-gray-500 mb-1">Recommended Attributes:</p>
            <div className="flex flex-wrap gap-1">
                {task.recommendedAttributes.map(attr => <TagBadge key={attr.id} tag={attr} />)}
            </div>
        </div>
      )}
      <div className="mt-4 flex justify-end space-x-2">
        <button 
          onClick={() => navigate(`/tasks/${task.id}`)} 
          className="p-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md shadow-sm inline-flex items-center"
        >
          <EditIcon className="w-4 h-4 mr-1" /> View/Edit
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); if(window.confirm(`Are you sure you want to delete "${task.name}"?`)) onDelete(task.id); }}
          className="p-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md shadow-sm inline-flex items-center"
        >
          <DeleteIcon className="w-4 h-4 mr-1" /> Delete
        </button>
      </div>
    </div>
  );
};


const TaskLibraryPage: React.FC = () => {
  const appContext = useContext(AppDataContext);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  if (!appContext) return <div>Loading...</div>;

  const { tasks, addTask, deleteTask } = appContext;

  const handleAddTask = (newTask: Task) => {
    addTask(newTask);
    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
  }

  const filteredTasks = tasks.filter(task =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Task Library</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md inline-flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add New Task
        </button>
      </div>

       <input
        type="text"
        placeholder="Search tasks by name or category..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 mb-6 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
      />

      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
         <p className="text-center text-gray-500 py-10">
          No tasks found. {searchTerm && "Try adjusting your search or "}
          <button onClick={() => setIsAddModalOpen(true)} className="text-primary-600 hover:underline">add a new task</button>.
        </p>
      )}

      <Modal title="Add New Task" isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} size="lg">
        <TaskForm onSubmit={handleAddTask} onCancel={() => setIsAddModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default TaskLibraryPage;
