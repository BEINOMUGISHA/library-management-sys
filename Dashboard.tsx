
import React, { useState, useMemo } from 'react';
import { User, Book, BorrowRecord, Reservation } from './types';
import { Icons, BORROW_LIMITS } from './pages/constants';
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
  const borrowLimit = BORROW_LIMITS[user.role];
  const progressPercent = (activeBorrows.length / borrowLimit) * 100;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getDaysDiff = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    now.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="flex flex-col gap-10 animate-in">
      <div className="flex items-end justify-between border-b border-[rgba(201,168,76,0.18)] pb-6">
        <div>
          <h1 className="font-playfair text-[2.2rem] font-bold leading-none">
            Good morning, <em className="italic text-[#c9a84c]">{user.name.split(' ')[0]}.</em>
          </h1>
          <div className="text-[0.82rem] text-[#f5f0e8]/55 mt-1.5">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })} · Semester II
          </div>
        </div>
        <Link to="/" className="bg-gradient-to-br from-[#c9a84c] to-[#7a6030] text-[#050d1a] px-6 py-3.5 rounded-xl font-medium text-[0.85rem] shadow-[0_4px_20px_rgba(201,168,76,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_28px_rgba(201,168,76,0.45)] transition-all">
          ＋ Borrow a Book
        </Link>
      </div>

      {/* Borrow Limit Indicator */}
      <div className="flex items-center gap-4 p-4 bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.15)] rounded-xl">
        <div className="flex-1">
          <div className="text-[0.72rem] text-[#f5f0e8]/55 tracking-wider uppercase">Borrowing Capacity · {user.role}</div>
          <div className="font-playfair text-[1.4rem] font-bold text-[#c9a84c]">{activeBorrows.length} / {borrowLimit} books</div>
          <div className="h-1 bg-[rgba(245,240,232,0.08)] rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#7a6030] to-[#c9a84c] transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-[0.72rem] text-[#f5f0e8]/55 tracking-wider uppercase mb-1.5">Slots</div>
          <div className="flex gap-1">
            {Array.from({ length: borrowLimit }).map((_, i) => (
              <div key={i} className={`w-[22px] h-[22px] rounded-md border-[1.5px] border-[rgba(201,168,76,0.3)] transition-all ${i < activeBorrows.length ? 'bg-[#c9a84c] border-[#c9a84c]' : ''}`}></div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.18)] rounded-xl p-6 relative overflow-hidden group hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(201,168,76,0.12)] transition-all">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent opacity-60"></div>
          <div className="text-[0.7rem] tracking-widest uppercase text-[#f5f0e8]/55 mb-2">Total Resources</div>
          <div className="font-playfair text-[2.2rem] font-bold text-[#c9a84c]">{books.length}</div>
          <div className="text-[0.72rem] text-[#f5f0e8]/55 mt-1.5">Institutional Catalog</div>
        </div>
        <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.18)] rounded-xl p-6 relative overflow-hidden group hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(201,168,76,0.12)] transition-all">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#4ade80] to-transparent opacity-60"></div>
          <div className="text-[0.7rem] tracking-widest uppercase text-[#f5f0e8]/55 mb-2">Available Now</div>
          <div className="font-playfair text-[2.2rem] font-bold text-[#4ade80]">
            {books.filter(b => b.status === 'AVAILABLE').length}
          </div>
          <div className="text-[0.72rem] text-[#f5f0e8]/55 mt-1.5">Ready for pickup</div>
        </div>
        <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.18)] rounded-xl p-6 relative overflow-hidden group hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(201,168,76,0.12)] transition-all">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#4f6ef7] to-transparent opacity-60"></div>
          <div className="text-[0.7rem] tracking-widest uppercase text-[#f5f0e8]/55 mb-2">Active Loans</div>
          <div className="font-playfair text-[2.2rem] font-bold text-[#4f6ef7]">{activeBorrows.length}</div>
          <div className="text-[0.72rem] text-[#f5f0e8]/55 mt-1.5">Current borrowings</div>
        </div>
        <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.18)] rounded-xl p-6 relative overflow-hidden group hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(201,168,76,0.12)] transition-all">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#f87171] to-transparent opacity-60"></div>
          <div className="text-[0.7rem] tracking-widest uppercase text-[#f5f0e8]/55 mb-2">Reserved</div>
          <div className="font-playfair text-[2.2rem] font-bold text-[#f87171]">{reservations.length}</div>
          <div className="text-[0.72rem] text-[#f5f0e8]/55 mt-1.5">Pending collection</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Active Loans Panel */}
        <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.18)] rounded-2xl p-6">
          <div className="font-playfair text-[1.1rem] font-bold mb-5 flex items-center gap-2.5">
            Active Loans
            <div className="flex-1 h-px bg-gradient-to-r from-[rgba(201,168,76,0.18)] to-transparent"></div>
          </div>
          <div className="flex flex-col gap-4">
            {activeBorrows.length > 0 ? activeBorrows.map(record => {
              const book = getBook(record.bookId);
              const daysLeft = getDaysDiff(record.dueDate);
              return (
                <div key={record.id} className="flex items-center gap-4 p-4 border-b border-[rgba(245,240,232,0.08)] last:border-none">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${daysLeft <= 3 ? 'bg-[#fbbf24]' : 'bg-[#4ade80]'}`}></div>
                  <div className="flex-1">
                    <div className="text-[0.85rem] font-medium">{book?.title}</div>
                    <div className="text-[0.73rem] text-[#f5f0e8]/55 mt-0.5">
                      Borrowed {formatDate(record.borrowDate)} — <span className={daysLeft <= 3 ? 'text-[#fbbf24]' : ''}>Due {formatDate(record.dueDate)}</span>
                    </div>
                  </div>
                  <div className="font-mono text-[0.78rem] text-[#f5f0e8]/55 min-w-[50px] text-right">{daysLeft}d left</div>
                  <button 
                    onClick={() => onReturn(record.bookId)}
                    className="bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.18)] text-[#f5f0e8]/55 hover:text-[#c9a84c] hover:border-[#c9a84c] px-3 py-1.5 rounded-lg text-[0.75rem] transition-all"
                  >
                    Return
                  </button>
                </div>
              );
            }) : (
              <div className="text-center py-10 text-[#f5f0e8]/30 italic text-sm">No active loans found.</div>
            )}
          </div>
        </div>

        {/* Featured Resources */}
        <div className="flex flex-col gap-5">
          <div className="font-playfair text-[1.1rem] font-bold flex items-center gap-2.5">
            Featured Resources
            <div className="flex-1 h-px bg-gradient-to-r from-[rgba(201,168,76,0.18)] to-transparent"></div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {books.slice(0, 2).map(book => (
              <div key={book.id} className="bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.18)] rounded-2xl overflow-hidden group hover:-translate-y-1 hover:border-[rgba(201,168,76,0.35)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all">
                <div className="h-[130px] p-5 flex items-end relative overflow-hidden">
                  <img src={book.coverUrl} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-700" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050d1a] to-transparent"></div>
                  <div className="font-playfair text-[1.1rem] font-bold italic leading-tight relative z-10 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                    {book.title}
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-[0.75rem] text-[#c9a84c] tracking-wider mb-2">{book.author} · {book.publishYear}</div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[0.65rem] tracking-widest uppercase px-2 py-1 rounded border ${book.isDigital ? 'bg-[rgba(79,110,247,0.2)] text-[#4f6ef7] border-[rgba(79,110,247,0.3)]' : 'bg-[rgba(201,168,76,0.15)] text-[#c9a84c] border-[rgba(201,168,76,0.25)]'}`}>
                      {book.resourceType}
                    </span>
                    <span className="text-[0.72rem] text-[#4ade80]">● Available</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
