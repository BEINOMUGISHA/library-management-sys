
import React, { useState } from 'react';
import { Icons } from './constants';
import { UserRole, User } from '../types';

interface AuthProps {
  onAuthComplete: (user: User) => void;
  existingUsers: User[];
}

const Auth: React.FC<AuthProps> = ({ onAuthComplete, existingUsers }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    department: 'IT',
    role: UserRole.STUDENT
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simulate Network Latency
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      if (mode === 'signin') {
        const found = existingUsers.find(u => u.email === formData.email);
        if (found) {
          onAuthComplete(found);
        } else {
          // If not found in mock list, create a dynamic mock user
          onAuthComplete({
            id: 'u-' + Math.random().toString(36).substr(2, 9),
            name: formData.email.split('@')[0].replace('.', ' '),
            email: formData.email,
            role: UserRole.STUDENT,
            avatar: `https://i.pravatar.cc/150?u=${formData.email}`,
            department: 'General Studies'
          });
        }
      } else {
        // Sign Up Flow
        onAuthComplete({
          id: 'u-' + Math.random().toString(36).substr(2, 9),
          name: formData.name,
          email: formData.email,
          role: formData.role,
          avatar: `https://i.pravatar.cc/150?u=${formData.email}`,
          department: formData.department
        });
      }
    } catch (err) {
      setError('Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="max-w-md w-full animate-in">
        <div className="text-center mb-10">
          <div className="bg-blue-700 w-16 h-16 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-200 text-white transform hover:rotate-12 transition-transform">
            <Icons.Library />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">BBUC Library</h1>
          <p className="text-slate-500 mt-2 font-bold uppercase tracking-widest text-[10px]">Bishop Barham University College</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white/50">
          {/* Mode Switcher */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
            <button 
              onClick={() => setMode('signin')}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'signin' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setMode('signup')}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'signup' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold animate-in">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Icons.User /></span>
                  <input 
                    name="name"
                    type="text" 
                    required
                    placeholder="e.g. Samuel Mugisha"
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 transition-all outline-none text-sm font-bold"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Institutional Email</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </span>
                <input 
                  name="email"
                  type="email" 
                  required
                  placeholder="name@bbuc.ac.ug"
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 transition-all outline-none text-sm font-bold"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
                <input 
                  name="password"
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 transition-all outline-none text-sm font-bold"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role</label>
                  <select 
                    name="role"
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-sm font-bold appearance-none cursor-pointer"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value={UserRole.STUDENT}>Student</option>
                    <option value={UserRole.LECTURER}>Lecturer</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department</label>
                  <select 
                    name="department"
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none text-sm font-bold appearance-none cursor-pointer"
                    value={formData.department}
                    onChange={handleInputChange}
                  >
                    <option value="IT">IT</option>
                    <option value="Theology">Theology</option>
                    <option value="Education">Education</option>
                    <option value="Business">Business</option>
                  </select>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-700 text-white py-4 rounded-[1.5rem] text-sm font-black uppercase tracking-[0.2em] hover:bg-blue-800 transition-all shadow-xl shadow-blue-100 mt-6 active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            <button className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">Forgot Password?</button>
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">v2.1 Secured</p>
          </div>
        </div>

        {/* Demo Switcher Info */}
        <div className="mt-8 flex justify-center gap-4 text-center">
          <div className="px-4 py-2 bg-slate-100 rounded-full border border-slate-200">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Demo Access</p>
            <p className="text-[10px] font-bold text-slate-600">john.doe@student.bbuc.ac.ug</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
