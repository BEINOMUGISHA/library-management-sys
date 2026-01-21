
import React from 'react';
import { User, UserRole } from '../types';
import { Icons } from './constants';

interface LoginProps {
  onLogin: (user: User) => void;
  users: User[];
}

const Login: React.FC<LoginProps> = ({ onLogin, users }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="bg-blue-700 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200 text-white">
            <Icons.Library />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">Bishop Barham University College</h1>
          <p className="text-slate-500 mt-2 font-medium">Library Management System</p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-6 text-center">Select Profile to Login</h2>
          <div className="space-y-4">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => onLogin(user)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-50 hover:border-blue-600 hover:bg-blue-50 transition-all group"
              >
                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                <div className="text-left">
                  <p className="font-bold text-slate-800 group-hover:text-blue-700">{user.name}</p>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{user.role}</p>
                </div>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Official Institutional Portal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
