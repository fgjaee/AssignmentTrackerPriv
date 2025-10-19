
import React, { useState, useContext, useEffect } from 'react';
import { TeamMember, Availability } from '../../types';
import { AppDataContext } from '../../App';
import { getTodayDayOfWeek } from '../../constants';
import { PhotoIcon } from '../../components/common/Icon';

interface SelectTeamStepProps {
  allTeamMembers: TeamMember[];
  selectedMemberIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onNext: () => void;
}

export const SelectTeamStep: React.FC<SelectTeamStepProps> = ({ allTeamMembers, selectedMemberIds, onSelectionChange, onNext }) => {
  const today = getTodayDayOfWeek();

  // Smart suggestion: pre-select members typically working today
  useEffect(() => {
    const suggestedMemberIds = allTeamMembers
      .filter(member => {
        const availabilityToday = member.schedule[today];
        return availabilityToday === Availability.AM_SHIFT || 
               availabilityToday === Availability.PM_SHIFT || 
               availabilityToday === Availability.FLEXIBLE;
      })
      .map(member => member.id);
    
    // Only set if no members are currently selected, to avoid overriding user's choices if they go back and forth
    if (selectedMemberIds.length === 0) {
        onSelectionChange(suggestedMemberIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allTeamMembers, today]); // Run once when component mounts or allTeamMembers/today changes


  const handleToggleMember = (memberId: string) => {
    const newSelectedIds = selectedMemberIds.includes(memberId)
      ? selectedMemberIds.filter(id => id !== memberId)
      : [...selectedMemberIds, memberId];
    onSelectionChange(newSelectedIds);
  };

  return (
    <div className="p-2">
      <h3 className="text-xl font-semibold mb-1 text-gray-700">Step 1: Who is working today?</h3>
      <p className="text-sm text-gray-500 mb-4">Smart suggestions are pre-selected based on typical availability for a {today}.</p>
      
      {allTeamMembers.length === 0 && <p className="text-gray-500">No team members available. Please <a href="#/team" className="text-primary-600 hover:underline">add members to your team hub</a> first.</p>}

      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {allTeamMembers.map(member => (
          <div
            key={member.id}
            onClick={() => handleToggleMember(member.id)}
            className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 ease-in-out
                        ${selectedMemberIds.includes(member.id) ? 'bg-primary-100 border-primary-500 shadow-md' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
          >
            <input
              type="checkbox"
              checked={selectedMemberIds.includes(member.id)}
              onChange={() => handleToggleMember(member.id)}
              className="form-checkbox h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500 mr-4"
            />
             {member.photoUrl ? (
                <img src={member.photoUrl} alt={member.fullName} className="w-10 h-10 rounded-full object-cover mr-3" />
            ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <PhotoIcon className="w-5 h-5 text-gray-400" />
                </div>
            )}
            <div className="flex-grow">
                <span className="font-medium text-gray-800">{member.fullName}</span>
                <p className="text-xs text-gray-500">Typical for {today}: {member.schedule[today]}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={onNext}
          disabled={selectedMemberIds.length === 0}
          className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Next: Select Tasks
        </button>
      </div>
    </div>
  );
};
