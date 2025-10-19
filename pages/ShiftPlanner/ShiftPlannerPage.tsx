
import React, { useState, useContext, useEffect } from 'react';
import { AppDataContext } from '../../App';
import { TeamMember, Task, ShiftPlan, AssignedTask } from '../../types';
import { SelectTeamStep } from './SelectTeamStep';
import { SelectTasksStep } from './SelectTasksStep';
import { ReviewPlanStep } from './ReviewPlanStep';
import { generateSmartList } from '../../services/shiftAlgorithm';
import { Modal } from '../../components/common/Modal';
import { ArrowPathIcon } from '../../components/common/Icon';

type PlannerStep = 'selectTeam' | 'selectTasks' | 'reviewPlan';

interface AssignedTasksByMember {
  [memberIdOrUnassigned: string]: AssignedTask[];
}

const ShiftPlannerPage: React.FC = () => {
  const appContext = useContext(AppDataContext);
  const [currentStep, setCurrentStep] = useState<PlannerStep>('selectTeam');
  
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [currentPlan, setCurrentPlan] = useState<ShiftPlan | null>(null);
  const [assignments, setAssignments] = useState<AssignedTasksByMember>({});

  useEffect(() => {
    // Create a new draft plan when the component mounts or user starts a new plan
    if (appContext && !currentPlan) {
        const newPlan = appContext.addShiftPlan({
            date: new Date().toISOString(),
            teamMemberIds: [],
            tasks: []
        });
        setCurrentPlan(newPlan);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appContext]);


  if (!appContext) return <div>Loading application data...</div>;
  const { teamMembers, tasks, updateShiftPlanState } = appContext;

  const handleTeamSelectionNext = () => {
    if(currentPlan) {
        const updatedPlan = {...currentPlan, teamMemberIds: selectedMemberIds};
        setCurrentPlan(updatedPlan);
        updateShiftPlanState(updatedPlan);
    }
    setCurrentStep('selectTasks');
  };

  const handleTaskSelectionNext = () => {
    const teamForShift = teamMembers.filter(m => selectedMemberIds.includes(m.id));
    const tasksForShift = tasks.filter(t => selectedTaskIds.includes(t.id));

    const smartAssignments = generateSmartList({
      selectedTeamMembers: teamForShift,
      selectedTasks: tasksForShift,
    });
    setAssignments(smartAssignments);
    
    if(currentPlan) {
        const allAssignedTasksFromSmartList: AssignedTask[] = Object.values(smartAssignments).flat();
        const updatedPlan = {...currentPlan, tasks: allAssignedTasksFromSmartList };
        setCurrentPlan(updatedPlan);
        updateShiftPlanState(updatedPlan);
    }
    setCurrentStep('reviewPlan');
  };

  const handlePlanUpdate = (updatedAssignments: AssignedTasksByMember) => {
    setAssignments(updatedAssignments);
     if(currentPlan) {
        const allAssignedTasks: AssignedTask[] = Object.values(updatedAssignments).flat();
        const updatedPlan = {...currentPlan, tasks: allAssignedTasks };
        setCurrentPlan(updatedPlan);
        updateShiftPlanState(updatedPlan);
    }
  };

  const handleFinalize = (finalPlan: ShiftPlan) => {
    // Navigation to view/export page is handled in ReviewPlanStep
    // Reset for a new plan, or navigate away.
    // For now, user will be navigated away. To start new, they'd come back to this page.
  };
  
  const resetPlanner = () => {
    setSelectedMemberIds([]);
    setSelectedTaskIds([]);
    setAssignments({});
    setCurrentPlan(null); // This will trigger useEffect to create a new draft plan
    setCurrentStep('selectTeam');
     if (appContext && !currentPlan) { // ensure a new plan is made if one wasn't for some reason
        const newPlan = appContext.addShiftPlan({
            date: new Date().toISOString(),
            teamMemberIds: [],
            tasks: []
        });
        setCurrentPlan(newPlan);
    }
  };


  const renderStep = () => {
    if (!currentPlan) return <p>Initializing plan...</p>;

    switch (currentStep) {
      case 'selectTeam':
        return (
          <SelectTeamStep
            allTeamMembers={teamMembers}
            selectedMemberIds={selectedMemberIds}
            onSelectionChange={setSelectedMemberIds}
            onNext={handleTeamSelectionNext}
          />
        );
      case 'selectTasks':
        return (
          <SelectTasksStep
            allTasks={tasks}
            selectedTaskIds={selectedTaskIds}
            onSelectionChange={setSelectedTaskIds}
            onNext={handleTaskSelectionNext}
            onBack={() => setCurrentStep('selectTeam')}
          />
        );
      case 'reviewPlan':
        return (
          <ReviewPlanStep
            initialAssignments={assignments}
            teamForShift={teamMembers.filter(m => selectedMemberIds.includes(m.id))}
            currentPlan={currentPlan}
            onPlanUpdate={handlePlanUpdate}
            onBack={() => setCurrentStep('selectTasks')}
            onFinalize={handleFinalize}
          />
        );
      default:
        return <div>Invalid step</div>;
    }
  };
  
  const stepTitles: Record<PlannerStep, string> = {
    selectTeam: "Select Team",
    selectTasks: "Select Tasks",
    reviewPlan: "Review & Refine"
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Plan New Shift</h2>
        <button
          onClick={resetPlanner}
          title="Start Over"
          className="p-2 text-sm font-medium text-primary-600 hover:text-primary-800 bg-primary-100 hover:bg-primary-200 rounded-full shadow-sm inline-flex items-center"
        >
          <ArrowPathIcon className="w-5 h-5"/>
        </button>
      </div>
      
      {/* Using Modal for step presentation, or could be direct content */}
      <Modal 
        isOpen={true} 
        onClose={() => {}} /* Modal is controlled by page flow, not user close */
        title={`Shift Planner: ${stepTitles[currentStep]}`}
        size={currentStep === 'reviewPlan' ? 'xl' : 'lg'}
      >
        <div className="bg-white p-2 rounded-lg min-h-[60vh]">
          {renderStep()}
        </div>
      </Modal>
    </div>
  );
};

export default ShiftPlannerPage;
