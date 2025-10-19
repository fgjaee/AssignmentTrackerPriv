
import React, { useContext } from 'react';
import { AppDataContext } from '../App';
import { Link } from 'react-router-dom';
import { EyeIcon } from '../components/common/Icon';

const ShiftHistoryPage: React.FC = () => {
  const appContext = useContext(AppDataContext);

  if (!appContext) return <div>Loading...</div>;

  const { shiftPlans, teamMembers } = appContext;

  const finalizedPlans = shiftPlans
    .filter(plan => plan.finalized)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by most recent first

  return (
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Shift History</h2>
      
      {finalizedPlans.length === 0 ? (
        <div className="text-center py-10">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2zm3-12V3m0 18v-2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No shift plans finalized yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by planning a new shift.</p>
          <div className="mt-6">
            <Link
              to="/plan-shift"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <EyeIcon className="-ml-1 mr-2 h-5 w-5" />
              Plan New Shift
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {finalizedPlans.map(plan => {
            const planTeamMembers = plan.teamMemberIds.map(id => teamMembers.find(tm => tm.id === id)?.fullName).filter(Boolean);
            return (
              <div key={plan.id} className="bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-primary-700">
                      Shift Plan - {new Date(plan.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Team: {planTeamMembers.join(', ') || 'No team members recorded'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Tasks Assigned: {plan.tasks.filter(t => t.assignedTo).length} / {plan.tasks.length}
                    </p>
                  </div>
                  <Link
                    to={`/plan/${plan.id}/view`}
                    className="bg-secondary-500 hover:bg-secondary-600 text-white font-semibold py-2 px-3 rounded-md text-sm inline-flex items-center"
                  >
                    <EyeIcon className="w-4 h-4 mr-1.5" /> View
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShiftHistoryPage;
