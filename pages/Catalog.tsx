
import React, { useState, useMemo } from 'react';
import { Book, User, ResourceType } from '../types';
import { Icons } from './constants';

interface CatalogProps {
  user: User;
  books: Book[];
  canBorrowMore: boolean;
  activeBorrowsCount: number;
  borrowLimit: number;
  onBorrow: (bookId: string) => void;
  onReserve: (bookId: string) => void;
}

const Catalog: React.FC<CatalogProps> = ({ user, books, canBorrowMore, activeBorrowsCount, borrowLimit, onBorrow, onReserve }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ResourceType | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = useMemo(() => {
    const cats = new Set(books.map(b => b.category));
    return ['ALL', ...Array.from(cats)];
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch = 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.isbn.includes(searchQuery);
      
      const matchesType = selectedType === 'ALL' || book.resourceType === selectedType;
      const matchesCategory = selectedCategory === 'ALL' || book.category === selectedCategory;

      return matchesSearch && matchesType && matchesCategory;
    });
  }, [books, searchQuery, selectedType, selectedCategory]);

  return (
    <div className="flex flex-col gap-10 animate-in">
      {/* Header & Search */}
      <div className="flex flex-col gap-8">
        <div className="flex items-end justify-between border-b border-[rgba(201,168,76,0.18)] pb-6">
          <div>
            <h1 className="font-playfair text-[2.2rem] font-bold leading-none">
              Digital <em className="italic text-[#c9a84c]">Catalog.</em>
            </h1>
            <div className="text-[0.82rem] text-[#f5f0e8]/55 mt-1.5">
              Explore {books.length} academic resources across all departments
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-[0.72rem] text-[#f5f0e8]/55 tracking-widest uppercase">Sort By</div>
            <select className="bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.18)] text-[#f5f0e8] text-[0.8rem] px-4 py-2 rounded-lg outline-none focus:border-[#c9a84c] transition-all">
              <option>Newest First</option>
              <option>Alphabetical</option>
              <option>Most Popular</option>
            </select>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-6 flex items-center text-[#c9a84c] text-xl">🔍</div>
          <input 
            type="text"
            placeholder="Search by Title, Author, or ISBN..."
            className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.18)] rounded-2xl py-6 pl-16 pr-8 text-[1.1rem] text-[#f5f0e8] placeholder-[#f5f0e8]/25 outline-none focus:border-[#c9a84c] focus:bg-[rgba(201,168,76,0.05)] transition-all shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-6 flex items-center gap-2">
            <span className="text-[0.65rem] text-[#f5f0e8]/25 tracking-widest uppercase border border-[rgba(245,240,232,0.1)] px-2 py-1 rounded">⌘ K</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-[0.72rem] text-[#f5f0e8]/55 tracking-widest uppercase mr-2">Filter By</div>
          {['ALL', 'PHYSICAL', 'EBOOK', 'JOURNAL', 'THESIS'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type as any)}
              className={`px-5 py-2 rounded-full text-[0.78rem] tracking-wider transition-all border ${
                selectedType === type 
                  ? 'bg-[#c9a84c] border-[#c9a84c] text-[#050d1a] font-medium shadow-[0_4px_15px_rgba(201,168,76,0.3)]' 
                  : 'bg-[rgba(255,255,255,0.04)] border-[rgba(201,168,76,0.18)] text-[#f5f0e8]/55 hover:border-[#c9a84c] hover:text-[#f5f0e8]'
              }`}
            >
              {type}
            </button>
          ))}
          <div className="w-px h-6 bg-[rgba(201,168,76,0.18)] mx-2"></div>
          <select 
            className="bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.18)] text-[#f5f0e8]/55 text-[0.78rem] px-5 py-2 rounded-full outline-none hover:border-[#c9a84c] transition-all"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredBooks.map((book, index) => (
          <div 
            key={book.id} 
            className="group bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.18)] rounded-2xl overflow-hidden flex flex-col hover:-translate-y-2 hover:border-[rgba(201,168,76,0.35)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all duration-500 animate-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="h-[240px] relative overflow-hidden">
              <img 
                src={book.coverUrl} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                alt={book.title} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050d1a] via-transparent to-transparent opacity-60"></div>
              
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-[0.65rem] font-bold tracking-widest uppercase border ${
                  book.status === 'AVAILABLE' 
                    ? 'bg-[rgba(74,222,128,0.15)] text-[#4ade80] border-[rgba(74,222,128,0.25)]' 
                    : 'bg-[rgba(248,113,113,0.15)] text-[#f87171] border-[rgba(248,113,113,0.25)]'
                }`}>
                  {book.status}
                </span>
              </div>

              {/* Resource Type Icon */}
              <div className="absolute bottom-4 left-4 w-10 h-10 bg-[rgba(5,13,26,0.6)] backdrop-blur-md rounded-xl border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-lg">
                {book.resourceType === 'EBOOK' ? '💻' : book.resourceType === 'JOURNAL' ? '📄' : '📕'}
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <div className="text-[0.7rem] text-[#c9a84c] tracking-[0.15em] uppercase font-medium mb-1.5">{book.category}</div>
              <h3 className="font-playfair text-[1.2rem] font-bold leading-tight mb-2 group-hover:text-[#c9a84c] transition-colors">{book.title}</h3>
              <p className="text-[0.85rem] text-[#f5f0e8]/55 italic mb-4">by {book.author}</p>
              
              <div className="mt-auto pt-4 border-t border-[rgba(245,240,232,0.08)] flex items-center justify-between">
                <div className="text-[0.72rem] text-[#f5f0e8]/30 font-mono">ISBN: {book.isbn.slice(0, 8)}...</div>
                <div className="flex gap-2">
                  {book.status === 'AVAILABLE' ? (
                    <button 
                      onClick={() => onBorrow(book.id)}
                      disabled={!canBorrowMore}
                      className={`px-4 py-2 rounded-lg text-[0.78rem] font-bold transition-all active:scale-95 ${
                        canBorrowMore 
                          ? 'bg-[#c9a84c] text-[#050d1a] hover:bg-[#f0c84a]' 
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Borrow
                    </button>
                  ) : (
                    <button 
                      onClick={() => onReserve(book.id)}
                      className="bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.18)] text-[#f5f0e8]/55 px-4 py-2 rounded-lg text-[0.78rem] font-bold hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all active:scale-95"
                    >
                      Reserve
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="text-6xl mb-6 opacity-20">📚</div>
          <h3 className="font-playfair text-2xl font-bold mb-2">No resources found</h3>
          <p className="text-[#f5f0e8]/40 max-w-md">We couldn't find any books matching your search criteria. Try adjusting your filters or search terms.</p>
          <button 
            onClick={() => { setSearchQuery(''); setSelectedType('ALL'); setSelectedCategory('ALL'); }}
            className="mt-8 text-[#c9a84c] text-[0.85rem] font-bold tracking-widest uppercase border-b border-[#c9a84c] pb-0.5 hover:text-[#f0c84a] hover:border-[#f0c84a] transition-all"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Catalog;
