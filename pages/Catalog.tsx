
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Book, BookStatus, User } from '../types';
import { Icons } from './constants';

interface CatalogProps {
  // Added user prop to resolve type error in App.tsx
  user: User;
  books: Book[];
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

/**
 * Helper component to highlight matching text in suggestions
 */
const HighlightMatch: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  if (!query.trim()) return <span>{text}</span>;
  
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={i} className="text-blue-600 font-black bg-blue-50/50 rounded-sm">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

// Added user to destructuring
const Catalog: React.FC<CatalogProps> = ({ user, books, onBorrow, onReserve }) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [academicYearFilter, setAcademicYearFilter] = useState('All');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortField>('title');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Autocomplete state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Dynamic category extraction with sorting
  const categories = useMemo(() => {
    // Explicitly type sort parameters to avoid 'unknown' type error in Array.from().sort()
    const unique = Array.from(new Set(books.map(b => b.category))).sort((a: string, b: string) => a.localeCompare(b));
    return ['All', ...unique];
  }, [books]);

  // Explicitly type sort parameters to avoid 'unknown' type error in Array.from().sort()
  const years = useMemo(() => ['All', ...Array.from(new Set(books.map(b => b.publishYear.toString()))).sort((a: string, b: string) => b.localeCompare(a))], [books]);
  
  // Dynamic Academic Year extraction
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
      prev.includes(dept) 
        ? prev.filter(d => d !== dept) 
        : [...prev, dept]
    );
  };

  const selectAllDepartments = () => setSelectedDepartments([...DEPARTMENTS]);
  const clearAllDepartments = () => setSelectedDepartments([]);

  const toggleCourse = (course: string) => {
    setSelectedCourses(prev => 
      prev.includes(course) 
        ? prev.filter(c => c !== course) 
        : [...prev, course]
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
        // Use explicit index access with cast to string to handle 'unknown' type
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

    const unique = Array.from(new Map(matches.map(m => [m.text, m])).values());
    return unique.slice(0, 8);
  }, [search, books]);

  const handleSuggestionClick = (suggestionText: string) => {
    setSearch(suggestionText);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    searchInputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
      e.preventDefault();
      setActiveSuggestionIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
      e.preventDefault();
      setActiveSuggestionIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      if (activeSuggestionIndex >= 0) {
        handleSuggestionClick(suggestions[activeSuggestionIndex].text);
      } else {
        setShowSuggestions(false);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const getStatusColor = (status: BookStatus) => {
    switch (status) {
      case BookStatus.AVAILABLE: return 'bg-emerald-100 text-emerald-700';
      case BookStatus.BORROWED: return 'bg-amber-100 text-amber-700';
      case BookStatus.RESERVED: return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const hasActiveFilters = search || categoryFilter !== 'All' || statusFilter !== 'All' || yearFilter !== 'All' || academicYearFilter !== 'All' || selectedDepartments.length > 0 || selectedCourses.length > 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Library Catalog</h1>
            <p className="text-slate-500 mt-2 text-lg font-medium">Bishop Barham University College Academic Resources</p>
          </div>
          
          {hasActiveFilters && (
            <button 
              onClick={() => {
                setSearch('');
                setCategoryFilter('All');
                setStatusFilter('All');
                setYearFilter('All');
                setAcademicYearFilter('All');
                setSelectedDepartments([]);
                setSelectedCourses([]);
                setShowSuggestions(false);
                setSortBy('title');
                setSortOrder('asc');
              }}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all bg-white border-2 border-red-50 rounded-2xl animate-in"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              Reset Filters
            </button>
          )}
        </div>
        
        {/* Advanced Filters Panel */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8">
          {/* Main Search Row - Adjusted grid layout to accommodate 5 elements */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4 relative" ref={suggestionRef}>
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Icons.Search />
              </span>
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Find resources by title, author, or ISBN..."
                className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 transition-all outline-none font-medium placeholder:text-slate-400 text-sm"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSuggestions(true);
                  setActiveSuggestionIndex(-1);
                }}
                onFocus={() => search.length >= 2 && setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
              />

              {showSuggestions && search.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden z-[100] animate-in slide-in-from-top-2 duration-300">
                  <div className="p-3">
                    {suggestions.length > 0 ? suggestions.map((item, index) => (
                      <button
                        key={item.id}
                        onClick={() => handleSuggestionClick(item.text)}
                        onMouseEnter={() => setActiveSuggestionIndex(index)}
                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all ${
                          index === activeSuggestionIndex ? 'bg-blue-50 text-blue-700 translate-x-1' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          index === activeSuggestionIndex ? 'bg-white shadow-sm text-blue-600' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {item.type === 'title' ? <Icons.BookOpen /> : <Icons.User />}
                        </span>
                        <div className="flex-1 truncate">
                          <p className="font-bold text-sm tracking-tight truncate">
                            <HighlightMatch text={item.text} query={search} />
                          </p>
                          <p className="text-[10px] uppercase tracking-[0.15em] font-black opacity-40 mt-0.5">
                            {item.type === 'author' ? 'Author Record' : 'Catalogue Title'}
                          </p>
                        </div>
                        <div className={`transition-opacity ${index === activeSuggestionIndex ? 'opacity-100' : 'opacity-0'}`}>
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </div>
                      </button>
                    )) : (
                      <div className="px-5 py-8 text-center">
                        <p className="text-sm font-bold text-slate-400">No instant matches for "{search}"</p>
                        <p className="text-xs text-slate-300 mt-1 uppercase tracking-widest font-black">Press Enter to broad search</p>
                      </div>
                    )}
                  </div>
                  {suggestions.length > 0 && (
                    <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between items-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Navigation Tips</p>
                      <div className="flex gap-2">
                        <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-500">TAB</span>
                        <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-500">↑↓</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Category Dropdown */}
            <div className="md:col-span-2 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
              </span>
              <select 
                className={`w-full pl-10 pr-4 py-4 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all cursor-pointer text-xs font-bold appearance-none ${categoryFilter !== 'All' ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-600'}`}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </span>
              <select 
                className={`w-full pl-10 pr-4 py-4 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all cursor-pointer text-xs font-bold appearance-none ${statusFilter !== 'All' ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-600'}`}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                {statuses.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Academic Year Dropdown */}
            <div className="md:col-span-2 relative">
               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
                <Icons.GraduationCap />
              </span>
              <select 
                className={`w-full pl-10 pr-4 py-4 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all cursor-pointer text-xs font-bold appearance-none ${academicYearFilter !== 'All' ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-600'}`}
                value={academicYearFilter}
                onChange={(e) => setAcademicYearFilter(e.target.value)}
              >
                <option value="All">Academic Year</option>
                {academicYears.filter(y => y !== 'All').map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            <div className="md:col-span-2 relative">
               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
                <Icons.Calendar />
              </span>
              <select 
                className={`w-full pl-10 pr-4 py-4 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all cursor-pointer text-xs font-bold appearance-none ${yearFilter !== 'All' ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-600'}`}
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              >
                <option value="All">Pub. Year</option>
                {years.filter(y => y !== 'All').map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          {/* Academic Department Multi-select */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Department</p>
              <div className="flex items-center gap-4">
                <button 
                  onClick={selectAllDepartments}
                  className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-wider transition-colors"
                >
                  Select All
                </button>
                <button 
                  onClick={clearAllDepartments}
                  className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-wider transition-colors"
                >
                  Clear Selection
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {DEPARTMENTS.map(dept => {
                const isActive = selectedDepartments.includes(dept);
                const count = departmentCounts[dept];
                return (
                  <button
                    key={dept}
                    onClick={() => toggleDepartment(dept)}
                    className={`group relative flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-bold transition-all border-2 ${
                      isActive
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-100 ring-2 ring-blue-600 ring-offset-2'
                        : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200 hover:text-blue-600 shadow-sm'
                    }`}
                  >
                    {dept}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black transition-colors ${
                      isActive ? 'bg-white text-blue-700' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Academic Course Multi-select */}
          <div className="space-y-4 pt-6 border-t border-slate-50">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Specific Course Curriculum</p>
            <div className="flex flex-wrap gap-2">
              {COURSES.map(course => (
                <button
                  key={course}
                  onClick={() => toggleCourse(course)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border-2 ${
                    selectedCourses.includes(course)
                      ? 'bg-blue-700 border-blue-700 text-white shadow-lg'
                      : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200 hover:text-blue-600'
                  }`}
                >
                  {course}
                </button>
              ))}
            </div>
          </div>

          {/* Sorting Controls */}
          <div className="pt-6 border-t border-slate-50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 whitespace-nowrap">Sort Order</p>
                <div className="flex flex-wrap gap-2">
                  {(['title', 'author', 'course', 'publishYear'] as SortField[]).map(field => (
                    <button
                      key={field}
                      onClick={() => handleSort(field)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all border-2 ${
                        sortBy === field
                          ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm'
                          : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:text-slate-600'
                      }`}
                    >
                      {field === 'publishYear' ? 'Publication Year' : field === 'course' ? 'Course Curriculum' : field.charAt(0).toUpperCase() + field.slice(1)}
                      {sortBy === field && (
                        <span className={`transition-transform duration-300 ${sortOrder === 'desc' ? 'rotate-180' : ''}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {processedBooks.length} Resources Active
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {processedBooks.map((book) => (
          <div key={book.id} className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col">
            <div className="aspect-[3/4] relative overflow-hidden bg-slate-50">
              <img 
                src={book.coverUrl} 
                alt={book.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${getStatusColor(book.status)}`}>
                  {book.status}
                </span>
                <span className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-slate-600 shadow-sm backdrop-blur-sm">
                  {book.publishYear}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 flex flex-col gap-1">
                <span className="px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-blue-700 text-white shadow-lg w-fit">
                  {book.department}
                </span>
                <span className="px-3 py-1 bg-white/90 text-blue-700 backdrop-blur-sm rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm w-fit border border-blue-50">
                  {book.course}
                </span>
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="mb-4">
                <div className="flex justify-between items-start">
                   <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{book.category}</span>
                   <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">{book.academicYear}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 line-clamp-1 mt-1 group-hover:text-blue-700 transition-colors tracking-tight">{book.title}</h3>
                <p className="text-slate-500 font-medium">by {book.author}</p>
              </div>
              
              <p className="text-slate-600 text-sm line-clamp-2 mb-6 leading-relaxed flex-1 opacity-80 group-hover:opacity-100 transition-opacity font-medium">
                {book.description}
              </p>
              
              <div className="flex items-center gap-2 mt-auto">
                {book.status === BookStatus.AVAILABLE ? (
                  // Implementing library card validation as required by the UI state
                  user.libraryCard ? (
                    <button 
                      onClick={() => onBorrow(book.id)}
                      className="flex-1 bg-blue-700 text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-800 transition-all shadow-lg shadow-blue-100 active:scale-95 transform"
                    >
                      Borrow
                    </button>
                  ) : (
                    <button 
                      disabled
                      title="Bishop Barham Library Card Required"
                      className="flex-1 bg-slate-100 text-slate-400 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-not-allowed border-2 border-dashed border-slate-200"
                    >
                      Card Required
                    </button>
                  )
                ) : book.status === BookStatus.BORROWED ? (
                  // Implementing library card validation for reservation
                  user.libraryCard ? (
                    <button 
                      onClick={() => onReserve(book.id)}
                      className="flex-1 bg-white text-blue-700 border-2 border-blue-700 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition-all active:scale-95 transform"
                    >
                      Reserve
                    </button>
                  ) : (
                    <button 
                      disabled
                      title="Bishop Barham Library Card Required"
                      className="flex-1 bg-slate-100 text-slate-400 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-not-allowed border-2 border-dashed border-slate-200"
                    >
                      Card Required
                    </button>
                  )
                ) : (
                  <button 
                    disabled
                    className="flex-1 bg-slate-100 text-slate-400 py-3 rounded-2xl text-xs font-black uppercase tracking-widest cursor-not-allowed"
                  >
                    Hold Active
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {processedBooks.length === 0 && (
        <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-100 shadow-sm animate-in">
          <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
            <Icons.Search />
          </div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">No Results Found</h3>
          <p className="text-slate-500 mt-3 text-lg max-w-md mx-auto font-medium">We couldn't find any resources matching your current search criteria. Try broadening your filters.</p>
          <button 
            onClick={() => {
              setSearch('');
              setCategoryFilter('All');
              setStatusFilter('All');
              setYearFilter('All');
              setAcademicYearFilter('All');
              setSelectedDepartments([]);
              setSelectedCourses([]);
              setShowSuggestions(false);
              setSortBy('title');
              setSortOrder('asc');
            }}
            className="mt-8 px-10 py-4 bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-800 transition-all shadow-xl shadow-blue-100 active:scale-95"
          >
            Clear Search & Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Catalog;
