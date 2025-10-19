
import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { TeamMember, DayOfWeek, Availability, Tag } from '../types';
import { AppDataContext } from '../App';
import { TeamMemberForm } from '../components/team/TeamMemberForm';
import { DAYS_OF_WEEK_ORDERED } from '../constants';
import { TagBadge } from '../components/common/TagBadge';
import { PhotoIcon, EditIcon } from '../components/common/Icon';

const TeamMemberDetailPage: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const appContext = useContext(AppDataContext);
  
  const [member, setMember] = useState<TeamMember | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (appContext && memberId) {
      const foundMember = appContext.teamMembers.find(m => m.id === memberId);
      setMember(foundMember || null);
      if (!foundMember) {
        // Optional: navigate to a 404 page or back to team hub if member not found
        // navigate('/team'); 
      }
    }
  }, [appContext, memberId, navigate]);

  if (!appContext) return <div>Loading context...</div>;
  if (!member) return <div>Member not found. <Link to="/team" className="text-primary-600 hover:underline">Return to Team Hub</Link></div>;

  const { updateTeamMember } = appContext;

  const handleEditSubmit = (updatedMemberData: TeamMember) => {
    updateTeamMember(updatedMemberData);
    setMember(updatedMemberData); // Update local state to reflect changes immediately
    setIsEditing(false);
  };

  const getAvailabilityColor = (availability: Availability) => {
    switch (availability) {
      case Availability.AM_SHIFT: return 'bg-blue-500 text-white';
      case Availability.PM_SHIFT: return 'bg-indigo-500 text-white';
      case Availability.FLEXIBLE: return 'bg-green-500 text-white';
      case Availability.UNAVAILABLE: return 'bg-red-500 text-white';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  if (isEditing) {
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit {member.fullName}</h2>
        <TeamMemberForm member={member} onSubmit={handleEditSubmit} onCancel={() => setIsEditing(false)} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-white shadow-xl rounded-lg">
      <div className="flex flex-col md:flex-row md:space-x-8 items-start">
        <div className="flex-shrink-0 mb-6 md:mb-0">
          {member.photoUrl ? (
            <img src={member.photoUrl} alt={member.fullName} className="w-40 h-40 rounded-full object-cover shadow-lg mx-auto" />
          ) : (
            <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center shadow-lg mx-auto">
              <PhotoIcon className="w-20 h-20 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-primary-700">{member.fullName}</h2>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-secondary-500 hover:bg-secondary-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md inline-flex items-center"
            >
             <EditIcon className="w-5 h-5 mr-2" /> Edit Profile
            </button>
          </div>
          <p className="text-lg text-gray-600 mb-6">{member.contact}</p>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Schedule Patterns</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 text-center">
              {DAYS_OF_WEEK_ORDERED.map(day => (
                <div key={day} className="p-2 border rounded-md">
                  <p className="text-sm font-medium text-gray-600">{day.substring(0,3)}</p>
                  <p className={`text-xs px-1 py-0.5 rounded ${getAvailabilityColor(member.schedule[day])}`}>
                    {member.schedule[day]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Attributes</h3>
            {member.attributes.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {member.attributes.map(attr => <TagBadge key={attr.id} tag={attr} />)}
              </div>
            ) : (
              <p className="text-gray-500 italic">No attributes assigned.</p>
            )}
          </div>

          {member.notes && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Notes</h3>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-md whitespace-pre-wrap">{member.notes}</p>
            </div>
          )}
        </div>
      </div>
      <button
        onClick={() => navigate('/team')}
        className="mt-8 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-800 border border-primary-600 rounded-md"
      >
        Back to Team Hub
      </button>
    </div>
  );
};

export default TeamMemberDetailPage;
