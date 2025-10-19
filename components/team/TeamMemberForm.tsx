
import React, { useState, useEffect, useContext } from 'react';
import { TeamMember, Availability, DayOfWeek, SchedulePattern, Tag, TagType } from '../../types';
import { DAYS_OF_WEEK_ORDERED, ALL_AVAILABILITIES } from '../../constants';
import { DayAvailabilitySelector } from './DayAvailabilitySelector';
import { TagInput } from '../common/TagInput';
import { AppDataContext } from '../../App';
import { PhotoIcon } from '../common/Icon';

interface TeamMemberFormProps {
  member?: TeamMember | null;
  onSubmit: (member: TeamMember) => void;
  onCancel: () => void;
}

const getDefaultSchedule = (): SchedulePattern => {
  return DAYS_OF_WEEK_ORDERED.reduce((acc, day) => {
    acc[day] = Availability.NOT_SET;
    return acc;
  }, {} as SchedulePattern);
};

export const TeamMemberForm: React.FC<TeamMemberFormProps> = ({ member, onSubmit, onCancel }) => {
  const [fullName, setFullName] = useState('');
  const [contact, setContact] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [schedule, setSchedule] = useState<SchedulePattern>(getDefaultSchedule());
  const [attributes, setAttributes] = useState<Tag[]>([]);
  const [notes, setNotes] = useState('');
  
  const appContext = useContext(AppDataContext);

  useEffect(() => {
    if (member) {
      setFullName(member.fullName);
      setContact(member.contact);
      setPhotoUrl(member.photoUrl);
      setSchedule(member.schedule);
      setAttributes(member.attributes);
      setNotes(member.notes);
    } else {
      // Reset form for new member
      setFullName('');
      setContact('');
      setPhotoUrl(undefined);
      setSchedule(getDefaultSchedule());
      setAttributes([]);
      setNotes('');
    }
  }, [member]);

  const handleScheduleChange = (day: DayOfWeek, availability: Availability) => {
    setSchedule(prev => ({ ...prev, [day]: availability }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
        alert("Full name is required.");
        return;
    }
    const memberData: Omit<TeamMember, 'id'> = {
      fullName,
      contact,
      photoUrl,
      schedule,
      attributes,
      notes,
    };
    onSubmit({ ...memberData, id: member?.id || crypto.randomUUID() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact (Email/Phone)</label>
        <input
          type="text"
          id="contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Photo</label>
        <div className="mt-1 flex items-center space-x-4">
          {photoUrl ? (
            <img src={photoUrl} alt="Team member" className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
              <PhotoIcon className="w-10 h-10 text-gray-400" />
            </div>
          )}
          <input type="file" id="photoUpload" accept="image/*" onChange={handlePhotoUpload} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"/>
        </div>
      </div>
      
      <div>
        <h4 className="text-md font-medium text-gray-800 mb-2">Schedule Patterns</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {DAYS_OF_WEEK_ORDERED.map(day => (
            <DayAvailabilitySelector
              key={day}
              day={day}
              currentAvailability={schedule[day]}
              onChange={handleScheduleChange}
            />
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-800 mb-2">Attributes (Strengths, Weaknesses, Specialties)</h4>
        <TagInput
            selectedTags={attributes}
            onTagsChange={setAttributes}
            availableTagTypes={[TagType.STRENGTH, TagType.WEAKNESS, TagType.SPECIALTY]}
            placeholder="Assign or create attributes..."
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md shadow-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md shadow-sm"
        >
          {member ? 'Save Changes' : 'Add Member'}
        </button>
      </div>
    </form>
  );
};
