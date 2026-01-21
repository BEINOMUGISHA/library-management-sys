
import React, { useState } from 'react';
import { Book, BorrowRecord, User, BookStatus, UserRole } from '../types';
import { Icons } from '../pages/constants';

interface AdminDashboardProps {
  books: Book[];
  records: BorrowRecord[];
  users: User[];
  onIssueCard: (userId: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ books, records, users, onIssueCard }) => {
  const [activeTab, setActiveTab] = useState<'books' | 'users'>('books');

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Library Administration</h1>
          <p className="text-slate-500 mt-1">Management portal for library resources and users.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white text-slate-600 border border-slate-200 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
            Generate Report
          </button>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 active:scale-95 transform">
            <Icons.Plus />
            Add New Resource
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Books', value: books.length, icon: Icons.BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Borrows', value: records.length, icon: Icons.Dashboard, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Total Members', value: users.length, icon: Icons.User, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Overdue Books', value: 2, icon: Icons.Bell, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon />
            </div>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-50">
          <button 
            onClick={() => setActiveTab('books')}
            className={`px-8 py-5 font-bold text-sm transition-all border-b-2 ${activeTab === 'books' ? 'text-blue-600 border-blue-600 bg-blue-50/10' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
          >
            Resource Management
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-8 py-5 font-bold text-sm transition-all border-b-2 ${activeTab === 'users' ? 'text-blue-600 border-blue-600 bg-blue-50/10' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
          >
            User Management & Card Issuance
          </button>
        </div>
        
        <div className="overflow-x-auto">
          {activeTab === 'books' ? (
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-xs font-bold uppercase tracking-widest border-b border-slate-50">
                  <th className="px-8 py-5">Book Info</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Department</th>
                  <th className="px-8 py-5">Category</th>
                  <th className="px-8 py-5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {books.map(book => (
                  <tr key={book.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <img src={book.coverUrl} className="w-10 h-14 rounded-lg object-cover" />
                        <div>
                          <p className="font-bold text-slate-800">{book.title}</p>
                          <p className="text-sm text-slate-400">{book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        book.status === BookStatus.AVAILABLE ? 'bg-emerald-100 text-emerald-600' :
                        book.status === BookStatus.BORROWED ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {book.status}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">
                        {book.department}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium text-slate-600">{book.category}</td>
                    <td className="px-8 py-5">
                      <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                        <Icons.Settings />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-xs font-bold uppercase tracking-widest border-b border-slate-50">
                  <th className="px-8 py-5">User Info</th>
                  <th className="px-8 py-5">Department</th>
                  <th className="px-8 py-5">Role</th>
                  <th className="px-8 py-5">Library Card</th>
                  <th className="px-8 py-5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <img src={u.avatar} className="w-10 h-10 rounded-full border border-slate-200" />
                        <div>
                          <p className="font-bold text-slate-800">{u.name}</p>
                          <p className="text-sm text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium text-slate-600">{u.department || 'N/A'}</td>
                    <td className="px-8 py-5 text-sm">
                      <span className={`font-bold ${u.role === UserRole.LECTURER ? 'text-purple-600' : u.role === UserRole.STUDENT ? 'text-blue-600' : 'text-slate-900'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      {u.libraryCard ? (
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-500"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg></span>
                          <span className="font-mono text-xs font-bold text-slate-500">{u.libraryCard.cardNumber}</span>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-slate-300">Not Issued</span>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      {!u.libraryCard && u.role !== UserRole.ADMIN ? (
                        <button 
                          onClick={() => onIssueCard(u.id)}
                          className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                        >
                          Issue Library Card
                        </button>
                      ) : (
                        <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                          <Icons.Settings />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
