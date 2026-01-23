
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
    const diffTime = due.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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

            {!user.libraryCard && (
              <div className="absolute inset-0 bg-blue-950/60 backdrop-blur-[4px] flex items-center justify-center p-8 text-center">
                <div className="bg-white p-6 rounded-[2rem] shadow-2xl">
                  <p className="text-slate-800 text-sm font-bold leading-relaxed mb-4">Your digital library card is pending verification.</p>
                  <button className="text-xs font-black text-blue-700 uppercase tracking-widest hover:underline">Contact Desk</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Active Borrowings */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Loans</h2>
              <p className="text-sm text-slate-500 font-medium">Items currently in your possession.</p>
            </div>
            <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-blue-100">
              {activeBorrows.length} Items
            </span>
          </div>
          
          <div className="space-y-4">
            {activeBorrows.length > 0 ? activeBorrows.map(record => {
              const book = getBook(record.bookId);
              const daysLeft = getDaysDiff(record.dueDate);
              const isOverdue = daysLeft <= 0;
              const isUrgent = daysLeft > 0 && daysLeft <= 3;
              
              // Standard borrow period is 14 days for calculations
              const progress = isOverdue ? 100 : Math.min(100, Math.max(0, ((14 - daysLeft) / 14) * 100));

              return (
                <div key={record.id} className="group bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col gap-4">
                  <div className="flex gap-5 items-center">
                    <div className="relative">
                      <img src={book?.coverUrl} alt={book?.title} className="w-20 h-28 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform duration-500" />
                      {isOverdue && (
                        <div className="absolute -top-2 -left-2 bg-red-600 text-white p-1.5 rounded-xl shadow-lg animate-bounce">
                          <Icons.Bell />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{book?.category}</span>
                        {isOverdue ? (
                          <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[8px] font-black uppercase tracking-widest rounded-lg border border-red-200 animate-pulse">
                            OVERDUE
                          </span>
                        ) : isUrgent ? (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-600 text-[8px] font-black uppercase tracking-widest rounded-lg border border-amber-200">
                            DUE SOON
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-widest rounded-lg border border-blue-100">
                            {daysLeft} DAYS LEFT
                          </span>
                        )}
                      </div>
                      <h3 className="font-black text-slate-900 truncate text-lg leading-tight group-hover:text-blue-700 transition-colors">{book?.title}</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Due Date</p>
                      <p className={`text-sm font-bold mt-0.5 ${isOverdue ? 'text-red-600' : 'text-slate-700'}`}>
                        {new Date(record.dueDate).toLocaleDateString(undefined, { 
                          weekday: 'short',
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                    <button 
                      onClick={() => onReturn(record.bookId)}
                      className="shrink-0 px-6 py-3 text-xs font-black uppercase tracking-widest text-white bg-slate-900 rounded-2xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-slate-100"
                    >
                      Return
                    </button>
                  </div>
                  
                  {/* Progress Indicator */}
                  <div className="px-1">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Loan Progress</span>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${isOverdue ? 'text-red-600' : 'text-slate-500'}`}>
                        {isOverdue ? 'Expired' : `${Math.round(progress)}% of term`}
                      </span>
                    </div>
                    <div className="w-full bg-slate-50 h-2.5 rounded-full overflow-hidden border border-slate-100">
                      <div 
                        className={`h-full transition-all duration-1000 ${
                          isOverdue ? 'bg-red-500' : isUrgent ? 'bg-amber-400' : 'bg-blue-600'
                        }`} 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] py-16 text-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <Icons.BookOpen />
                </div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active borrowings found</p>
                <Link to="/" className="mt-4 inline-block text-blue-600 font-black text-xs uppercase tracking-widest hover:underline">Explore Catalog</Link>
              </div>
            )}
          </div>
        </section>

        {/* Reservations */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Holds Queue</h2>
              <p className="text-sm text-slate-500 font-medium">Resources reserved for your use.</p>
            </div>
          </div>
          <div className="space-y-4">
            {reservations.length > 0 ? reservations.map(res => {
              const book = getBook(res.bookId);
              return (
                <div key={res.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex gap-5 items-center hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                    <Icons.Bell />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-slate-900 truncate text-lg tracking-tight">{book?.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Available until</p>
                      <span className="text-xs font-bold text-slate-800">{new Date(res.expiryDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button className="text-slate-300 hover:text-red-500 p-2 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                  </button>
                </div>
              );
            }) : (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] py-16 text-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <Icons.Bell />
                </div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active holds</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* READING HISTORY */}
      <section className="animate-in pt-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 px-2 gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Academic Reading History</h2>
            <p className="text-slate-500 mt-2 text-lg font-medium">A chronological timeline of your resource utilization.</p>
          </div>
          <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completed Sessions</span>
            <span className="font-black text-slate-800">{historyBorrows.length}</span>
          </div>
        </div>
        
        {historyBorrows.length > 0 ? (
          <div className="relative">
            {/* Timeline Vertical Line */}
            <div className="absolute left-10 md:left-12 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-100 via-slate-100 to-transparent rounded-full"></div>
            
            <div className="space-y-10">
              {historyBorrows.map((record, index) => {
                const book = getBook(record.bookId);
                return (
                  <div key={record.id} className="relative flex gap-8 items-start animate-in" style={{ animationDelay: `${index * 100}ms` }}>
                    {/* Timeline Node */}
                    <div className="relative z-10 shrink-0 w-20 md:w-24 h-24 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-2xl bg-white border-4 border-blue-50 shadow-md flex items-center justify-center text-blue-600">
                         <Icons.Library />
                      </div>
                    </div>

                    {/* Record Card */}
                    <div className="flex-1 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden">
                      <div className="flex flex-col md:flex-row gap-8">
                        {/* Book Thumbnail */}
                        <div className="shrink-0">
                          <img 
                            src={book?.coverUrl} 
                            className="w-24 h-32 rounded-2xl object-cover shadow-lg border border-slate-50 group-hover:rotate-2 transition-transform duration-500" 
                            alt={book?.title} 
                          />
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-emerald-100">
                                COMPLETED
                              </span>
                              <span className="px-2 py-0.5 bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-lg border border-slate-100">
                                {book?.isbn}
                              </span>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-700 transition-colors leading-tight">
                              {book?.title}
                            </h3>
                            <p className="text-slate-500 font-bold text-sm mt-1">{book?.author}</p>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 pt-6 border-t border-slate-50">
                            <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Borrowed</p>
                              <p className="text-xs font-bold text-slate-700">{new Date(record.borrowDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                            <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Returned</p>
                              <p className="text-xs font-bold text-emerald-600">{new Date(record.returnDate!).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                            <div className="hidden md:block">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Duration</p>
                              <p className="text-xs font-bold text-slate-500 italic">{calculateDuration(record.borrowDate, record.returnDate!)}</p>
                            </div>
                            <div className="flex justify-end items-center">
                              <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:translate-x-1 transition-transform">
                                Borrow Again
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
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
          <div className="bg-white border border-slate-100 rounded-[3rem] p-20 text-center shadow-sm">
            <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
               <Icons.BookOpen />
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Your History is Empty</h3>
            <p className="text-slate-500 mt-2 text-lg max-w-sm mx-auto leading-relaxed font-medium">Once you return borrowed academic resources, they will appear here as part of your research record.</p>
            <Link to="/" className="mt-10 inline-flex items-center gap-2 px-8 py-4 bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-800 transition-all shadow-xl shadow-blue-100 active:scale-95">
              Explore Library Catalog
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
