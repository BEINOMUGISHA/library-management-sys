
import React, { useState, useMemo } from 'react';
import { Book, BookStatus } from '../types';
import { Icons } from '../constants';

interface CatalogProps {
  books: Book[];
  onBorrow: (bookId: string) => void;
  onReserve: (bookId: string) => void;
}

type SortField = 'title' | 'author' | 'publishYear';
type SortOrder = 'asc' | 'desc';

const Catalog: React.FC<CatalogProps> = ({ books, onBorrow, onReserve }) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [sortBy, setSortBy] = useState<SortField>('title');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const categories = useMemo(() => ['All', ...Array.from(new Set(books.map(b => b.category)))], [books]);
  // Fix: Explicitly type sort parameters to avoid 'unknown' type error in Array.from().sort()
  const years = useMemo(() => ['All', ...Array.from(new Set(books.map(b => b.publishYear.toString()))).sort((a: string, b: string) => b.localeCompare(a))], [books]);
  const statuses = ['All', ...Object.values(BookStatus)];

  const processedBooks = useMemo(() => {
    let result = books.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase()) || 
                            book.author.toLowerCase().includes(search.toLowerCase()) ||
                            book.isbn.includes(search);
      const matchesCategory = categoryFilter === 'All' || book.category === categoryFilter;
      const matchesStatus = statusFilter === 'All' || book.status === statusFilter;
      const matchesYear = yearFilter === 'All' || book.publishYear.toString() === yearFilter;
      
      return matchesSearch && matchesCategory && matchesStatus && matchesYear;
    });

    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'publishYear') {
        comparison = a.publishYear - b.publishYear;
      } else {
        comparison = a[sortBy].localeCompare(b[sortBy]);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [books, search, categoryFilter, statusFilter, yearFilter, sortBy, sortOrder]);

  const getStatusColor = (status: BookStatus) => {
    switch (status) {
      case BookStatus.AVAILABLE: return 'bg-emerald-100 text-emerald-700';
      case BookStatus.BORROWED: return 'bg-amber-100 text-amber-700';
      case BookStatus.RESERVED: return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const toggleSortOrder = () => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Library Catalog</h1>
          <p className="text-slate-500 mt-2 text-lg">Bishop Barham University College Academic Resources</p>
        </div>
        
        {/* Search and Primary Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Icons.Search />
            </span>
            <input 
              type="text" 
              placeholder="Search by title, author, or ISBN..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <select 
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all cursor-pointer text-sm font-medium"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option disabled>Category</option>
              {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <select 
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all cursor-pointer text-sm font-medium"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option disabled>Status</option>
              {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <select 
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all cursor-pointer text-sm font-medium"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            >
              <option disabled>Year</option>
              {years.map(y => <option key={y} value={y}>{y === 'All' ? 'All Years' : y}</option>)}
            </select>
          </div>
          <div className="md:col-span-1 flex justify-center items-center">
             <button 
              onClick={() => {
                setSearch('');
                setCategoryFilter('All');
                setStatusFilter('All');
                setYearFilter('All');
              }}
              className="text-slate-400 hover:text-red-500 transition-colors p-2"
              title="Reset Filters"
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
             </button>
          </div>
        </div>

        {/* Sorting Controls */}
        <div className="flex items-center gap-4 text-sm text-slate-500 bg-white p-3 rounded-2xl border border-slate-100 w-fit shadow-sm">
          <span className="font-semibold text-slate-400 pl-2">Sort by:</span>
          <div className="flex items-center gap-2">
            {(['title', 'author', 'publishYear'] as SortField[]).map(field => (
              <button
                key={field}
                onClick={() => {
                  if (sortBy === field) {
                    toggleSortOrder();
                  } else {
                    setSortBy(field);
                    setSortOrder('asc');
                  }
                }}
                className={`px-3 py-1.5 rounded-xl transition-all font-medium ${
                  sortBy === field 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                    : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                {field.charAt(0).toUpperCase() + field.slice(1).replace('Year', ' Year')}
                {sortBy === field && (
                  <span className="ml-1 inline-block transform transition-transform">
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {processedBooks.map((book) => (
          <div key={book.id} className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
            <div className="aspect-[3/4] relative overflow-hidden bg-slate-100">
              <img 
                src={book.coverUrl} 
                alt={book.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${getStatusColor(book.status)}`}>
                  {book.status}
                </span>
                <span className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 text-slate-600 shadow-sm backdrop-blur-sm">
                  {book.publishYear}
                </span>
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="mb-4">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">{book.category}</span>
                <h3 className="text-xl font-bold text-slate-900 line-clamp-1 mt-1">{book.title}</h3>
                <p className="text-slate-500 font-medium">{book.author}</p>
              </div>
              
              <p className="text-slate-600 text-sm line-clamp-2 mb-6 leading-relaxed flex-1">
                {book.description}
              </p>
              
              <div className="flex items-center gap-2 mt-auto">
                {book.status === BookStatus.AVAILABLE ? (
                  <button 
                    onClick={() => onBorrow(book.id)}
                    className="flex-1 bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors shadow-sm active:scale-95 transform"
                  >
                    Borrow Now
                  </button>
                ) : book.status === BookStatus.BORROWED ? (
                  <button 
                    onClick={() => onReserve(book.id)}
                    className="flex-1 bg-white text-blue-700 border-2 border-blue-700 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors active:scale-95 transform"
                  >
                    Place Hold
                  </button>
                ) : (
                  <button 
                    disabled
                    className="flex-1 bg-slate-100 text-slate-400 py-3 rounded-xl font-semibold cursor-not-allowed"
                  >
                    Reserved
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {processedBooks.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
            <Icons.Search />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight">No resources found</h3>
          <p className="text-slate-500 mt-3 text-lg max-w-md mx-auto">Try adjusting your search criteria or reset the filters to see more academic materials.</p>
          <button 
            onClick={() => {
              setSearch('');
              setCategoryFilter('All');
              setStatusFilter('All');
              setYearFilter('All');
            }}
            className="mt-8 text-blue-700 font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Catalog;
