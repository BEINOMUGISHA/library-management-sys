
import React from 'react';
import { User, Book, BorrowRecord, Reservation } from './types';
import { Icons } from './pages/constants';
import { Link } from 'react-router-dom';

interface DashboardProps {
  user: User;
  books: Book[];
  records: BorrowRecord[];
  reservations: Reservation[];
  onReturn: (bookId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, books, records, reservations, onReturn }) => {
  const getBook = (id: string) => books.find(b => b.id === id);

  const activeBorrows = records.filter(r => !r.returnDate);
  const historyBorrows = records.filter(r => !!r.returnDate).sort((a, b) => 
    new Date(b.returnDate!).getTime() - new Date(a.returnDate!).getTime()
  );

  const calculateDuration = (start: string, end: string) => {
    const days = Math.floor((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24));
    return days === 0 ? 'Returned same day' : `Kept for ${days} days`;
  };

  const getDaysDiff = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    now.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-3">
            Institutional Dashboard
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Welcome, {user.name.split(' ')[0]}</h1>
          <p className="text-slate-500 mt-1 text-lg">Your academic resource summary and activity.</p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">Active Member</span>
          <div className="h-4 w-px bg-slate-200 mx-1"></div>
          <span className="text-xs font-mono text-slate-400">#{user.id.toUpperCase()}</span>
        </div>
      </div>

      {/* Stats & Digital Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <Icons.BookOpen />
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">On Loan</p>
            <p className="text-4xl font-black text-slate-900 mt-1">{activeBorrows.length}</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
              <Icons.Bell />
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Holds</p>
            <p className="text-4xl font-black text-slate-900 mt-1">{reservations.length}</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
              <Icons.Settings />
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Compliance</p>
            <p className="text-xl font-black text-emerald-600 mt-1 uppercase tracking-tight">Good Standing</p>
          </div>
        </div>

        {/* Digital Library Card */}
        <div className="lg:col-span-4">
          <div className="relative group overflow-hidden bg-gradient-to-br from-blue-800 via-blue-900 to-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-200 h-full flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full -ml-24 -mb-24 blur-3xl"></div>
            
            <div className="relative z-10 flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20">
                  <Icons.Library />
                </div>
                <div>
                  <h3 className="font-black text-sm tracking-tight leading-none uppercase">BBUC LIBRARY</h3>
                  <p className="text-[9px] opacity-50 tracking-[0.2em] mt-1 uppercase font-bold">University Services</p>
                </div>
              </div>
              <Icons.IdCard />
            </div>

            <div className="relative z-10 flex items-center gap-5 my-8">
              <div className="relative">
                <img src={user.avatar} className="w-20 h-20 rounded-3xl border-2 border-white/20 shadow-xl object-cover" />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-blue-900"></div>
              </div>
              <div>
                <h2 className="text-xl font-black leading-tight uppercase tracking-tighter">{user.name}</h2>
                <p className="text-xs text-white/50 font-bold uppercase tracking-widest mt-0.5">{user.role}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 bg-white/10 rounded-lg backdrop-blur-md">
                   <span className="text-[9px] font-black uppercase tracking-widest text-white/80">{user.department}</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 border-t border-white/10 flex justify-between items-end">
              <div>
                <p className="text-[9px] opacity-40 font-bold uppercase tracking-[0.2em] mb-1.5">Card Identifier</p>
                <p className="font-mono text-base font-black tracking-widest">
                  {user.libraryCard ? user.libraryCard.cardNumber : 'ISSUANCE REQ.'}
                </p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.libraryCard ? 'bg-emerald-400 text-emerald-900 shadow-lg shadow-emerald-400/20' : 'bg-white/10 text-white'}`}>
                  {user.libraryCard ? 'Active' : 'Unissued'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Active Borrowings */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Loans & Deadlines</h2>
              <p className="text-sm text-slate-500 font-medium">Please return resources on or before the due date.</p>
            </div>
            <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-blue-100">
              {activeBorrows.length} Resources
            </span>
          </div>
          
          <div className="space-y-4">
            {activeBorrows.length > 0 ? activeBorrows.map(record => {
              const book = getBook(record.bookId);
              const daysLeft = getDaysDiff(record.dueDate);
              const isOverdue = daysLeft <= 0;
              const isUrgent = daysLeft > 0 && daysLeft <= 3;
              
              // Standard borrow period is 14 days
              const progress = isOverdue ? 100 : Math.min(100, Math.max(0, ((14 - daysLeft) / 14) * 100));

              return (
                <div key={record.id} className={`group bg-white p-6 rounded-[2.5rem] border-2 transition-all flex flex-col gap-6 shadow-sm hover:shadow-2xl ${isOverdue ? 'border-red-50 ring-4 ring-red-50/50' : 'border-slate-50'}`}>
                  <div className="flex gap-6 items-start">
                    <div className="relative shrink-0">
                      <img src={book?.coverUrl} alt={book?.title} className="w-24 h-32 rounded-2xl object-cover shadow-xl group-hover:scale-105 transition-transform duration-500" />
                      {isOverdue && (
                        <div className="absolute -top-3 -left-3 bg-red-600 text-white p-2.5 rounded-2xl shadow-lg animate-bounce ring-4 ring-white">
                          <Icons.Bell />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {isOverdue ? (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                            {Math.abs(daysLeft)} Days Overdue
                          </div>
                        ) : isUrgent ? (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full">
                            Expires in {daysLeft} Days
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full">
                            {daysLeft} Days Remaining
                          </div>
                        )}
                        <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-full border border-slate-200">
                          {book?.category}
                        </span>
                      </div>

                      <h3 className="font-black text-slate-900 truncate text-xl leading-none group-hover:text-blue-700 transition-colors tracking-tight">
                        {book?.title}
                      </h3>
                      
                      <div className="mt-4 flex flex-col gap-1">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Formal Return Date</p>
                        <p className={`text-lg font-black tracking-tight ${isOverdue ? 'text-red-600' : 'text-slate-800'}`}>
                          {formatDate(record.dueDate)}
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={() => onReturn(record.bookId)}
                      className="shrink-0 flex flex-col items-center justify-center gap-2 px-6 py-4 rounded-3xl text-xs font-black uppercase tracking-widest text-white bg-slate-900 hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-slate-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                      Return
                    </button>
                  </div>
                  
                  {/* Progress Visualization */}
                  <div className="pt-4 border-t border-slate-50">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <Icons.Calendar />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Loan Lifecycle</span>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${isOverdue ? 'text-red-600' : 'text-slate-500'}`}>
                        {isOverdue ? 'Term Expired' : `${Math.round(progress)}% Duration Passed`}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden border border-slate-200/50 p-1">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          isOverdue ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]' : 
                          isUrgent ? 'bg-amber-400' : 'bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.3)]'
                        }`} 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="bg-slate-50 border-4 border-dashed border-slate-200 rounded-[3rem] py-24 text-center">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-200 shadow-sm">
                  <Icons.BookOpen />
                </div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Your bookshelf is empty</h3>
                <p className="text-slate-400 font-medium text-sm mt-2 max-w-xs mx-auto">Visit the library catalog to browse and borrow academic materials for your research.</p>
                <Link to="/" className="mt-8 inline-flex items-center gap-3 px-8 py-4 bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-800 transition-all shadow-xl shadow-blue-100">
                  Explore Catalog
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Reservations / Holds */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Holds Queue</h2>
              <p className="text-sm text-slate-500 font-medium">Resources reserved for your upcoming use.</p>
            </div>
          </div>
          <div className="space-y-4">
            {reservations.length > 0 ? reservations.map(res => {
              const book = getBook(res.bookId);
              return (
                <div key={res.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex gap-6 items-center hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shrink-0 border border-blue-100">
                    <Icons.Bell />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-slate-900 truncate text-lg tracking-tight leading-none mb-2">{book?.title}</h3>
                    <div className="flex items-center gap-3">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Pickup Deadline</p>
                      <span className="text-sm font-bold text-slate-800">{new Date(res.expiryDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                  </button>
                </div>
              );
            }) : (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] py-16 text-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300 shadow-sm">
                  <Icons.Bell />
                </div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No pending holds</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* READING HISTORY TIMELINE */}
      <section className="animate-in pt-8 border-t border-slate-100">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 px-2 gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Academic Research History</h2>
            <p className="text-slate-500 mt-2 text-lg font-medium">A chronological record of your scholarly resource usage.</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Records Found</span>
            <span className="font-black text-blue-700 text-xl leading-none">{historyBorrows.length}</span>
          </div>
        </div>
        
        {historyBorrows.length > 0 ? (
          <div className="relative">
            <div className="absolute left-10 md:left-12 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-100 via-slate-100 to-transparent rounded-full"></div>
            
            <div className="space-y-12">
              {historyBorrows.map((record, index) => {
                const book = getBook(record.bookId);
                return (
                  <div key={record.id} className="relative flex gap-8 items-start animate-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="relative z-10 shrink-0 w-20 md:w-24 h-24 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-2xl bg-white border-4 border-blue-50 shadow-lg flex items-center justify-center text-blue-600 ring-4 ring-white">
                         <Icons.Library />
                      </div>
                    </div>

                    <div className="flex-1 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group overflow-hidden">
                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="shrink-0 relative">
                          <img 
                            src={book?.coverUrl} 
                            className="w-28 h-40 rounded-3xl object-cover shadow-2xl border-4 border-white group-hover:rotate-3 transition-transform duration-500" 
                            alt={book?.title} 
                          />
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <span className="px-3 py-1 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-sm">
                                RETURNED SUCCESS
                              </span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ISBN: {book?.isbn}</span>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-700 transition-colors leading-tight tracking-tight">
                              {book?.title}
                            </h3>
                            <p className="text-slate-500 font-bold text-base mt-1 italic">by {book?.author}</p>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8 pt-8 border-t border-slate-50">
                            <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Date Borrowed</p>
                              <p className="text-sm font-bold text-slate-700">{formatDate(record.borrowDate)}</p>
                            </div>
                            <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Date Returned</p>
                              <p className="text-sm font-bold text-emerald-600">{formatDate(record.returnDate!)}</p>
                            </div>
                            <div className="hidden md:block">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Duration</p>
                              <p className="text-sm font-bold text-slate-500">{calculateDuration(record.borrowDate, record.returnDate!)}</p>
                            </div>
                            <div className="flex justify-end items-center">
                              <Link to="/" className="group/btn inline-flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                Renew Interest
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-[3rem] p-24 text-center shadow-sm">
            <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
               <Icons.BookOpen />
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Your scholarly timeline is empty</h3>
            <p className="text-slate-500 mt-3 text-lg max-w-sm mx-auto leading-relaxed font-medium">As you borrow and return academic materials, your research history will be mapped here for your reference.</p>
            <Link to="/" className="mt-12 inline-flex items-center gap-3 px-10 py-5 bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-800 transition-all shadow-2xl shadow-blue-100 active:scale-95">
              Begin Exploration
              <Icons.Search />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
