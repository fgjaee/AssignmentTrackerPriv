
import { DayOfWeek, Availability, Tag, TagType } from './types';

export const APP_NAME = "ShiftShare (Manager's Edition)";
export const TAGLINE = "Your intelligent shift planner.";

export const EFFORT_POINT_MIN = 1;
export const EFFORT_POINT_MAX = 10;

export const TASK_CATEGORIES = ["Stocking", "Cleaning", "Merchandising", "Customer Service", "Ordering", "Training", "Maintenance", "Admin"];

export const DAYS_OF_WEEK_ORDERED: DayOfWeek[] = [
  DayOfWeek.Mon,
  DayOfWeek.Tue,
  DayOfWeek.Wed,
  DayOfWeek.Thu,
  DayOfWeek.Fri,
  DayOfWeek.Sat,
  DayOfWeek.Sun,
];

export const ALL_AVAILABILITIES: Availability[] = [
  Availability.NOT_SET,
  Availability.AM_SHIFT,
  Availability.PM_SHIFT,
  Availability.FLEXIBLE,
  Availability.UNAVAILABLE,
];

export const DEFAULT_TAGS: Tag[] = [
  { id: 'strength-fast-stocker', name: 'Fast Stocker', type: TagType.STRENGTH },
  { id: 'strength-detail-oriented', name: 'Detail-Oriented', type: TagType.STRENGTH },
  { id: 'strength-great-merchandiser', name: 'Great Merchandiser', type: TagType.STRENGTH },
  { id: 'strength-customer-facing', name: 'Customer-Facing', type: TagType.STRENGTH },
  { id: 'strength-organized', name: 'Organized', type: TagType.STRENGTH },
  { id: 'weakness-speed-improvement', name: 'Needs Speed Improvement', type: TagType.WEAKNESS },
  { id: 'weakness-less-detail', name: 'Less Detail-Oriented', type: TagType.WEAKNESS },
  { id: 'weakness-avoid-heavy-lifting', name: 'Avoid Heavy Lifting', type: TagType.WEAKNESS },
  { id: 'specialty-ordering-pro', name: 'Ordering Pro', type: TagType.SPECIALTY },
  { id: 'specialty-tech-savvy', name: 'Tech Savvy', type: TagType.SPECIALTY },
  { id: 'specialty-new-hire-training', name: 'New Hire Training', type: TagType.SPECIALTY },
  { id: 'specialty-signage-expert', name: 'Signage Expert', type: TagType.SPECIALTY },
];

export const UNASSIGNED_COLUMN_ID = 'unassigned-tasks';

// Helper to get today's DayOfWeek
export const getTodayDayOfWeek = (): DayOfWeek => {
  const dayIndex = new Date().getDay(); // Sunday - 0, Monday - 1, ..., Saturday - 6
  const daysMap: DayOfWeek[] = [
    DayOfWeek.Sun, DayOfWeek.Mon, DayOfWeek.Tue, DayOfWeek.Wed, DayOfWeek.Thu, DayOfWeek.Fri, DayOfWeek.Sat
  ];
  return daysMap[dayIndex];
};
