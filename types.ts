
export enum DayOfWeek {
  Mon = "Monday",
  Tue = "Tuesday",
  Wed = "Wednesday",
  Thu = "Thursday",
  Fri = "Friday",
  Sat = "Saturday",
  Sun = "Sunday",
}

export enum Availability {
  AM_SHIFT = "AM Shift",
  PM_SHIFT = "PM Shift",
  FLEXIBLE = "Flexible",
  UNAVAILABLE = "Unavailable",
  NOT_SET = "Not Set",
}

export type SchedulePattern = {
  [key in DayOfWeek]: Availability;
};

export enum TagType {
  STRENGTH = "Strength",
  WEAKNESS = "Weakness",
  SPECIALTY = "Specialty",
}

export interface Tag {
  id: string;
  name: string;
  type: TagType;
}

export interface TeamMember {
  id: string;
  photoUrl?: string; // base64 string
  fullName: string;
  contact: string; // email or phone
  schedule: SchedulePattern;
  attributes: Tag[];
  notes: string;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  effortPoints: number; // 1-10
  category: string;
  recommendedAttributes: Tag[]; // Tags that are beneficial for this task
}

export interface AssignedTask extends Task {
  assignedTo: string | null; // Team member ID
}

export interface ShiftPlan {
  id: string;
  date: string; // ISO date string
  teamMemberIds: string[]; // IDs of members working this shift
  tasks: AssignedTask[];
  finalized: boolean;
}

export interface DraggableTaskItem extends AssignedTask {
  originalColumnId: string; // To track which member it came from during DND
}
