
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
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[rgba(201,168,76,0.18)] pb-8">
        <div>
          <h1 className="font-playfair text-[2.5rem] font-bold leading-none">
            Admin <em className="italic text-[#c9a84c]">Control.</em>
          </h1>
          <p className="text-[0.85rem] text-[#f5f0e8]/55 mt-2">Oversee institutional resources and member credentials.</p>
        </div>
        
        <div className={`flex items-center gap-4 px-6 py-3 rounded-2xl border ${isConfigured ? 'bg-[rgba(74,222,128,0.05)] border-[rgba(74,222,128,0.2)]' : 'bg-[rgba(201,168,76,0.05)] border-[rgba(201,168,76,0.2)]'}`}>
          <div className={`w-2.5 h-2.5 rounded-full ${isConfigured ? 'bg-[#4ade80]' : 'bg-[#c9a84c] animate-pulse'} shadow-[0_0_10px_currentColor]`}></div>
          <div className="text-[0.72rem] font-bold tracking-widest uppercase">
            {isConfigured ? 'Supabase Live' : 'Mock Environment'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Resources', value: books.length, icon: '📚', color: 'text-[#c9a84c]' },
          { label: 'Active Loans', value: records.filter(r => !r.returnDate).length, icon: '🤝', color: 'text-[#4f6ef7]' },
          { label: 'Total Members', value: users.length, icon: '👥', color: 'text-[#4ade80]' },
          { label: 'System Health', value: '100%', icon: '⚡', color: 'text-[#f5f0e8]' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-[rgba(255,255,255,0.04)] p-8 rounded-[2rem] border border-[rgba(201,168,76,0.18)] hover:border-[rgba(201,168,76,0.35)] transition-all group">
            <div className="text-3xl mb-4 opacity-50 group-hover:opacity-100 transition-opacity">{stat.icon}</div>
            <p className="text-[0.65rem] font-bold text-[#f5f0e8]/40 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color} tracking-tight`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[rgba(255,255,255,0.04)] rounded-[2.5rem] border border-[rgba(201,168,76,0.18)] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
        <div className="flex border-b border-[rgba(201,168,76,0.18)] bg-[rgba(255,255,255,0.02)]">
          <button 
            onClick={() => setActiveTab('books')}
            className={`px-10 py-6 font-bold text-[0.7rem] uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === 'books' ? 'text-[#c9a84c] border-[#c9a84c] bg-[rgba(201,168,76,0.05)]' : 'text-[#f5f0e8]/40 border-transparent hover:text-[#f5f0e8]'}`}
          >
            Resources
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-10 py-6 font-bold text-[0.7rem] uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === 'users' ? 'text-[#c9a84c] border-[#c9a84c] bg-[rgba(201,168,76,0.05)]' : 'text-[#f5f0e8]/40 border-transparent hover:text-[#f5f0e8]'}`}
          >
            Members
          </button>
        </div>
        
        <div className="overflow-x-auto">
          {activeTab === 'books' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[#f5f0e8]/30 text-[0.65rem] font-bold uppercase tracking-widest border-b border-[rgba(201,168,76,0.1)]">
                  <th className="px-8 py-6">Resource</th>
                  <th className="px-8 py-6">Availability</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6">Department</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(201,168,76,0.08)]">
                {books.map(book => (
                  <tr key={book.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <img src={book.coverUrl} className="w-10 h-14 rounded-lg object-cover shadow-lg border border-[rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform" />
                        <div>
                          <p className="font-bold text-[#f5f0e8] leading-tight text-[0.95rem] tracking-tight">{book.title}</p>
                          <p className="text-[0.75rem] text-[#f5f0e8]/40 mt-1 italic">by {book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => handleToggleStatus(book)}
                        disabled={book.status === BookStatus.RESERVED}
                        className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none active:scale-95 disabled:opacity-30 ${
                          book.status === BookStatus.AVAILABLE ? 'bg-[#4ade80]' : 'bg-[#f5f0e8]/10'
                        }`}
                      >
                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          book.status === BookStatus.AVAILABLE ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-widest border ${
                        book.status === BookStatus.AVAILABLE ? 'bg-[rgba(74,222,128,0.1)] text-[#4ade80] border-[rgba(74,222,128,0.2)]' :
                        book.status === BookStatus.BORROWED ? 'bg-[rgba(201,168,76,0.1)] text-[#c9a84c] border-[rgba(201,168,76,0.2)]' : 'bg-[rgba(79,110,247,0.1)] text-[#4f6ef7] border-[rgba(79,110,247,0.2)]'
                      }`}>
                        {book.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[0.7rem] font-bold text-[#f5f0e8]/40 uppercase tracking-widest">{book.department}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="text-[#f5f0e8]/20 hover:text-[#c9a84c] transition-colors">⚙️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[#f5f0e8]/30 text-[0.65rem] font-bold uppercase tracking-widest border-b border-[rgba(201,168,76,0.1)]">
                  <th className="px-8 py-6">Member</th>
                  <th className="px-8 py-6">Department</th>
                  <th className="px-8 py-6">Role</th>
                  <th className="px-8 py-6">Library Card</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(201,168,76,0.08)]">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <img src={u.avatar} className="w-10 h-10 rounded-xl border border-[rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform object-cover" />
                        <div>
                          <p className="font-bold text-[#f5f0e8] text-[0.95rem] tracking-tight leading-none">{u.name}</p>
                          <p className="text-[0.75rem] text-[#f5f0e8]/40 mt-1.5">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-[0.75rem] font-bold text-[#f5f0e8]/60 uppercase tracking-widest">{u.department || 'GENERAL'}</td>
                    <td className="px-8 py-6">
                      <span className={`px-2.5 py-1 rounded-lg text-[0.65rem] font-bold uppercase tracking-widest border ${
                        u.role === UserRole.LECTURER ? 'bg-[rgba(168,85,247,0.1)] text-[#a855f7] border-[rgba(168,85,247,0.2)]' : 
                        u.role === UserRole.STUDENT ? 'bg-[rgba(79,110,247,0.1)] text-[#4f6ef7] border-[rgba(79,110,247,0.2)]' : 
                        'bg-[#c9a84c] text-[#050d1a]'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      {u.libraryCard ? (
                        <button 
                          onClick={() => handleToggleCard(u.id, u.libraryCard!)}
                          className={`flex items-center gap-3 transition-colors ${u.libraryCard.status === 'ACTIVE' ? 'text-[#4ade80]' : 'text-[#f87171]'}`}
                        >
                          <div className="flex flex-col text-left">
                            <span className="font-mono text-[0.85rem] font-bold tracking-tighter">{u.libraryCard.cardNumber}</span>
                            <span className="text-[0.6rem] font-bold opacity-50 uppercase tracking-widest">{u.libraryCard.status}</span>
                          </div>
                        </button>
                      ) : (
                        <span className="text-[0.65rem] font-bold text-[#f5f0e8]/20 uppercase tracking-widest italic">Awaiting Activation</span>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => startEditUser(u)} className="text-[#f5f0e8]/20 hover:text-[#c9a84c] transition-colors">✏️</button>
                        {!u.libraryCard && u.role !== UserRole.ADMIN && (
                          <button 
                            onClick={() => handleIssueCard(u.id)}
                            disabled={issuingId === u.id}
                            className={`px-4 py-2 rounded-lg text-[0.65rem] font-bold uppercase tracking-widest transition-all active:scale-95 ${
                              successId === u.id ? 'bg-[#4ade80] text-[#050d1a]' : 'bg-[#c9a84c] text-[#050d1a] hover:bg-[#f0c84a]'
                            }`}
                          >
                            {issuingId === u.id ? '...' : successId === u.id ? '✓' : 'Activate'}
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#050d1a]/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0a1526] w-full max-w-lg rounded-[2.5rem] border border-[rgba(201,168,76,0.18)] shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden animate-in zoom-in-95">
            <div className="p-10 border-b border-[rgba(201,168,76,0.18)] flex items-center justify-between">
              <h2 className="font-playfair text-[1.8rem] font-bold text-[#f5f0e8]">Update <em className="italic text-[#c9a84c]">Profile.</em></h2>
              <button onClick={() => setEditingUser(null)} className="text-[#f5f0e8]/40 hover:text-[#f5f0e8] transition-colors text-2xl">×</button>
            </div>
            
            <form onSubmit={handleUpdateUserSubmit} className="p-10 space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[0.7rem] text-[#c9a84c] font-bold tracking-widest uppercase ml-1">Full Name</label>
                <input 
                  type="text"
                  required
                  className="bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.18)] rounded-xl py-4 px-5 text-[0.95rem] text-[#f5f0e8] outline-none focus:border-[#c9a84c] transition-all"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[0.7rem] text-[#c9a84c] font-bold tracking-widest uppercase ml-1">Department</label>
                  <select 
                    className="bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.18)] rounded-xl py-4 px-4 text-[0.8rem] text-[#f5f0e8] outline-none focus:border-[#c9a84c] transition-all appearance-none"
                    value={editFormData.department}
                    onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                  >
                    <option value="IT">IT</option>
                    <option value="Theology">Theology</option>
                    <option value="Education">Education</option>
                    <option value="Business">Business</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[0.7rem] text-[#c9a84c] font-bold tracking-widest uppercase ml-1">Role</label>
                  <select 
                    className="bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.18)] rounded-xl py-4 px-4 text-[0.8rem] text-[#f5f0e8] outline-none focus:border-[#c9a84c] transition-all appearance-none"
                    value={editFormData.role}
                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value as UserRole })}
                  >
                    <option value={UserRole.STUDENT}>Student</option>
                    <option value={UserRole.LECTURER}>Lecturer</option>
                    <option value={UserRole.ADMIN}>Admin</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-4 text-[0.8rem] font-bold text-[#f5f0e8]/40 hover:text-[#f5f0e8] transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isUpdating}
                  className="flex-1 bg-[#c9a84c] text-[#050d1a] py-4 rounded-xl font-bold text-[0.85rem] shadow-[0_10px_30px_rgba(201,168,76,0.2)] hover:shadow-[0_15px_40px_rgba(201,168,76,0.3)] transition-all active:scale-95 disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
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
