
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
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
    { name: 'Digital Catalog', href: '/', icon: Icons.BookOpen, roles: [UserRole.STUDENT, UserRole.LECTURER, UserRole.ADMIN] },
    { name: 'Academic Calendar', href: '/calendar', icon: Icons.Calendar, roles: [UserRole.STUDENT, UserRole.LECTURER, UserRole.ADMIN] },
    { name: 'My Activity', href: '/dashboard', icon: Icons.Dashboard, roles: [UserRole.STUDENT, UserRole.LECTURER] },
    { name: 'Administration', href: '/admin', icon: Icons.Settings, roles: [UserRole.ADMIN] },
  ];

  const filteredNav = navigation.filter(item => user && item.roles.includes(user.role));

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-inter">
      <aside className={`bg-slate-900 border-r border-slate-800 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col shadow-2xl z-50`}>
        <div className="p-8 flex items-center gap-4">
          <div className="text-amber-400">
            <Icons.Library />
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col">
              <span className="font-black text-lg text-white tracking-tighter leading-none">BBUC eLIBRARY</span>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Digital Knowledge Hub</span>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 py-8 space-y-3">
          {filteredNav.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all ${
                  isActive 
                    ? 'bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-950/40' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <item.icon />
              {isSidebarOpen && <span className="text-sm tracking-tight">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={onLogout}
            className="flex w-full items-center gap-4 px-5 py-3.5 rounded-2xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all group"
          >
            <Icons.LogOut />
            {isSidebarOpen && <span className="text-sm font-bold">Sign Out</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm z-40">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-3 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-xl transition-colors"
            >
              <Icons.Plus />
            </button>
            <div className="hidden lg:flex items-center gap-4 bg-indigo-50 px-6 py-2 rounded-2xl border border-indigo-100">
              <span className="text-sm font-black text-indigo-900 tracking-tight">{ACADEMIC_YEAR_CONFIG.year} Semester Portal</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900 leading-none">{user?.name}</p>
                <p className="text-[9px] text-indigo-600 uppercase font-black tracking-widest mt-1.5">{user?.role} Portal</p>
              </div>
              <img 
                src={user?.avatar} 
                alt="Profile" 
                className="w-11 h-11 rounded-2xl border-2 border-white shadow-md ring-1 ring-slate-100 object-cover cursor-pointer hover:scale-105 transition-transform"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 bg-[#f8fafc]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
