
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TeamMember } from '../types';
import { AppDataContext } from '../App';
import { Modal } from '../components/common/Modal';
import { TeamMemberForm } from '../components/team/TeamMemberForm';
import { PlusIcon, PhotoIcon, EditIcon, DeleteIcon } from '../components/common/Icon';

const TeamMemberCard: React.FC<{ member: TeamMember; onDelete: (id: string) => void; }> = ({ member, onDelete }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform hover:scale-105">
      <div className="p-5">
        <div className="flex items-center space-x-4 mb-3">
            {member.photoUrl ? (
                <img src={member.photoUrl} alt={member.fullName} className="w-16 h-16 rounded-full object-cover shadow-md" />
            ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center shadow-md">
                    <PhotoIcon className="w-8 h-8 text-gray-400" />
                </div>
            )}
            <div>
                <h3 className="text-xl font-semibold text-primary-700">{member.fullName}</h3>
                <p className="text-sm text-gray-500">{member.contact}</p>
            </div>
        </div>
        
        <div className="mt-4 flex justify-end space-x-2">
            <button 
              onClick={() => navigate(`/team/${member.id}`)} 
              className="p-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md shadow-sm inline-flex items-center"
            >
              <EditIcon className="w-4 h-4 mr-1" /> View/Edit
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); if(window.confirm(`Are you sure you want to delete ${member.fullName}?`)) onDelete(member.id); }}
              className="p-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md shadow-sm inline-flex items-center"
            >
             <DeleteIcon className="w-4 h-4 mr-1" /> Delete
            </button>
        </div>
      </div>
    </div>
  );
};


const TeamHubPage: React.FC = () => {
  const appContext = useContext(AppDataContext);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  if (!appContext) return <div>Loading...</div>; // Or some other loading state

  const { teamMembers, addTeamMember, deleteTeamMember } = appContext;

  const handleAddMember = (newMember: TeamMember) => {
    addTeamMember(newMember);
    setIsAddModalOpen(false);
  };
  
  const handleDelete = (id: string) => {
    deleteTeamMember(id);
  }

  const filteredMembers = teamMembers.filter(member =>
    member.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Team Hub</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md inline-flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add New Member
        </button>
      </div>

      <input
        type="text"
        placeholder="Search team members..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 mb-6 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
      />

      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-10">
          No team members found. {searchTerm && "Try adjusting your search or "}
          <button onClick={() => setIsAddModalOpen(true)} className="text-primary-600 hover:underline">add a new member</button>.
        </p>
      )}

      <Modal title="Add New Team Member" isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} size="lg">
        <TeamMemberForm onSubmit={handleAddMember} onCancel={() => setIsAddModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default TeamHubPage;
