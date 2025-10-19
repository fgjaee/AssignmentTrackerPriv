
import React from 'react';

interface IconProps {
  path: string;
  className?: string;
  viewBox?: string;
}

export const Icon: React.FC<IconProps> = ({ path, className = "w-6 h-6", viewBox = "0 0 24 24" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox} fill="currentColor" className={className}>
    <path d={path} />
  </svg>
);

export const HomeIcon: React.FC<{ className?: string }> = ({className}) => <Icon className={className} path="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />;
export const TeamIcon: React.FC<{ className?: string }> = ({className}) => <Icon className={className} path="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />;
export const TasksIcon: React.FC<{ className?: string }> = ({className}) => <Icon className={className} path="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zm0-8h14V7H7v2z" />;
export const HistoryIcon: React.FC<{ className?: string }> = ({className}) => <Icon className={className} path="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.25 2.52.77-1.28-3.52-2.09V8H12z" />;
export const PlusIcon: React.FC<{ className?: string }> = ({className}) => <Icon className={className} path="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />;
export const EditIcon: React.FC<{ className?: string }> = ({className}) => <Icon className={className} path="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />;
export const DeleteIcon: React.FC<{ className?: string }> = ({className}) => <Icon className={className} path="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />;
export const ChevronDownIcon: React.FC<{ className?: string }> = ({className}) => <Icon className={className} path="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />;
export const ChevronUpIcon: React.FC<{ className?: string }> = ({className}) => <Icon className={className} path="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />;
export const CalendarIcon: React.FC<{ className?: string }> = ({className}) => <Icon className={className} path="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />;
export const PhotoIcon: React.FC<{ className?: string }> = ({className}) => <Icon className={className} path="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />;
export const CopyIcon: React.FC<{ className?: string }> = ({className}) => <Icon className={className} path="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />;
export const PrintIcon: React.FC<{ className?: string }> = ({className}) => <Icon className={className} path="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zM16 19H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zM18 3H6v4h12V3z" />;
export const EyeIcon: React.FC<{ className?: string }> = ({className}) => <Icon className={className} path="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />;
export const ArrowPathIcon: React.FC<{ className?: string }> = ({className}) => <Icon className={className} path="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>;

