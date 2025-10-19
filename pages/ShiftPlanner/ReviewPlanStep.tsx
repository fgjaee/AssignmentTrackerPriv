import React, { useState, useEffect, useContext } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { AssignedTask, TeamMember, ShiftPlan } from '../../types';
import { UNASSIGNED_COLUMN_ID } from '../../constants';
import { AppDataContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { PhotoIcon } from '../../components/common/Icon';

interface AssignedTasksByMember {
  [memberIdOrUnassigned: string]: AssignedTask[];
}

interface ReviewPlanStepProps {
  initialAssignments: AssignedTasksByMember;
  teamForShift: TeamMember[];
  currentPlan: ShiftPlan;
  onPlanUpdate: (updatedAssignments: AssignedTasksByMember) => void;
  onBack: () => void;
  onFinalize: (finalPlan: ShiftPlan) => void;
}

// Helper function to reorder tasks within the same list
const reorder = <T,>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

// Helper function to move tasks between lists
const move = <T,>(
  source: T[],
  destination: T[],
  droppableSource: { index: number; droppableId: string },
  droppableDestination: { index: number; droppableId: string }
): { [key: string]: T[] } => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result: { [key: string]: T[] } = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};


export const ReviewPlanStep: React.FC<ReviewPlanStepProps> = ({ initialAssignments, teamForShift, currentPlan, onPlanUpdate, onBack, onFinalize }) => {
  const [assignments, setAssignments] = useState<AssignedTasksByMember>(initialAssignments);
  const navigate = useNavigate();
  const appContext = useContext(AppDataContext);

  useEffect(() => {
    setAssignments(initialAssignments);
  }, [initialAssignments]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    const sId = source.droppableId;
    const dId = destination.droppableId;

    if (sId === dId) { // Moving within the same list
      const items = reorder(assignments[sId], source.index, destination.index);
      const newAssignments = { ...assignments, [sId]: items };
      setAssignments(newAssignments);
      onPlanUpdate(newAssignments);
    } else { // Moving to a different list
      // FIX: Explicitly provide the generic type to `move` to ensure correct type inference.
      const resultMove = move<AssignedTask>(assignments[sId], assignments[dId], source, destination);
      const newAssignments = { ...assignments, ...resultMove };
      
      // Update assignedTo property for the moved task
      const movedTask = newAssignments[dId][destination.index];
      if (movedTask) {
        newAssignments[dId][destination.index] = { ...movedTask, assignedTo: dId === UNASSIGNED_COLUMN_ID ? null : dId };
      }
      
      setAssignments(newAssignments);
      onPlanUpdate(newAssignments);
    }
  };
  
  const calculateTotalEffort = (tasks: AssignedTask[]): number => {
    return tasks.reduce((sum, task) => sum + task.effortPoints, 0);
  };

  const handleFinalizePlan = () => {
     if (!appContext) return;
     // FIX: Replaced reduce with flat() for simplicity and to resolve type inference errors.
     const allAssignedTasks: AssignedTask[] = Object.values(assignments).flat();
     const finalizedPlan: ShiftPlan = {
       ...currentPlan,
       tasks: allAssignedTasks,
       finalized: true,
     };
     appContext.updateShiftPlanState(finalizedPlan);
     onFinalize(finalizedPlan);
     navigate(`/plan/${finalizedPlan.id}/view`);
  };

  const droppableColumns = [...teamForShift, { id: UNASSIGNED_COLUMN_ID, fullName: "Unassigned Tasks" }];

  return (
    <div className="p-2">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Step 3: Review & Refine Plan</h3>
      <p className="text-sm text-gray-500 mb-4">Drag and drop tasks to adjust assignments. Total effort points are shown for each team member.</p>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start">
          {droppableColumns.map((column) => {
            const member = column as TeamMember; // For team members
            const isUnassignedColumn = column.id === UNASSIGNED_COLUMN_ID;
            const columnTasks = assignments[column.id] || [];

            return (
              <Droppable key={column.id} droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-3 rounded-lg shadow-md min-h-[200px]
                                ${snapshot.isDraggingOver ? (isUnassignedColumn ? 'bg-red-50' : 'bg-green-50') : 'bg-gray-100'}`}
                  >
                    <div className="flex items-center justify-between mb-3 pb-2 border-b">
                        <div className="flex items-center">
                            {!isUnassignedColumn && member.photoUrl && (
                                <img src={member.photoUrl} alt={member.fullName} className="w-8 h-8 rounded-full object-cover mr-2"/>
                            )}
                            {!isUnassignedColumn && !member.photoUrl && (
                                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                                    <PhotoIcon className="w-4 h-4 text-gray-500"/>
                                </div>
                            )}
                            <h4 className={`font-semibold ${isUnassignedColumn ? 'text-red-600' : 'text-primary-700'}`}>
                                {member.fullName}
                            </h4>
                        </div>
                        {!isUnassignedColumn && (
                            <span className="text-sm font-medium text-gray-600 bg-gray-200 px-2 py-1 rounded-full">
                                Effort: {calculateTotalEffort(columnTasks)}
                            </span>
                        )}
                    </div>
                    {columnTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(providedDraggable, snapshotDraggable) => (
                          <div
                            ref={providedDraggable.innerRef}
                            {...providedDraggable.draggableProps}
                            {...providedDraggable.dragHandleProps}
                            className={`p-3 mb-2 bg-white rounded-md shadow ${snapshotDraggable.isDragging ? 'ring-2 ring-primary-500' : ''} border border-gray-200`}
                          >
                            <p className="font-medium text-sm text-gray-800">{task.name}</p>
                            <p className="text-xs text-gray-500">Effort: {task.effortPoints} | Cat: {task.category}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {columnTasks.length === 0 && !snapshot.isDraggingOver && (
                        <p className="text-xs text-gray-400 text-center py-4">No tasks assigned.</p>
                    )}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-lg shadow-md"
        >
          Back
        </button>
        <button
          onClick={handleFinalizePlan}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md"
        >
          Finalize & Export Options
        </button>
      </div>
    </div>
  );
};