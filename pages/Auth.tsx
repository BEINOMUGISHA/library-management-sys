
import React, { useState } from 'react';
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

  const getRoleFromEmail = (email: string): UserRole => {
    const lowerEmail = email.toLowerCase();
    if (lowerEmail === 'admin@library.bbuc.ac.ug') return UserRole.ADMIN;
    if (lowerEmail.endsWith('@student.bbuc.ac.ug')) return UserRole.STUDENT;
    if (lowerEmail.endsWith('@bbuc.ac.ug')) return UserRole.LECTURER;
    return UserRole.STUDENT;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      if (mode === 'signin') {
        const found = existingUsers.find(u => u.email.toLowerCase() === formData.email.toLowerCase());
        
        if (found) {
          onAuthComplete(found);
        } else {
          const detectedRole = getRoleFromEmail(formData.email);
          onAuthComplete({
            id: 'u-' + Math.random().toString(36).substr(2, 9),
            name: formData.email.split('@')[0].replace('.', ' '),
            email: formData.email,
            role: detectedRole,
            avatar: `https://i.pravatar.cc/150?u=${formData.email}`,
            department: detectedRole === UserRole.STUDENT ? 'Student Affairs' : 'Faculty Research'
          });
        }
      } else {
        const detectedRole = getRoleFromEmail(formData.email);
        const finalRole = detectedRole === UserRole.ADMIN ? UserRole.LECTURER : formData.role;

        onAuthComplete({
          id: 'u-' + Math.random().toString(36).substr(2, 9),
          name: formData.name,
          email: formData.email,
          role: finalRole,
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
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#050d1a]">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#c9a84c] rounded-full blur-[120px] opacity-[0.08]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#4f6ef7] rounded-full blur-[120px] opacity-[0.08]"></div>

      <div className="w-full max-w-[440px] bg-[rgba(5,13,26,0.6)] backdrop-blur-[30px] border border-[rgba(201,168,76,0.18)] rounded-[2.5rem] p-12 shadow-[0_40px_100px_rgba(0,0,0,0.5)] animate-in relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-[64px] h-[64px] bg-gradient-to-br from-[#c9a84c] to-[#7a6030] rounded-2xl flex items-center justify-center font-playfair font-black text-2xl text-[#050d1a] shadow-[0_0_30px_rgba(201,168,76,0.3)] mb-6">
            B
          </div>
          <h1 className="font-playfair text-[1.8rem] font-bold text-[#f5f0e8] tracking-tight">
            BBUC <span className="text-[#c9a84c]">Library</span>
          </h1>
          <p className="text-[0.82rem] text-[#f5f0e8]/40 mt-2 tracking-widest uppercase">Institutional Access Portal</p>
        </div>

        {/* Mode Switcher */}
        <div className="flex bg-[rgba(255,255,255,0.04)] p-1.5 rounded-2xl mb-8 border border-[rgba(201,168,76,0.18)]">
          <button 
            onClick={() => setMode('signin')}
            className={`flex-1 py-3 rounded-xl text-[0.7rem] font-bold uppercase tracking-widest transition-all ${mode === 'signin' ? 'bg-[#c9a84c] text-[#050d1a] shadow-lg' : 'text-[#f5f0e8]/40 hover:text-[#f5f0e8]'}`}
          >
            Sign In
          </button>
          <button 
            onClick={() => setMode('signup')}
            className={`flex-1 py-3 rounded-xl text-[0.7rem] font-bold uppercase tracking-widest transition-all ${mode === 'signup' ? 'bg-[#c9a84c] text-[#050d1a] shadow-lg' : 'text-[#f5f0e8]/40 hover:text-[#f5f0e8]'}`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="p-4 bg-[rgba(248,113,113,0.1)] border border-[rgba(248,113,113,0.2)] rounded-xl text-[#f87171] text-[0.75rem] font-medium animate-in">
              {error}
            </div>
          )}

          {mode === 'signup' && (
            <div className="flex flex-col gap-2">
              <label className="text-[0.7rem] text-[#c9a84c] font-bold tracking-widest uppercase ml-1">Full Name</label>
              <input 
                name="name"
                type="text"
                required
                placeholder="Enter your full name"
                className="bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.18)] rounded-xl py-4 px-5 text-[0.9rem] text-[#f5f0e8] placeholder-[#f5f0e8]/20 outline-none focus:border-[#c9a84c] focus:bg-[rgba(201,168,76,0.05)] transition-all"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-[0.7rem] text-[#c9a84c] font-bold tracking-widest uppercase ml-1">Institutional Email</label>
            <input 
              name="email"
              type="email"
              required
              placeholder="name@bbuc.ac.ug"
              className="bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.18)] rounded-xl py-4 px-5 text-[0.9rem] text-[#f5f0e8] placeholder-[#f5f0e8]/20 outline-none focus:border-[#c9a84c] focus:bg-[rgba(201,168,76,0.05)] transition-all"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[0.7rem] text-[#c9a84c] font-bold tracking-widest uppercase ml-1">Password</label>
            <input 
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.18)] rounded-xl py-4 px-5 text-[0.9rem] text-[#f5f0e8] placeholder-[#f5f0e8]/20 outline-none focus:border-[#c9a84c] focus:bg-[rgba(201,168,76,0.05)] transition-all"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>

          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[0.7rem] text-[#c9a84c] font-bold tracking-widest uppercase ml-1">Role</label>
                <select 
                  name="role"
                  className="bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.18)] rounded-xl py-4 px-4 text-[0.8rem] text-[#f5f0e8] outline-none focus:border-[#c9a84c] transition-all appearance-none"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value={UserRole.STUDENT}>Student</option>
                  <option value={UserRole.LECTURER}>Lecturer</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.7rem] text-[#c9a84c] font-bold tracking-widest uppercase ml-1">Dept</label>
                <select 
                  name="department"
                  className="bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.18)] rounded-xl py-4 px-4 text-[0.8rem] text-[#f5f0e8] outline-none focus:border-[#c9a84c] transition-all appearance-none"
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
            className="mt-4 bg-gradient-to-br from-[#c9a84c] to-[#7a6030] text-[#050d1a] py-4 rounded-xl font-bold text-[0.9rem] shadow-[0_10px_30px_rgba(201,168,76,0.25)] hover:shadow-[0_15px_40px_rgba(201,168,76,0.4)] hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#050d1a]/30 border-t-[#050d1a] rounded-full animate-spin"></div>
                Authenticating...
              </>
            ) : (
              mode === 'signin' ? 'Sign In to Library' : 'Create Library Account'
            )}
          </button>
        </form>

        <div className="mt-10 flex flex-col items-center gap-4">
          <p className="text-[0.7rem] text-[#f5f0e8]/25 tracking-widest uppercase">Quick Access Identities</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: 'Admin', email: 'admin@library.bbuc.ac.ug' },
              { label: 'Lecturer', email: 'sarah.smith@bbuc.ac.ug' },
              { label: 'Student', email: 'john.doe@student.bbuc.ac.ug' },
            ].map((demo) => (
              <button 
                key={demo.label}
                onClick={() => setFormData({ ...formData, email: demo.email })}
                className="px-3 py-1.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.1)] rounded-lg text-[0.65rem] text-[#f5f0e8]/40 hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all"
              >
                {demo.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
