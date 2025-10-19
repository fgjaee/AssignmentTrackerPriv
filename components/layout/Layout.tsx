
import React from 'react';
import { BottomNav } from './BottomNav';
import { APP_NAME } from '../../constants';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary-600 text-white p-4 shadow-md sticky top-0 z-40">
        <h1 className="text-2xl font-bold text-center">{APP_NAME}</h1>
      </header>
      <main className="flex-grow container mx-auto p-4 pb-20"> {/* pb-20 for bottom nav space */}
        {children}
      </main>
      <BottomNav />
    </div>
  );
};
