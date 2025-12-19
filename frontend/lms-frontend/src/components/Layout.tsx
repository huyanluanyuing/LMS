import React from 'react';
import { LogOut, BookOpen, UserCircle } from 'lucide-react';
import { logout, getCurrentUserRole } from '../services/api';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const role = getCurrentUserRole();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4 flex justify-between items-center shadow-sm">
        {/* Logo Area */}
        <div className="flex items-center gap-2 text-blue-600">
          <BookOpen className="w-8 h-8" />
          <span className="text-xl font-bold tracking-tight">OpenLMS</span>
        </div>

        {/* User Info and Logout */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
            <UserCircle className="w-5 h-5" />
            <span className="text-sm font-medium">
              {role === 'TEACHER' ? 'Teacher View' : 'Student View'}
            </span>
          </div>
          
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </nav>

      {/* Content Container */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;