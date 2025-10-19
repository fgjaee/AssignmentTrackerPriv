
import React, { useState, useContext, useEffect } from 'react';
import { Tag, TagType } from '../../types';
import { AppDataContext } from '../../App';
import { TagBadge } from './TagBadge';
import { PlusIcon } from './Icon';

interface TagInputProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  availableTagTypes: TagType[]; // e.g. [TagType.STRENGTH, TagType.WEAKNESS]
  placeholder?: string;
}

export const TagInput: React.FC<TagInputProps> = ({ selectedTags, onTagsChange, availableTagTypes, placeholder="Add or create a tag..." }) => {
  const appContext = useContext(AppDataContext);
  const [inputValue, setInputValue] = useState('');
  const [currentTagType, setCurrentTagType] = useState<TagType>(availableTagTypes[0]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Tag[]>([]);

  useEffect(() => {
    if (inputValue.trim() === '') {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const suggestions = appContext?.tags
      .filter(tag => availableTagTypes.includes(tag.type))
      .filter(tag => tag.name.toLowerCase().includes(inputValue.toLowerCase()))
      .filter(tag => !selectedTags.find(st => st.id === tag.id)) || [];
    setFilteredSuggestions(suggestions);
    setShowSuggestions(suggestions.length > 0);
  }, [inputValue, appContext?.tags, selectedTags, availableTagTypes]);


  const handleAddTag = (tag: Tag) => {
    if (!selectedTags.find(st => st.id === tag.id)) {
      onTagsChange([...selectedTags, tag]);
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  const handleCreateAndAddTag = () => {
    if (inputValue.trim() === '' || !appContext) return;
    const existingTag = appContext.tags.find(t => t.name.toLowerCase() === inputValue.trim().toLowerCase() && t.type === currentTagType);
    if (existingTag) {
      handleAddTag(existingTag);
    } else {
      const newTag = appContext.addCustomTag({ name: inputValue.trim(), type: currentTagType });
      handleAddTag(newTag);
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  const handleRemoveTag = (tagToRemove: Tag) => {
    onTagsChange(selectedTags.filter(tag => tag.id !== tagToRemove.id));
  };
  
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if(filteredSuggestions.length > 0) {
        handleAddTag(filteredSuggestions[0]);
      } else {
        handleCreateAndAddTag();
      }
    }
  };

  return (
    <div className="relative">
      {availableTagTypes.length > 1 && (
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">Tag Type:</label>
          <select 
            value={currentTagType} 
            onChange={(e) => setCurrentTagType(e.target.value as TagType)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          >
            {availableTagTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
      )}
      <div className="flex flex-wrap gap-2 mb-2 p-2 border border-gray-300 rounded-md min-h-[40px]">
        {selectedTags.map(tag => (
          <TagBadge key={tag.id} tag={tag} onClick={() => handleRemoveTag(tag)} interactive={true} className="text-sm" />
        ))}
         <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
          onFocus={() => inputValue && setShowSuggestions(true)}
          // onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} // delay to allow click on suggestion
          placeholder={placeholder}
          className="flex-grow p-1 outline-none text-sm"
        />
      </div>
     
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
          {filteredSuggestions.map(tag => (
            <li
              key={tag.id}
              onClick={() => handleAddTag(tag)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {tag.name} <span className="text-xs text-gray-500">({tag.type})</span>
            </li>
          ))}
        </ul>
      )}
       <button 
          type="button" 
          onClick={handleCreateAndAddTag}
          disabled={!inputValue.trim()}
          className="mt-1 text-sm text-primary-600 hover:text-primary-800 disabled:text-gray-400 flex items-center"
        >
         <PlusIcon className="w-4 h-4 mr-1" /> Add "{inputValue || 'New Tag'}" as {currentTagType}
        </button>
    </div>
  );
};
