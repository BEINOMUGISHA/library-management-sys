
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Icons, ACADEMIC_YEAR_CONFIG } from '../pages/constants';
import { User, UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigation = [
    { name: 'Catalog', href: '/', icon: Icons.BookOpen, roles: [UserRole.STUDENT, UserRole.LECTURER, UserRole.ADMIN] },
    { name: 'Calendar', href: '/calendar', icon: Icons.Calendar, roles: [UserRole.STUDENT, UserRole.LECTURER, UserRole.ADMIN] },
    { name: 'My Dashboard', href: '/dashboard', icon: Icons.Dashboard, roles: [UserRole.STUDENT, UserRole.LECTURER] },
    { name: 'Administration', href: '/admin', icon: Icons.Settings, roles: [UserRole.ADMIN] },
  ];

  const filteredNav = navigation.filter(item => user && item.roles.includes(user.role));

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-slate-200 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col`}>
        <div className="p-6 flex items-center gap-3">
          <div className="text-blue-600">
            <Icons.Library />
          </div>
          {isSidebarOpen && <span className="font-bold text-xl text-slate-800 tracking-tight">BBUC Library</span>}
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {filteredNav.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`
              }
            >
              <item.icon />
              {isSidebarOpen && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={onLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
          >
            <Icons.LogOut />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-slate-400 hover:text-slate-600 md:hidden"
            >
              <Icons.Plus />
            </button>
            
            {/* Academic Year Badge */}
            <div className="hidden md:flex items-center gap-3 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Academic Period</span>
              <div className="h-3 w-px bg-slate-200 mx-1"></div>
              <span className="text-sm font-bold text-slate-700">{ACADEMIC_YEAR_CONFIG.year} - {ACADEMIC_YEAR_CONFIG.semester}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 ml-auto">
            <button className="p-2 text-slate-400 hover:text-slate-600 relative">
              <Icons.Bell />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                <p className="text-xs text-slate-400 capitalize">{user?.role.toLowerCase()}</p>
              </div>
              <img 
                src={user?.avatar} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-100"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
