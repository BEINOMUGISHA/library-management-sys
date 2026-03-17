
import React, { useState, useMemo, useEffect } from 'react';
import { User, Book, BorrowRecord, Reservation } from './types';
import { Icons, BORROW_LIMITS } from './pages/constants';
import { libraryService } from './services/libraryService';
import { searchService } from './services/searchService';
import { Link } from 'react-router-dom';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface DashboardProps {
  user: User;
  books: Book[];
  records: BorrowRecord[];
  reservations: Reservation[];
  onReturn: (bookId: string) => void;
  onRenew: (recordId: string, dueDate: string, renewalCount: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, books, records, reservations, onReturn, onRenew }) => {
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [isRecLoading, setIsRecLoading] = useState(false);

  const getBook = (id: string) => books.find(b => b.id === id);
  const activeBorrows = records.filter(r => !r.returnDate);
  const borrowLimit = BORROW_LIMITS[user.role];
  const progressPercent = (activeBorrows.length / borrowLimit) * 100;

  useEffect(() => {
    const fetchRecs = async () => {
      if (books.length === 0) return;
      setIsRecLoading(true);
      const userHistory = records.map(r => r.bookId);
      const recs = await searchService.getRecommendations(userHistory, user.department || 'General', books);
      setRecommendations(recs);
      setIsRecLoading(false);
    };
    fetchRecs();
  }, [user.id, books.length]); // Only fetch when books are loaded or user changes

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

  // Analytics Data: Last 7 days borrowing activity
  const chartData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dayName = days[d.getDay()];
      const count = records.filter(r => {
        const borrowDate = new Date(r.borrowDate);
        return borrowDate.toDateString() === d.toDateString();
      }).length;
      
      data.push({ name: dayName, count });
    }
    return data;
  }, [records]);

  return (
    <div className="flex flex-col gap-10 animate-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[rgba(201,168,76,0.18)] pb-6 gap-4">
        <div>
          <h1 className="font-playfair text-[2.2rem] font-bold leading-none">
            Good morning, <em className="italic text-[#c9a84c]">{user.name.split(' ')[0]}.</em>
          </h1>
          <div className="text-[0.82rem] text-[#f5f0e8]/55 mt-1.5">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })} · Semester II
          </div>
        </div>
        <Link to="/" className="bg-gradient-to-br from-[#c9a84c] to-[#7a6030] text-[#050d1a] px-6 py-3.5 rounded-xl font-medium text-[0.85rem] shadow-[0_4px_20px_rgba(201,168,76,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_28px_rgba(201,168,76,0.45)] transition-all text-center">
          ＋ Borrow a Book
        </Link>
      </div>

      {/* Analytics & Stats Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Activity Chart */}
        <div className="xl:col-span-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.18)] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="font-playfair text-[1.1rem] font-bold">Borrowing Activity</div>
            <div className="text-[0.65rem] text-[#c9a84c] uppercase tracking-widest">Last 7 Days</div>
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#c9a84c" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(245,240,232,0.05)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(245,240,232,0.4)', fontSize: 10 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#050d1a', 
                    border: '1px solid rgba(201,168,76,0.2)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#c9a84c' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#c9a84c" 
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats Column */}
        <div className="flex flex-col gap-5">
          <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.18)] rounded-xl p-5 relative overflow-hidden group hover:-translate-y-1 transition-all">
            <div className="text-[0.65rem] tracking-widest uppercase text-[#f5f0e8]/55 mb-1">Total Resources</div>
            <div className="font-playfair text-[1.8rem] font-bold text-[#c9a84c]">{books.length}</div>
          </div>
          <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.18)] rounded-xl p-5 relative overflow-hidden group hover:-translate-y-1 transition-all">
            <div className="text-[0.65rem] tracking-widest uppercase text-[#f5f0e8]/55 mb-1">Available Now</div>
            <div className="font-playfair text-[1.8rem] font-bold text-[#4ade80]">
              {books.filter(b => b.status === 'AVAILABLE').length}
            </div>
          </div>
          <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.18)] rounded-xl p-5 relative overflow-hidden group hover:-translate-y-1 transition-all">
            <div className="text-[0.65rem] tracking-widest uppercase text-[#f5f0e8]/55 mb-1">Active Loans</div>
            <div className="font-playfair text-[1.8rem] font-bold text-[#4f6ef7]">{activeBorrows.length}</div>
          </div>
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
              const fine = libraryService.calculateFine(record.dueDate, record.returnDate);
              
              return (
                <div key={record.id} className="flex items-center gap-4 p-4 border-b border-[rgba(245,240,232,0.08)] last:border-none">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${daysLeft <= 0 ? 'bg-rose-500' : daysLeft <= 3 ? 'bg-[#fbbf24]' : 'bg-[#4ade80]'}`}></div>
                  <div className="flex-1">
                    <div className="text-[0.85rem] font-medium flex items-center gap-2">
                      {book?.title}
                      {fine > 0 && (
                        <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 text-[0.65rem] rounded-md border border-rose-500/20">
                          Fine: {fine.toLocaleString()} UGX
                        </span>
                      )}
                    </div>
                    <div className="text-[0.73rem] text-[#f5f0e8]/55 mt-0.5">
                      Borrowed {formatDate(record.borrowDate)} — <span className={daysLeft <= 0 ? 'text-rose-400 font-bold' : daysLeft <= 3 ? 'text-[#fbbf24]' : ''}>
                        {daysLeft <= 0 ? 'OVERDUE' : 'Due'} {formatDate(record.dueDate)}
                      </span>
                      <span className="ml-2 opacity-40">({record.renewalCount || 0}/2 Renewals)</span>
                    </div>
                  </div>
                  <div className="font-mono text-[0.78rem] text-[#f5f0e8]/55 min-w-[50px] text-right">
                    {daysLeft <= 0 ? `${Math.abs(daysLeft)}d late` : `${daysLeft}d left`}
                  </div>
                  <div className="flex gap-2">
                    {daysLeft > 0 && (record.renewalCount || 0) < 2 && (
                      <button 
                        onClick={() => onRenew(record.id, record.dueDate, record.renewalCount || 0)}
                        className="bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.3)] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#050d1a] px-3 py-1.5 rounded-lg text-[0.75rem] transition-all"
                      >
                        Renew
                      </button>
                    )}
                    <button 
                      onClick={() => onReturn(record.bookId)}
                      className="bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.18)] text-[#f5f0e8]/55 hover:text-[#c9a84c] hover:border-[#c9a84c] px-3 py-1.5 rounded-lg text-[0.75rem] transition-all"
                    >
                      Return
                    </button>
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-10 text-[#f5f0e8]/30 italic text-sm">No active loans found.</div>
            )}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="flex flex-col gap-5">
          <div className="font-playfair text-[1.1rem] font-bold flex items-center gap-2.5">
            AI Recommendations
            <div className="flex-1 h-px bg-gradient-to-r from-[rgba(201,168,76,0.18)] to-transparent"></div>
            <span className="text-[0.6rem] text-[#c9a84c] uppercase tracking-widest animate-pulse">Smart Suggest</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {isRecLoading ? (
              <div className="col-span-2 py-10 text-center text-[#f5f0e8]/30 animate-pulse">Analyzing your reading patterns...</div>
            ) : recommendations.length > 0 ? recommendations.map(book => (
              <div key={book.id} className="bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.18)] rounded-2xl overflow-hidden group hover:-translate-y-1 hover:border-[rgba(201,168,76,0.35)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all">
                <div className="h-[130px] p-5 flex items-end relative overflow-hidden">
                  <img src={book.coverUrl} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-700" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050d1a] to-transparent"></div>
                  <div className="font-playfair text-[1.1rem] font-bold italic leading-tight relative z-10 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                    {book.title}
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-[0.75rem] text-[#c9a84c] tracking-wider mb-2">{book.author} · {book.category}</div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[0.65rem] tracking-widest uppercase px-2 py-1 rounded border ${book.isDigital ? 'bg-[rgba(79,110,247,0.2)] text-[#4f6ef7] border-[rgba(79,110,247,0.3)]' : 'bg-[rgba(201,168,76,0.15)] text-[#c9a84c] border-[rgba(201,168,76,0.25)]'}`}>
                      {book.resourceType}
                    </span>
                    <Link to="/" className="text-[0.72rem] text-[#c9a84c] hover:underline">View Details →</Link>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-2 py-10 text-center text-[#f5f0e8]/30 italic text-sm">No recommendations yet. Start borrowing to see suggestions!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
