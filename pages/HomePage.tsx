
import React from 'react';
import { Link } from 'react-router-dom';
import { TAGLINE } from '../constants';
import { CalendarIcon, PlusIcon } from '../components/common/Icon';

const HomePage: React.FC = () => {
  const managerName = "Manager"; // Replace with actual manager name if available

  return (
    <div className="text-center py-10">
      <CalendarIcon className="w-24 h-24 text-primary-500 mx-auto mb-6" />
      <h2 className="text-4xl font-bold text-gray-800 mb-2">Good Morning, {managerName}.</h2>
      <p className="text-xl text-gray-600 mb-10">{TAGLINE}</p>
      
      <Link
        to="/plan-shift"
        className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105 inline-flex items-center text-lg"
      >
        <PlusIcon className="w-6 h-6 mr-3" />
        Plan New Shift
      </Link>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/team" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-semibold text-primary-700 mb-2">Team Hub</h3>
          <p className="text-gray-600">Manage your team members and their profiles.</p>
        </Link>
        <Link to="/tasks" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-semibold text-primary-700 mb-2">Task Library</h3>
          <p className="text-gray-600">Curate and manage all your operational tasks.</p>
        </Link>
        <Link to="/history" className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-semibold text-primary-700 mb-2">Shift History</h3>
          <p className="text-gray-600">Review past shift plans and assignments.</p>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
