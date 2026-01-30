
import React, { useState } from 'react';
import { Book, BorrowRecord, User, BookStatus, UserRole, LibraryCard } from '../types';
import { Icons } from '../pages/constants';
import { isConfigured } from '../services/supabase';

interface AdminDashboardProps {
  books: Book[];
  records: BorrowRecord[];
  users: User[];
  onIssueCard: (userId: string) => Promise<any>;
  onUpdateBookStatus: (bookId: string, newStatus: BookStatus) => void;
  onUpdateUser?: (userId: string, updates: { name: string, department: string, role: UserRole }) => Promise<void>;
  // Fix: Changed Promise<void> to Promise<any> to match the service return type (Promise<LibraryCard>)
  onToggleCardStatus?: (userId: string, currentCard: LibraryCard) => Promise<any>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  books, 
  records, 
  users, 
  onIssueCard, 
  onUpdateBookStatus,
  onUpdateUser,
  onToggleCardStatus
}) => {
  const [activeTab, setActiveTab] = useState<'books' | 'users'>('books');
  const [issuingId, setIssuingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  
  // User Edit Modal State
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState({ name: '', department: '', role: UserRole.STUDENT });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleStatus = (book: Book) => {
    const nextStatus = book.status === BookStatus.AVAILABLE 
      ? BookStatus.BORROWED 
      : BookStatus.AVAILABLE;
    onUpdateBookStatus(book.id, nextStatus);
  };

  const handleIssueCard = async (userId: string) => {
    setIssuingId(userId);
    try {
      await onIssueCard(userId);
      setSuccessId(userId);
      setTimeout(() => setSuccessId(null), 3000);
    } catch (err) {
      console.error("Failed to issue card:", err);
      alert("System error: Could not issue library card. Please check database connection.");
    } finally {
      setIssuingId(null);
    }
  };

  const startEditUser = (user: User) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name,
      department: user.department || 'IT',
      role: user.role
    });
  };

  const handleUpdateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !onUpdateUser) return;
    setIsUpdating(true);
    try {
      await onUpdateUser(editingUser.id, editFormData);
      setEditingUser(null);
    } catch (err) {
      console.error("Update failed:", err);
      alert("System error: Could not update user profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleCard = async (userId: string, card: LibraryCard) => {
    if (!onToggleCardStatus) return;
    try {
      await onToggleCardStatus(userId, card);
    } catch (err) {
      console.error("Card status toggle failed:", err);
      alert("System error: Could not change library card status.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Library Administration</h1>
          <p className="text-slate-500 mt-1 font-medium">Management portal for library resources and users.</p>
        </div>
        
        {/* Connection Status Indicator */}
        <div className={`flex items-center gap-4 px-6 py-3 rounded-2xl border ${isConfigured ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100 animate-pulse'}`}>
          <div className={`w-3 h-3 rounded-full ${isConfigured ? 'bg-emerald-500' : 'bg-amber-500'} shadow-sm`}></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Database Engine</p>
            <p className={`text-sm font-black ${isConfigured ? 'text-emerald-700' : 'text-amber-700'}`}>
              {isConfigured ? 'Live Supabase Integrated' : 'Running on Mock Data'}
            </p>
          </div>
          {!isConfigured && (
            <div className="ml-2 group relative">
              <svg className="w-5 h-5 text-amber-400 cursor-help" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
              <div className="absolute bottom-full right-0 mb-2 w-64 p-4 bg-slate-900 text-white text-[10px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 leading-relaxed font-bold tracking-wide shadow-2xl">
                To connect your live DB: Set SUPABASE_URL and SUPABASE_ANON_KEY in your environment variables and run the provided SQL schema.
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Books', value: books.length, icon: Icons.BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Active Borrows', value: records.filter(r => !r.returnDate).length, icon: Icons.Dashboard, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Total Members', value: users.length, icon: Icons.User, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'System Health', value: '100%', icon: Icons.Settings, color: 'text-slate-600', bg: 'bg-slate-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 border border-current opacity-20`}>
              <stat.icon />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
            <p className="text-4xl font-black text-slate-900 tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100 bg-slate-50/50">
          <button 
            onClick={() => setActiveTab('books')}
            className={`px-10 py-6 font-black text-xs uppercase tracking-[0.2em] transition-all border-b-4 ${activeTab === 'books' ? 'text-indigo-600 border-indigo-600 bg-white' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
          >
            Resource Management
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-10 py-6 font-black text-xs uppercase tracking-[0.2em] transition-all border-b-4 ${activeTab === 'users' ? 'text-indigo-600 border-indigo-600 bg-white' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
          >
            Member Control Center
          </button>
        </div>
        
        <div className="overflow-x-auto">
          {activeTab === 'books' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-50 bg-slate-50/20">
                  <th className="px-8 py-6">Resource Profile</th>
                  <th className="px-8 py-6">Availability</th>
                  <th className="px-8 py-6">Status Badge</th>
                  <th className="px-8 py-6">Department</th>
                  <th className="px-8 py-6 text-right">Settings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {books.map(book => (
                  <tr key={book.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <img src={book.coverUrl} className="w-12 h-16 rounded-xl object-cover shadow-lg border border-slate-100 group-hover:scale-110 transition-transform" />
                        <div>
                          <p className="font-black text-slate-900 leading-tight text-base tracking-tight">{book.title}</p>
                          <p className="text-xs text-slate-400 font-bold mt-1 italic">by {book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleToggleStatus(book)}
                          disabled={book.status === BookStatus.RESERVED}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed ${
                            book.status === BookStatus.AVAILABLE ? 'bg-emerald-500' : 'bg-slate-200'
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              book.status === BookStatus.AVAILABLE ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${book.status === BookStatus.AVAILABLE ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {book.status === BookStatus.AVAILABLE ? 'Available' : 'Restricted'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 ${
                        book.status === BookStatus.AVAILABLE ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        book.status === BookStatus.BORROWED ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                      }`}>
                        {book.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500">
                        {book.department}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-3 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                        <Icons.Settings />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-50 bg-slate-50/20">
                  <th className="px-8 py-6">Institutional Identity</th>
                  <th className="px-8 py-6">Department</th>
                  <th className="px-8 py-6">Academic Role</th>
                  <th className="px-8 py-6">Library Credential</th>
                  <th className="px-8 py-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <img src={u.avatar} className="w-12 h-12 rounded-2xl border border-slate-200 group-hover:scale-105 transition-transform object-cover shadow-sm" />
                        <div>
                          <p className="font-black text-slate-900 text-base tracking-tight uppercase leading-none">{u.name}</p>
                          <p className="text-xs text-slate-400 font-bold mt-1.5">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-black text-slate-600 tracking-tight uppercase">{u.department || 'GENERAL'}</td>
                    <td className="px-8 py-6 text-sm">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${u.role === UserRole.LECTURER ? 'bg-purple-50 text-purple-600 border border-purple-100' : u.role === UserRole.STUDENT ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-slate-900 text-white'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      {u.libraryCard ? (
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleToggleCard(u.id, u.libraryCard!)}
                            title={u.libraryCard.status === 'ACTIVE' ? 'Click to Suspend' : 'Click to Activate'}
                            className={`flex items-center gap-3 group/card ${u.libraryCard.status === 'ACTIVE' ? 'text-emerald-500' : 'text-rose-500'}`}
                          >
                            <span className="transition-transform group-hover/card:scale-110">
                              {u.libraryCard.status === 'ACTIVE' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                              )}
                            </span>
                            <div className="flex flex-col text-left">
                              <span className="font-mono text-sm font-black tracking-tighter">{u.libraryCard.cardNumber}</span>
                              <span className="text-[9px] font-black opacity-50 uppercase tracking-widest mt-0.5">{u.libraryCard.status}</span>
                            </div>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 text-slate-200 group-hover:text-slate-400 transition-colors">
                          <Icons.IdCard />
                          <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Issuance</span>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => startEditUser(u)}
                          className="p-3 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                        </button>
                        {!u.libraryCard && u.role !== UserRole.ADMIN && (
                          <button 
                            onClick={() => handleIssueCard(u.id)}
                            disabled={issuingId === u.id || successId === u.id}
                            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 transform ${
                              successId === u.id 
                                ? 'bg-emerald-500 text-white shadow-emerald-100' 
                                : issuingId === u.id
                                  ? 'bg-slate-100 text-slate-400 border-2 border-dashed border-slate-200'
                                  : 'bg-indigo-700 text-white hover:bg-indigo-800 shadow-indigo-100'
                            }`}
                          >
                            {issuingId === u.id ? (
                              <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                            ) : successId === u.id ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                            ) : (
                              'Activate'
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* User Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95">
            <div className="bg-indigo-700 p-8 text-white flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight leading-none uppercase">Update Profile</h2>
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-2">Institutional Record Correction</p>
              </div>
              <button onClick={() => setEditingUser(null)} className="p-3 hover:bg-white/10 rounded-2xl transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            
            <form onSubmit={handleUpdateUserSubmit} className="p-10 space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text"
                  required
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-600 outline-none text-sm font-bold transition-all"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department</label>
                  <select 
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-600 outline-none text-xs font-black uppercase tracking-widest appearance-none cursor-pointer"
                    value={editFormData.department}
                    onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                  >
                    <option value="IT">IT</option>
                    <option value="Theology">Theology</option>
                    <option value="Education">Education</option>
                    <option value="Business">Business Administration</option>
                    <option value="Social Sciences">Social Sciences</option>
                    <option value="Journalism">Journalism & Media</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Academic Role</label>
                  <select 
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-indigo-600 outline-none text-xs font-black uppercase tracking-widest appearance-none cursor-pointer"
                    value={editFormData.role}
                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value as UserRole })}
                  >
                    <option value={UserRole.STUDENT}>Student</option>
                    <option value={UserRole.LECTURER}>Lecturer</option>
                    <option value={UserRole.ADMIN}>Administrator</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isUpdating}
                  className="flex-1 bg-indigo-700 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-800 transition-all shadow-xl shadow-indigo-100 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isUpdating ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Save Changes
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
