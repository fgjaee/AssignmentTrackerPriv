
import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, TeamIcon, TasksIcon, HistoryIcon } from '../common/Icon';

const navItems = [
  { path: "/", label: "Home", icon: HomeIcon },
  { path: "/team", label: "Team Hub", icon: TeamIcon },
  { path: "/tasks", label: "Task Library", icon: TasksIcon },
  { path: "/history", label: "History", icon: HistoryIcon },
];

export const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
      <ul className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <li key={item.path} className="flex-1">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full p-2 transition-colors duration-200 ease-in-out ${
                  isActive ? 'text-primary-600' : 'text-gray-500 hover:text-primary-500'
                }`
              }
            >
              <item.icon className="w-6 h-6 mb-1" />
              <span className="text-xs">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
