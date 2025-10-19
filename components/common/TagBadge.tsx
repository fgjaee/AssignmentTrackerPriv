
import React from 'react';
import { Tag, TagType } from '../../types';

interface TagBadgeProps {
  tag: Tag;
  onClick?: () => void;
  className?: string;
  interactive?: boolean;
}

export const TagBadge: React.FC<TagBadgeProps> = ({ tag, onClick, className = '', interactive = false }) => {
  const baseStyle = "px-2 py-1 text-xs font-medium rounded-full inline-block";
  let typeStyle = "";

  switch (tag.type) {
    case TagType.STRENGTH:
      typeStyle = "bg-green-100 text-green-700";
      break;
    case TagType.WEAKNESS:
      typeStyle = "bg-red-100 text-red-700";
      break;
    case TagType.SPECIALTY:
      typeStyle = "bg-blue-100 text-blue-700";
      break;
    default:
      typeStyle = "bg-gray-100 text-gray-700";
  }
  
  const interactiveStyle = interactive ? "cursor-pointer hover:opacity-75" : "";

  return (
    <span
      className={`${baseStyle} ${typeStyle} ${interactiveStyle} ${className}`}
      onClick={onClick}
      title={`${tag.type}: ${tag.name}`}
    >
      {tag.name}
    </span>
  );
};
