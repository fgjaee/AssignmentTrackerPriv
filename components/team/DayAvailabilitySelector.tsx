
import React from 'react';
import { DayOfWeek, Availability } from '../../types';
import { ALL_AVAILABILITIES } from '../../constants';

interface DayAvailabilitySelectorProps {
  day: DayOfWeek;
  currentAvailability: Availability;
  onChange: (day: DayOfWeek, availability: Availability) => void;
}

export const DayAvailabilitySelector: React.FC<DayAvailabilitySelectorProps> = ({ day, currentAvailability, onChange }) => {
  const getBackgroundColor = (availability: Availability) => {
    switch (availability) {
      case Availability.AM_SHIFT: return 'bg-blue-400';
      case Availability.PM_SHIFT: return 'bg-indigo-400';
      case Availability.FLEXIBLE: return 'bg-green-400';
      case Availability.UNAVAILABLE: return 'bg-red-400';
      case Availability.NOT_SET: return 'bg-gray-300';
      default: return 'bg-gray-200';
    }
  };

  return (
    <div className="mb-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">{day}</label>
      <select
        value={currentAvailability}
        onChange={(e) => onChange(day, e.target.value as Availability)}
        className={`w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-white ${getBackgroundColor(currentAvailability)}`}
      >
        {ALL_AVAILABILITIES.map(avail => (
          <option key={avail} value={avail} className="bg-white text-black">
            {avail}
          </option>
        ))}
      </select>
    </div>
  );
};
