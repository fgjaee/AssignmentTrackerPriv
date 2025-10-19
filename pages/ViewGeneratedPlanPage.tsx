
import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppDataContext } from '../App';
import { ShiftPlan, AssignedTask, TeamMember } from '../types';
import { UNASSIGNED_COLUMN_ID } from '../constants';
import { PrintIcon, CopyIcon, EyeIcon, PhotoIcon } from '../components/common/Icon';

// Define a print-specific stylesheet
const PrintStyles = () => (
  <style type="text/css" media="print">{`
    @page { size: auto; margin: 0.5in; }
    body { font-family: Arial, sans-serif; color: #333; }
    .no-print { display: none !important; }
    .print-header { text-align: center; margin-bottom: 20px; }
    .print-header h1 { font-size: 24px; color: #1d4ed8; } /* primary-700 */
    .print-header p { font-size: 14px; color: #555; }
    .member-section { margin-bottom: 20px; padding: 10px; border: 1px solid #ccc; border-radius: 8px; page-break-inside: avoid; }
    .member-name { font-size: 18px; font-weight: bold; color: #0284c7; margin-bottom: 8px; } /* secondary-600 */
    .task-list { list-style: disc; margin-left: 20px; }
    .task-list li { margin-bottom: 5px; font-size: 14px; }
    .task-effort { font-size: 0.8em; color: #777; }
    .unassigned-section .member-name { color: #dc2626; } /* red-600 */
  `}</style>
);


const ViewGeneratedPlanPage: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const appContext = useContext(AppDataContext);
  const [plan, setPlan] = useState<ShiftPlan | null>(null);
  const [teamDetails, setTeamDetails] = useState<Record<string, TeamMember>>({});

  useEffect(() => {
    if (appContext && planId) {
      const foundPlan = appContext.shiftPlans.find(p => p.id === planId);
      setPlan(foundPlan || null);
      if (foundPlan) {
        const details: Record<string, TeamMember> = {};
        foundPlan.teamMemberIds.forEach(id => {
          const member = appContext.teamMembers.find(m => m.id === id);
          if (member) details[id] = member;
        });
        setTeamDetails(details);
      } else {
        // navigate('/history'); // Or some error page
      }
    }
  }, [appContext, planId, navigate]);

  if (!appContext) return <div>Loading...</div>;
  if (!plan) return <div>Plan not found. <button onClick={() => navigate('/history')} className="text-primary-600 hover:underline">Return to History</button></div>;

  const getTasksByMember = (): Record<string, AssignedTask[]> => {
    const assignments: Record<string, AssignedTask[]> = {};
    plan.teamMemberIds.forEach(id => assignments[id] = []);
    assignments[UNASSIGNED_COLUMN_ID] = [];

    plan.tasks.forEach(task => {
      if (task.assignedTo && assignments[task.assignedTo]) {
        assignments[task.assignedTo].push(task);
      } else {
        assignments[UNASSIGNED_COLUMN_ID].push(task);
      }
    });
    return assignments;
  };

  const tasksByMember = getTasksByMember();

  const generatePlainText = (): string => {
    let text = `Shift Plan - ${new Date(plan.date).toLocaleDateString()}\n\n`;
    plan.teamMemberIds.forEach(memberId => {
      const member = teamDetails[memberId];
      text += `--- ${member ? member.fullName : 'Unknown Member'} ---\n`;
      const memberTasks = tasksByMember[memberId] || [];
      if (memberTasks.length > 0) {
        memberTasks.forEach(task => {
          text += `- ${task.name} (Effort: ${task.effortPoints})\n`;
        });
      } else {
        text += "No tasks assigned.\n";
      }
      text += "\n";
    });

    const unassignedTasks = tasksByMember[UNASSIGNED_COLUMN_ID] || [];
    if (unassignedTasks.length > 0) {
      text += "--- Unassigned Tasks ---\n";
      unassignedTasks.forEach(task => {
        text += `- ${task.name} (Effort: ${task.effortPoints})\n`;
      });
    }
    return text;
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatePlainText());
      alert('Plan copied to clipboard!');
    } catch (err) {
      alert('Failed to copy plan.');
      console.error('Copy to clipboard failed:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };


  return (
    <div className="container mx-auto p-4">
      <PrintStyles />
      <div className="print-header no-print mb-6 flex justify-between items-center">
         <h2 className="text-3xl font-bold text-gray-800">Shift Plan Details</h2>
         <div className="flex space-x-3">
            <button
                onClick={handlePrint}
                className="bg-secondary-500 hover:bg-secondary-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md inline-flex items-center"
            >
                <PrintIcon className="w-5 h-5 mr-2"/> Print Plan
            </button>
            <button
                onClick={handleCopyToClipboard}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md inline-flex items-center"
            >
                <CopyIcon className="w-5 h-5 mr-2"/> Copy as Text
            </button>
         </div>
      </div>
      <div className="print-header mb-6"> {/* This will show on print and screen */}
        <h1 className="text-3xl font-bold text-primary-700">Shift Plan</h1>
        <p className="text-lg text-gray-600">{new Date(plan.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="space-y-6">
        {plan.teamMemberIds.map(memberId => {
          const member = teamDetails[memberId];
          const memberTasks = tasksByMember[memberId] || [];
          const totalEffort = memberTasks.reduce((sum, task) => sum + task.effortPoints, 0);
          if (!member) return null;

          return (
            <div key={memberId} className="member-section bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-3">
                {member.photoUrl ? (
                    <img src={member.photoUrl} alt={member.fullName} className="w-12 h-12 rounded-full object-cover mr-4 no-print"/>
                ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4 no-print">
                        <PhotoIcon className="w-6 h-6 text-gray-400"/>
                    </div>
                )}
                <div>
                    <h3 className="member-name text-2xl font-semibold text-primary-700">{member.fullName}</h3>
                    <p className="text-sm text-gray-500 no-print">Total Effort: {totalEffort}</p>
                </div>
              </div>
              {memberTasks.length > 0 ? (
                <ul className="task-list list-disc pl-5 space-y-1">
                  {memberTasks.map(task => (
                    <li key={task.id} className="text-gray-700">
                      {task.name} <span className="task-effort text-gray-500 text-xs">(Effort: {task.effortPoints})</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No tasks assigned.</p>
              )}
            </div>
          );
        })}

        {(tasksByMember[UNASSIGNED_COLUMN_ID] && tasksByMember[UNASSIGNED_COLUMN_ID].length > 0) && (
          <div className="member-section unassigned-section bg-red-50 p-6 rounded-lg shadow-lg">
            <h3 className="member-name text-2xl font-semibold text-red-600">Unassigned Tasks</h3>
            <ul className="task-list list-disc pl-5 space-y-1">
              {tasksByMember[UNASSIGNED_COLUMN_ID].map(task => (
                <li key={task.id} className="text-gray-700">
                  {task.name} <span className="task-effort text-gray-500 text-xs">(Effort: {task.effortPoints})</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
       <button
        onClick={() => navigate(-1)} // Go back to previous page (likely Review or History)
        className="mt-8 px-6 py-2 text-sm font-medium text-primary-600 hover:text-primary-800 border border-primary-600 rounded-md shadow-sm no-print"
      >
        Back
      </button>
    </div>
  );
};

export default ViewGeneratedPlanPage;
