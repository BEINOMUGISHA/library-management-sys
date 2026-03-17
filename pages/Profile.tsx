
import React, { useState } from 'react';
import { User } from '../types';
import { motion } from 'motion/react';

interface ProfileProps {
  user: User;
  onUpdate: (updates: Partial<User>) => Promise<void>;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
  const [name, setName] = useState(user.name);
  const [department, setDepartment] = useState(user.department);
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    try {
      await onUpdate({ name, department, avatar });
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      setMessage({ text: 'Failed to update profile. Please try again.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full animate-in">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c9a84c] to-[#7a6030] flex items-center justify-center text-2xl font-bold text-[#050d1a]">
          {user.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <h1 className="font-playfair text-3xl font-bold">My Profile</h1>
          <p className="text-[#f5f0e8]/55 text-sm">Manage your institutional identity and preferences</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.18)] rounded-[2rem] p-8 md:p-10"
      >
        {user.libraryCard && (
          <div className="mb-10 p-6 rounded-2xl bg-gradient-to-br from-[rgba(201,168,76,0.1)] to-transparent border border-[rgba(201,168,76,0.2)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-6xl">🪪</span>
            </div>
            <div className="relative z-10">
              <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[#c9a84c] font-bold mb-4">Institutional Library ID</p>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-2xl font-bold text-[#f5f0e8] tracking-tighter">{user.libraryCard.cardNumber}</p>
                  <p className="text-[0.7rem] text-[#f5f0e8]/40 mt-1">Issued: {new Date(user.libraryCard.issueDate).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${user.libraryCard.status === 'ACTIVE' ? 'bg-[#4ade80]' : 'bg-rose-500'}`}></div>
                  <span className={`text-[0.7rem] font-bold uppercase tracking-widest ${user.libraryCard.status === 'ACTIVE' ? 'text-[#4ade80]' : 'text-rose-500'}`}>
                    {user.libraryCard.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[0.7rem] uppercase tracking-widest text-[#c9a84c] font-bold">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[rgba(5,13,26,0.4)] border border-[rgba(201,168,76,0.15)] rounded-xl px-5 py-4 text-[#f5f0e8] focus:outline-none focus:border-[#c9a84c] transition-all"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[0.7rem] uppercase tracking-widest text-[#c9a84c] font-bold">Department</label>
              <select 
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-[rgba(5,13,26,0.4)] border border-[rgba(201,168,76,0.15)] rounded-xl px-5 py-4 text-[#f5f0e8] focus:outline-none focus:border-[#c9a84c] transition-all appearance-none"
              >
                <option value="IT">Information Technology</option>
                <option value="Theology">Theology</option>
                <option value="Business">Business</option>
                <option value="Social Sciences">Social Sciences</option>
                <option value="Education">Education</option>
                <option value="Nursing">Nursing</option>
                <option value="Library Services">Library Services</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[0.7rem] uppercase tracking-widest text-[#c9a84c] font-bold">Avatar URL</label>
              <input 
                type="url" 
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full bg-[rgba(5,13,26,0.4)] border border-[rgba(201,168,76,0.15)] rounded-xl px-5 py-4 text-[#f5f0e8] focus:outline-none focus:border-[#c9a84c] transition-all"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[0.7rem] uppercase tracking-widest text-[#c9a84c] font-bold">Email Address</label>
              <input 
                type="email" 
                value={user.email}
                disabled
                className="w-full bg-[rgba(5,13,26,0.2)] border border-[rgba(201,168,76,0.05)] rounded-xl px-5 py-4 text-[#f5f0e8]/40 cursor-not-allowed"
              />
              <p className="text-[0.65rem] text-[#f5f0e8]/30 italic">Institutional email cannot be changed manually.</p>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
              {message.text}
            </div>
          )}

          <button 
            type="submit"
            disabled={isSaving}
            className="w-full bg-gradient-to-br from-[#c9a84c] to-[#7a6030] text-[#050d1a] font-bold py-5 rounded-xl shadow-[0_10px_30px_rgba(201,168,76,0.2)] hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(201,168,76,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving Changes...' : 'Update Profile'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Profile;
