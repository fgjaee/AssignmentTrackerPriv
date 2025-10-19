
import { TeamMember, Task, Tag, ShiftPlan } from '../types';
import { DEFAULT_TAGS } from '../constants';

const TEAM_MEMBERS_KEY = 'shiftShare_teamMembers';
const TASKS_KEY = 'shiftShare_tasks';
const TAGS_KEY = 'shiftShare_tags';
const SHIFT_PLANS_KEY = 'shiftShare_shiftPlans';

// Initialize default tags if not present
const initializeDefaultTags = (): Tag[] => {
  const storedTags = localStorage.getItem(TAGS_KEY);
  if (!storedTags) {
    localStorage.setItem(TAGS_KEY, JSON.stringify(DEFAULT_TAGS));
    return DEFAULT_TAGS;
  }
  try {
    return JSON.parse(storedTags);
  } catch {
    localStorage.setItem(TAGS_KEY, JSON.stringify(DEFAULT_TAGS)); // Fallback on parse error
    return DEFAULT_TAGS;
  }
};
initializeDefaultTags();


// Team Members
export const getTeamMembers = (): TeamMember[] => {
  const data = localStorage.getItem(TEAM_MEMBERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTeamMembers = (members: TeamMember[]): void => {
  localStorage.setItem(TEAM_MEMBERS_KEY, JSON.stringify(members));
};

export const addTeamMember = (member: TeamMember): void => {
  const members = getTeamMembers();
  saveTeamMembers([...members, member]);
};

export const updateTeamMember = (updatedMember: TeamMember): void => {
  let members = getTeamMembers();
  members = members.map(m => m.id === updatedMember.id ? updatedMember : m);
  saveTeamMembers(members);
};

export const deleteTeamMember = (memberId: string): void => {
  let members = getTeamMembers();
  members = members.filter(m => m.id !== memberId);
  saveTeamMembers(members);
};

// Tasks
export const getTasks = (): Task[] => {
  const data = localStorage.getItem(TASKS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTasks = (tasks: Task[]): void => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

export const addTask = (task: Task): void => {
  const tasks = getTasks();
  saveTasks([...tasks, task]);
};

export const updateTask = (updatedTask: Task): void => {
  let tasks = getTasks();
  tasks = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
  saveTasks(tasks);
};

export const deleteTask = (taskId: string): void => {
  let tasks = getTasks();
  tasks = tasks.filter(t => t.id !== taskId);
  saveTasks(tasks);
};

// Tags
export const getTags = (): Tag[] => {
  const data = localStorage.getItem(TAGS_KEY);
  return data ? JSON.parse(data) : DEFAULT_TAGS;
};

export const saveTags = (tags: Tag[]): void => {
  localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
};

export const addTag = (tag: Tag): void => {
  const tags = getTags();
  if (!tags.find(t => t.id === tag.id || t.name.toLowerCase() === tag.name.toLowerCase())) {
    saveTags([...tags, tag]);
  }
};


// Shift Plans
export const getShiftPlans = (): ShiftPlan[] => {
  const data = localStorage.getItem(SHIFT_PLANS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveShiftPlans = (plans: ShiftPlan[]): void => {
  localStorage.setItem(SHIFT_PLANS_KEY, JSON.stringify(plans));
};

export const addShiftPlan = (plan: ShiftPlan): void => {
  const plans = getShiftPlans();
  saveShiftPlans([...plans, plan]);
};

export const updateShiftPlan = (updatedPlan: ShiftPlan): void => {
  let plans = getShiftPlans();
  plans = plans.map(p => p.id === updatedPlan.id ? updatedPlan : p);
  saveShiftPlans(plans);
};
