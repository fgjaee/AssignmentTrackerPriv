
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import HomePage from './pages/HomePage';
import TeamHubPage from './pages/TeamHubPage';
import TeamMemberDetailPage from './pages/TeamMemberDetailPage';
import TaskLibraryPage from './pages/TaskLibraryPage';
import TaskDetailPage from './pages/TaskDetailPage';
import ShiftPlannerPage from './pages/ShiftPlanner/ShiftPlannerPage';
import ShiftHistoryPage from './pages/ShiftHistoryPage';
import ViewGeneratedPlanPage from './pages/ViewGeneratedPlanPage';
import { useLocalStorage } from './hooks/useLocalStorage';
import { TeamMember, Task, Tag, ShiftPlan } from './types';
import { DEFAULT_TAGS } from './constants';
import * as storageService from './services/storageService';


// React DND is a peer dependency of react-beautiful-dnd, ensure it is available.
// For this environment, we assume these are globally available or handled by the platform.
// If using npm, you would `npm install react-beautiful-dnd`
// import { DragDropContext } from 'react-beautiful-dnd'; // Example import


export const AppDataContext = React.createContext<{
  teamMembers: TeamMember[];
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  tags: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  shiftPlans: ShiftPlan[];
  setShiftPlans: React.Dispatch<React.SetStateAction<ShiftPlan[]>>;
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  updateTeamMember: (member: TeamMember) => void;
  deleteTeamMember: (id: string) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  addCustomTag: (tag: Omit<Tag, 'id'>) => Tag;
  addShiftPlan: (plan: Omit<ShiftPlan, 'id'|'finalized'>) => ShiftPlan;
  updateShiftPlanState: (plan: ShiftPlan) => void;
} | null>(null);


const App: React.FC = () => {
  const [teamMembers, setTeamMembers] = useLocalStorage<TeamMember[]>(
    'shiftShare_teamMembers',
    () => storageService.getTeamMembers() // Load initial from storageService
  );
  const [tasks, setTasks] = useLocalStorage<Task[]>(
    'shiftShare_tasks',
    () => storageService.getTasks()
  );
  const [tags, setTags] = useLocalStorage<Tag[]>(
    'shiftShare_tags',
    () => storageService.getTags().length > 0 ? storageService.getTags() : DEFAULT_TAGS
  );
   const [shiftPlans, setShiftPlans] = useLocalStorage<ShiftPlan[]>(
    'shiftShare_shiftPlans',
    () => storageService.getShiftPlans()
  );

  useEffect(() => {
    // Ensure default tags are loaded if local storage for tags is empty
    if (storageService.getTags().length === 0) {
      storageService.saveTags(DEFAULT_TAGS);
      setTags(DEFAULT_TAGS);
    }
  }, [setTags]);


  const handleAddTeamMember = (memberData: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = { ...memberData, id: crypto.randomUUID() };
    setTeamMembers(prev => [...prev, newMember]);
  };

  const handleUpdateTeamMember = (updatedMember: TeamMember) => {
    setTeamMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
  };
  
  const handleDeleteTeamMember = (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
  };

  const handleAddTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = { ...taskData, id: crypto.randomUUID() };
    setTasks(prev => [...prev, newTask]);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleAddCustomTag = (tagData: Omit<Tag, 'id'>): Tag => {
    const newTag: Tag = { ...tagData, id: `custom-${crypto.randomUUID()}`};
    // Check for duplicates by name and type before adding
    if (!tags.find(t => t.name.toLowerCase() === newTag.name.toLowerCase() && t.type === newTag.type)) {
      setTags(prev => [...prev, newTag]);
      return newTag;
    }
    return tags.find(t => t.name.toLowerCase() === newTag.name.toLowerCase() && t.type === newTag.type) || newTag; // Should return existing if duplicate
  };
  
  const handleAddShiftPlan = (planData: Omit<ShiftPlan, 'id'|'finalized'>): ShiftPlan => {
    const newPlan: ShiftPlan = { ...planData, id: crypto.randomUUID(), finalized: false };
    setShiftPlans(prev => [...prev, newPlan]);
    return newPlan;
  };

  const handleUpdateShiftPlanState = (updatedPlan: ShiftPlan) => {
    setShiftPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
  };

  return (
    <AppDataContext.Provider value={{ 
      teamMembers, setTeamMembers, tasks, setTasks, tags, setTags, shiftPlans, setShiftPlans,
      addTeamMember: handleAddTeamMember, 
      updateTeamMember: handleUpdateTeamMember,
      deleteTeamMember: handleDeleteTeamMember,
      addTask: handleAddTask,
      updateTask: handleUpdateTask,
      deleteTask: handleDeleteTask,
      addCustomTag: handleAddCustomTag,
      addShiftPlan: handleAddShiftPlan,
      updateShiftPlanState: handleUpdateShiftPlanState,
    }}>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/team" element={<TeamHubPage />} />
          <Route path="/team/:memberId" element={<TeamMemberDetailPage />} />
          <Route path="/tasks" element={<TaskLibraryPage />} />
          <Route path="/tasks/:taskId" element={<TaskDetailPage />} />
          <Route path="/plan-shift" element={<ShiftPlannerPage />} />
          <Route path="/plan/:planId/view" element={<ViewGeneratedPlanPage />} />
          <Route path="/history" element={<ShiftHistoryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </AppDataContext.Provider>
  );
};

export default App;
