
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
  const navigate = useNavigate();
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '⊞', roles: [UserRole.STUDENT, UserRole.LECTURER] },
    { name: 'Catalog', href: '/', icon: '📚', roles: [UserRole.STUDENT, UserRole.LECTURER, UserRole.ADMIN] },
    { name: 'Administration', href: '/admin', icon: '⚙', roles: [UserRole.ADMIN] },
    { name: 'Academic Calendar', href: '/calendar', icon: '📅', roles: [UserRole.STUDENT, UserRole.LECTURER, UserRole.ADMIN] },
  ];

  const filteredNav = navigation.filter(item => user && item.roles.includes(user.role));

  return (
    <div className="flex flex-col min-h-screen bg-[#050d1a] text-[#f5f0e8] font-sans font-light relative">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-12 h-[72px] bg-[rgba(5,13,26,0.85)] backdrop-blur-[20px] border-b border-[rgba(201,168,76,0.18)]">
        <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-[38px] h-[38px] bg-gradient-to-br from-[#c9a84c] to-[#7a6030] rounded-lg flex items-center justify-center font-playfair font-black text-base text-[#050d1a] shadow-[0_0_20px_rgba(201,168,76,0.35)]">
            B
          </div>
          <div className="font-playfair text-[1.1rem] font-bold tracking-wider text-[#f5f0e8]">
            BBUC <span className="text-[#c9a84c]">Library</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {filteredNav.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `text-[0.82rem] font-normal tracking-widest uppercase transition-colors border-b border-transparent pb-0.5 ${
                  isActive ? 'text-[#c9a84c] border-[#c9a84c]' : 'text-[#f5f0e8]/55 hover:text-[#c9a84c]'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3">
            <div className="w-[7px] h-[7px] rounded-full bg-[#4ade80] shadow-[0_0_8px_#4ade80] animate-pulse"></div>
            <div className="text-[0.75rem] text-[#4ade80] tracking-wider">Live · Supabase</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4f6ef7] to-[#7a6030] border-[1.5px] border-[#7a6030] flex items-center justify-center text-[0.8rem] font-medium text-[#f5f0e8] cursor-pointer">
            {user?.name.split(' ').map(n => n[0]).join('')}
          </div>
        </div>
      </nav>

      <div className="flex flex-1 pt-[72px]">
        {/* SIDEBAR */}
        <aside className="w-[240px] shrink-0 p-10 flex flex-col gap-1.5 border-r border-[rgba(201,168,76,0.18)] bg-[rgba(5,13,26,0.4)]">
          <div className="text-[0.65rem] tracking-[0.15em] uppercase text-[#7a6030] mt-6 mb-2 px-3">Navigation</div>
          {filteredNav.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3 py-2.5 rounded-lg transition-all text-[0.88rem] ${
                  isActive 
                    ? 'bg-gradient-to-br from-[rgba(201,168,76,0.15)] to-[rgba(79,110,247,0.08)] text-[#c9a84c] border border-[rgba(201,168,76,0.2)] shadow-[inset_0_0_20px_rgba(201,168,76,0.05)]' 
                    : 'text-[#f5f0e8]/55 hover:bg-[rgba(245,240,232,0.08)] hover:text-[#f5f0e8]'
                }`
              }
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}

          <div className="text-[0.65rem] tracking-[0.15em] uppercase text-[#7a6030] mt-6 mb-2 px-3">Collections</div>
          <div className="flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-[#f5f0e8]/55 hover:bg-[rgba(245,240,232,0.08)] hover:text-[#f5f0e8] cursor-pointer transition-all text-[0.88rem]">
            <span className="text-base w-5 text-center">📕</span> Physical Books
          </div>
          <div className="flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-[#f5f0e8]/55 hover:bg-[rgba(245,240,232,0.08)] hover:text-[#f5f0e8] cursor-pointer transition-all text-[0.88rem]">
            <span className="text-base w-5 text-center">💻</span> E-Books
          </div>
          <div className="flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-[#f5f0e8]/55 hover:bg-[rgba(245,240,232,0.08)] hover:text-[#f5f0e8] cursor-pointer transition-all text-[0.88rem]">
            <span className="text-base w-5 text-center">📄</span> Journals
          </div>

          <div className="mt-auto pt-6 border-t border-[rgba(201,168,76,0.18)]">
            <button 
              onClick={onLogout}
              className="flex w-full items-center gap-3.5 px-3 py-2.5 rounded-lg text-[#f5f0e8]/55 hover:bg-red-500/10 hover:text-red-400 transition-all text-[0.88rem]"
            >
              <span className="text-base w-5 text-center">⎋</span> Sign Out
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-12 flex flex-col gap-8 overflow-y-auto relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
