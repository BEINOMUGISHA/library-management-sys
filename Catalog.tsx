
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Book, BookStatus, User } from './types';
import { Icons } from './pages/constants';

interface CatalogProps {
  user: User;
  books: Book[];
  canBorrowMore: boolean;
  activeBorrowsCount: number;
  borrowLimit: number;
  onBorrow: (bookId: string) => void;
  onReserve: (bookId: string) => void;
}

type SortField = 'title' | 'author' | 'publishYear' | 'course';
type SortOrder = 'asc' | 'desc';

const DEPARTMENTS = [
  'Education',
  'IT',
  'Social Sciences',
  'Business',
  'Journalism',
  'Theology'
];

const COURSES = [
  'Information Technology',
  'Theology & Divinity',
  'Business Administration',
  'Education',
  'Journalism & Media',
  'Social Work',
  'Public Administration'
];

const HighlightMatch: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  if (!query.trim()) return <span>{text}</span>;
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={i} className="text-indigo-600 font-black bg-indigo-50/50 rounded-sm">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

const Catalog: React.FC<CatalogProps> = ({ user, books, canBorrowMore, activeBorrowsCount, borrowLimit, onBorrow, onReserve }) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [academicYearFilter, setAcademicYearFilter] = useState('All');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortField>('title');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(books.map(b => b.category))).sort((a: string, b: string) => a.localeCompare(b));
    return ['All', ...unique];
  }, [books]);

  const years = useMemo(() => ['All', ...Array.from(new Set(books.map(b => b.publishYear.toString()))).sort((a: string, b: string) => b.localeCompare(a))], [books]);
  const academicYears = useMemo(() => {
    const unique = Array.from(new Set(books.map(b => b.academicYear))).sort((a: string, b: string) => a.localeCompare(b));
    return ['All', ...unique];
  }, [books]);

  const statuses = ['All', ...Object.values(BookStatus)];

  const departmentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    DEPARTMENTS.forEach(dept => {
      counts[dept] = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase()) || 
                              book.author.toLowerCase().includes(search.toLowerCase()) ||
                              book.isbn.includes(search);
        const matchesCategory = categoryFilter === 'All' || book.category === categoryFilter;
        return matchesSearch && matchesCategory && book.department === dept;
      }).length;
    });
    return counts;
  }, [books, search, categoryFilter]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDepartment = (dept: string) => {
    setSelectedDepartments(prev => 
      prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]
    );
  };

  const selectAllDepartments = () => setSelectedDepartments([...DEPARTMENTS]);
  const clearAllDepartments = () => setSelectedDepartments([]);

  const toggleCourse = (course: string) => {
    setSelectedCourses(prev => 
      prev.includes(course) ? prev.filter(c => c !== course) : [...prev, course]
    );
  };

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const processedBooks = useMemo(() => {
    let result = books.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase()) || 
                            book.author.toLowerCase().includes(search.toLowerCase()) ||
                            book.isbn.includes(search);
      const matchesCategory = categoryFilter === 'All' || book.category === categoryFilter;
      const matchesStatus = statusFilter === 'All' || book.status === statusFilter;
      const matchesYear = yearFilter === 'All' || book.publishYear.toString() === yearFilter;
      const matchesAcademicYear = academicYearFilter === 'All' || book.academicYear === academicYearFilter;
      const matchesDepartment = selectedDepartments.length === 0 || selectedDepartments.includes(book.department);
      const matchesCourse = selectedCourses.length === 0 || selectedCourses.includes(book.course);
      
      return matchesSearch && matchesCategory && matchesStatus && matchesYear && matchesAcademicYear && matchesDepartment && matchesCourse;
    });

    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'publishYear') {
        comparison = a.publishYear - b.publishYear;
      } else {
        const aVal = a[sortBy] as string;
        const bVal = b[sortBy] as string;
        comparison = aVal.localeCompare(bVal);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [books, search, categoryFilter, statusFilter, yearFilter, academicYearFilter, selectedDepartments, selectedCourses, sortBy, sortOrder]);

  const suggestions = useMemo(() => {
    if (search.length < 2) return [];
    const lowerSearch = search.toLowerCase();
    const matches: { type: 'title' | 'author'; text: string; id: string }[] = [];
    books.forEach(book => {
      if (book.title.toLowerCase().includes(lowerSearch)) {
        matches.push({ type: 'title', text: book.title, id: `t-${book.id}` });
      }
      if (book.author.toLowerCase().includes(lowerSearch)) {
        matches.push({ type: 'author', text: book.author, id: `a-${book.id}` });
      }
    });
    return Array.from(new Map(matches.map(m => [m.text, m])).values()).slice(0, 8);
  }, [search, books]);

  const handleSuggestionClick = (suggestionText: string) => {
    setSearch(suggestionText);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    searchInputRef.current?.blur();
  };

  const getStatusStyle = (status: BookStatus) => {
    switch (status) {
      case BookStatus.AVAILABLE: return 'bg-emerald-50 text-emerald-700 border-emerald-100 ring-2 ring-emerald-500/10';
      case BookStatus.BORROWED: return 'bg-rose-50 text-rose-700 border-rose-100 ring-2 ring-rose-500/10';
      case BookStatus.RESERVED: return 'bg-indigo-50 text-indigo-700 border-indigo-100 ring-2 ring-indigo-500/10';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const hasActiveFilters = search || categoryFilter !== 'All' || statusFilter !== 'All' || yearFilter !== 'All' || academicYearFilter !== 'All' || selectedDepartments.length > 0 || selectedCourses.length > 0;

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-24 animate-in">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Library Catalogue</h1>
            <p className="text-slate-500 mt-3 text-lg font-medium">Search across {books.length} academic titles at Bishop Barham College.</p>
          </div>
          
          <div className="flex items-center gap-4">
            {!canBorrowMore && user.role !== 'ADMIN' && (
              <div className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100 animate-pulse">
                <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                <span className="text-[10px] font-black uppercase tracking-widest">Limit Reached ({activeBorrowsCount}/{borrowLimit})</span>
              </div>
            )}
            
            {hasActiveFilters && (
              <button 
                onClick={() => {
                  setSearch(''); setCategoryFilter('All'); setStatusFilter('All');
                  setYearFilter('All'); setAcademicYearFilter('All'); setSelectedDepartments([]);
                  setSelectedCourses([]); setShowSuggestions(false); setSortBy('title'); setSortOrder('asc');
                }}
                className="flex items-center gap-3 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all bg-white border-2 border-rose-50 rounded-2xl shadow-sm active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                Reset Research Filters
              </button>
            )}
          </div>
        </div>
        
        {/* Institutional Advanced Filters Panel */}
        <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-200 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-4 relative" ref={suggestionRef}>
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <Icons.Search />
              </span>
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Find resources by title, author, or ISBN..."
                className="w-full pl-12 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all outline-none font-bold placeholder:text-slate-400 text-sm"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true); setActiveSuggestionIndex(-1); }}
                onFocus={() => search.length >= 2 && setShowSuggestions(true)}
                autoComplete="off"
              />
              {showSuggestions && search.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden z-[100] animate-in">
                  <div className="p-4 space-y-1">
                    {suggestions.map((item, index) => (
                      <button
                        key={item.id}
                        onClick={() => handleSuggestionClick(item.text)}
                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-left transition-all ${index === activeSuggestionIndex ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${index === activeSuggestionIndex ? 'bg-white shadow-sm' : 'bg-slate-100'}`}>
                          {item.type === 'title' ? <Icons.BookOpen /> : <Icons.User />}
                        </div>
                        <div className="flex-1 truncate">
                          <p className="font-black text-sm tracking-tight"><HighlightMatch text={item.text} query={search} /></p>
                          <p className="text-[9px] uppercase tracking-widest font-black opacity-40 mt-1">{item.type === 'author' ? 'Author Record' : 'Title Match'}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="md:col-span-2 relative">
              <select 
                className={`w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all cursor-pointer text-xs font-black uppercase tracking-widest appearance-none ${categoryFilter !== 'All' ? 'text-indigo-600 border-indigo-100 bg-indigo-50/30' : 'text-slate-500'}`}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'ALL CATEGORIES' : c.toUpperCase()}</option>)}
              </select>
            </div>
            <div className="md:col-span-2 relative">
              <select 
                className={`w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all cursor-pointer text-xs font-black uppercase tracking-widest appearance-none ${statusFilter !== 'All' ? 'text-indigo-600 border-indigo-100 bg-indigo-50/30' : 'text-slate-500'}`}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">ALL STATUSES</option>
                {statuses.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
              </select>
            </div>
            <div className="md:col-span-2 relative">
              <select 
                className={`w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all cursor-pointer text-xs font-black uppercase tracking-widest appearance-none ${academicYearFilter !== 'All' ? 'text-indigo-600 border-indigo-100 bg-indigo-50/30' : 'text-slate-500'}`}
                value={academicYearFilter}
                onChange={(e) => setAcademicYearFilter(e.target.value)}
              >
                <option value="All">CURRICULUM YEAR</option>
                {academicYears.filter(y => y !== 'All').map(y => <option key={y} value={y}>{y.toUpperCase()}</option>)}
              </select>
            </div>
            <div className="md:col-span-2 relative">
              <select 
                className={`w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all cursor-pointer text-xs font-black uppercase tracking-widest appearance-none ${yearFilter !== 'All' ? 'text-indigo-600 border-indigo-100 bg-indigo-50/30' : 'text-slate-500'}`}
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              >
                <option value="All">PUB. YEAR</option>
                {years.filter(y => y !== 'All').map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Institutional Department</p>
              <div className="flex gap-6">
                <button onClick={selectAllDepartments} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Select All</button>
                <button onClick={clearAllDepartments} className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline">Clear</button>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              {DEPARTMENTS.map(dept => {
                const isActive = selectedDepartments.includes(dept);
                return (
                  <button
                    key={dept}
                    onClick={() => toggleDepartment(dept)}
                    className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border-2 ${isActive ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-200' : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-200 shadow-sm'}`}
                  >
                    {dept}
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>{departmentCounts[dept]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Sort Library By</p>
              <div className="flex flex-wrap gap-3">
                {(['title', 'author', 'course', 'publishYear'] as SortField[]).map(field => (
                  <button
                    key={field}
                    onClick={() => handleSort(field)}
                    className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${sortBy === field ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'bg-white border-slate-100 text-slate-400'}`}
                  >
                    {field === 'publishYear' ? 'Year' : field === 'course' ? 'Curriculum' : field}
                    {sortBy === field && (
                      <span className={`inline-block ml-2 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`}>↓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 bg-indigo-50 px-6 py-3 rounded-2xl border border-indigo-100">
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
              <p className="text-xs font-black text-indigo-900 uppercase tracking-widest">{processedBooks.length} Resources Available</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {processedBooks.map((book) => (
          <div key={book.id} className="group bg-white rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 overflow-hidden flex flex-col">
            <div className="aspect-[3/4.2] relative overflow-hidden bg-slate-100 border-b border-slate-100">
              <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute top-5 right-5 flex flex-col gap-2 items-end">
                <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] shadow-lg border-2 ${getStatusStyle(book.status)}`}>
                  {book.status}
                </span>
                <span className="px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest bg-white/95 text-slate-700 shadow-md backdrop-blur-md border-2 border-slate-50">
                  {book.publishYear}
                </span>
              </div>
              <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2">
                <span className="px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-[0.15em] bg-indigo-900 text-white shadow-lg backdrop-blur-md">
                  {book.department}
                </span>
                <span className="px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest bg-white/90 text-indigo-950 shadow-md border border-indigo-100">
                  {book.course}
                </span>
              </div>
            </div>
            
            <div className="p-8 flex-1 flex flex-col">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                   <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em]">{book.category}</span>
                   <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">{book.academicYear}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 line-clamp-2 mt-1 group-hover:text-indigo-700 transition-colors tracking-tighter leading-tight">{book.title}</h3>
                <p className="text-slate-400 font-bold text-sm mt-2 italic">by {book.author}</p>
              </div>
              
              <p className="text-slate-500 text-xs line-clamp-3 mb-8 leading-relaxed flex-1 font-medium opacity-80">
                {book.description}
              </p>
              
              <div className="flex items-center gap-3 mt-auto pt-6 border-t border-slate-50">
                {book.status === BookStatus.AVAILABLE ? (
                  user.libraryCard ? (
                    <button 
                      onClick={() => onBorrow(book.id)} 
                      disabled={!canBorrowMore && user.role !== 'ADMIN'}
                      title={!canBorrowMore ? `Borrowing limit reached (${activeBorrowsCount}/${borrowLimit})` : ''}
                      className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 transform ${
                        (!canBorrowMore && user.role !== 'ADMIN') 
                          ? 'bg-slate-100 text-slate-300 cursor-not-allowed border-2 border-dashed border-slate-200 shadow-none scale-100' 
                          : 'bg-indigo-700 text-white hover:bg-indigo-800 shadow-indigo-100'
                      }`}
                    >
                      {!canBorrowMore && user.role !== 'ADMIN' ? 'Limit Reached' : 'Borrow Book'}
                    </button>
                  ) : (
                    <button disabled className="flex-1 bg-slate-50 text-slate-300 py-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.15em] cursor-not-allowed border-2 border-dashed border-slate-200">
                      ID Card Required
                    </button>
                  )
                ) : book.status === BookStatus.BORROWED ? (
                  user.libraryCard ? (
                    <button onClick={() => onReserve(book.id)} className="flex-1 bg-white text-indigo-700 border-2 border-indigo-700 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all active:scale-95 transform">
                      Reserve Title
                    </button>
                  ) : (
                    <button disabled className="flex-1 bg-slate-50 text-slate-300 py-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.15em] cursor-not-allowed border-2 border-dashed border-slate-200">
                      ID Card Required
                    </button>
                  )
                ) : (
                  <button disabled className="flex-1 bg-slate-100 text-slate-400 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-not-allowed opacity-50">
                    Hold Active
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {processedBooks.length === 0 && (
        <div className="text-center py-32 bg-white rounded-[4rem] border-2 border-slate-100 shadow-2xl animate-in">
          <div className="bg-slate-50 w-28 h-28 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-slate-300 shadow-inner">
            <Icons.Search />
          </div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">No Academic Results</h3>
          <p className="text-slate-500 mt-4 text-xl max-w-lg mx-auto font-medium leading-relaxed">We couldn't find any resources matching your parameters. Please broaden your department or curriculum selection.</p>
          <button 
            onClick={() => {
              setSearch(''); setCategoryFilter('All'); setStatusFilter('All');
              setYearFilter('All'); setAcademicYearFilter('All'); setSelectedDepartments([]);
              setSelectedCourses([]); setSortBy('title'); setSortOrder('asc');
            }}
            className="mt-12 px-12 py-5 bg-indigo-700 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-800 transition-all shadow-2xl shadow-indigo-100 active:scale-95"
          >
            Clear All Search Queries
          </button>
        </div>
      )}
    </div>
  );
};

export default Catalog;
