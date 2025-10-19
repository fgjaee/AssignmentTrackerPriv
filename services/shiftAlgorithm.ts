
import { TeamMember, Task, AssignedTask, TagType, Availability } from '../types';
import { UNASSIGNED_COLUMN_ID } from '../constants';

interface SmartListParams {
  selectedTeamMembers: TeamMember[];
  selectedTasks: Task[];
}

interface AssignedTasksByMember {
  [memberIdOrUnassigned: string]: AssignedTask[];
}

export const generateSmartList = ({ selectedTeamMembers, selectedTasks }: SmartListParams): AssignedTasksByMember => {
  const assignments: AssignedTasksByMember = {};
  selectedTeamMembers.forEach(member => {
    assignments[member.id] = [];
  });
  assignments[UNASSIGNED_COLUMN_ID] = [];

  const memberEffort: { [memberId: string]: number } = {};
  selectedTeamMembers.forEach(member => {
    memberEffort[member.id] = 0;
  });

  let remainingTasks: AssignedTask[] = selectedTasks.map(task => ({ ...task, assignedTo: null }));

  // Phase 1: Assign tasks with recommended attributes
  const tasksWithRecAttribs = remainingTasks.filter(task => task.recommendedAttributes.length > 0);
  const tasksWithoutRecAttribs = remainingTasks.filter(task => task.recommendedAttributes.length === 0);
  
  tasksWithRecAttribs.forEach(task => {
    let assigned = false;
    // Sort members by current effort to give preference to less loaded ones
    const sortedMembers = [...selectedTeamMembers].sort((a, b) => memberEffort[a.id] - memberEffort[b.id]);

    for (const member of sortedMembers) {
      const memberStrengthsAndSpecialties = member.attributes.filter(
        attr => attr.type === TagType.STRENGTH || attr.type === TagType.SPECIALTY
      ).map(attr => attr.id);
      
      const memberWeaknesses = member.attributes.filter(
        attr => attr.type === TagType.WEAKNESS
      ).map(attr => attr.id);

      const taskRecommendedAttrIds = task.recommendedAttributes.map(attr => attr.id);

      // Check for weakness conflict: if any of task's rec attributes are a weakness for member
      const weaknessConflict = taskRecommendedAttrIds.some(recAttrId => memberWeaknesses.includes(recAttrId));
      if (weaknessConflict) continue;

      // Check for strength/specialty match
      const hasRecommendedAttribute = taskRecommendedAttrIds.some(recAttrId => memberStrengthsAndSpecialties.includes(recAttrId));

      if (hasRecommendedAttribute) {
        assignments[member.id].push({ ...task, assignedTo: member.id });
        memberEffort[member.id] += task.effortPoints;
        assigned = true;
        // Remove from remainingTasks
        remainingTasks = remainingTasks.filter(rt => rt.id !== task.id);
        break; 
      }
    }
    if (!assigned) {
       // If not assigned in phase 1 (e.g. no suitable member or all suitable members have conflicts), keep for phase 2
       // But it should already be in remainingTasks unless it was filtered out (which it isn't here).
       // It will be handled by the next phase.
    }
  });
  
  // Update remainingTasks after attribute-based assignment
  remainingTasks = tasksWithoutRecAttribs.concat(
    tasksWithRecAttribs.filter(task => !Object.values(assignments).flat().find(at => at.id === task.id))
  );


  // Phase 2: Distribute remaining tasks, balancing effort and avoiding weaknesses
  remainingTasks.sort((a,b) => b.effortPoints - a.effortPoints); // Assign high-effort tasks first

  remainingTasks.forEach(task => {
    let assigned = false;
    const sortedMembers = [...selectedTeamMembers].sort((a, b) => memberEffort[a.id] - memberEffort[b.id]);

    for (const member of sortedMembers) {
      const memberWeaknesses = member.attributes.filter(
        attr => attr.type === TagType.WEAKNESS
      ).map(attr => attr.id);
      
      // Check if any of task's recommended attributes (if any) match a member's weakness
      // This is a simplified check. A more robust check might involve mapping task types/nature to general weaknesses.
      const taskRecommendedAttrIds = task.recommendedAttributes.map(attr => attr.id);
      const weaknessConflict = taskRecommendedAttrIds.some(recAttrId => memberWeaknesses.includes(recAttrId));
      
      if (weaknessConflict) continue; // Skip if there's a weakness conflict

      // Assign to the member with the least effort who doesn't have a conflict
      assignments[member.id].push({ ...task, assignedTo: member.id });
      memberEffort[member.id] += task.effortPoints;
      assigned = true;
      break;
    }

    if (!assigned) {
      // If task couldn't be assigned (e.g., all members have conflicts or some other reason)
      assignments[UNASSIGNED_COLUMN_ID].push({ ...task, assignedTo: null });
    }
  });
  
  return assignments;
};
