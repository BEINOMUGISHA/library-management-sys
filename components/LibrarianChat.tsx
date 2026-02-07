
import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '../pages/constants';
import { Book } from '../types';
import { askLibrarian, ResearchResponse } from '../services/geminiService';

interface Message {
  role: 'user' | 'ai';
  text: string;
  sources?: { title: string; uri: string }[];
}

interface LibrarianChatProps {
  books: Book[];
}

const LibrarianChat: React.FC<LibrarianChatProps> = ({ books }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: "Welcome to the BBUC eLibrary Research Hub! I can help you search our catalog or find global academic resources. What are you researching today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const context = books.map(b => `${b.title} by ${b.author} (${b.category})`).join(', ');
    const aiResponse: ResearchResponse = await askLibrarian(userMsg, context);
    
    setMessages(prev => [...prev, { 
      role: 'ai', 
      text: aiResponse.text,
      sources: aiResponse.sources
    }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      {isOpen ? (
        <div className="bg-white w-[400px] h-[600px] rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-slate-900 p-8 flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-900/40">
                <Icons.Library />
              </div>
              <div>
                <p className="font-black text-lg tracking-tight leading-none uppercase">Research Assistant</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">eLibrary Portal Live</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-3 rounded-2xl transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#fcfdfe]">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[90%] p-5 rounded-[2rem] text-sm leading-relaxed shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-indigo-700 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-4 w-full space-y-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Academic Citations</p>
                    <div className="grid grid-cols-1 gap-2">
                      {m.sources.map((source, idx) => (
                        <a 
                          key={idx} 
                          href={source.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-indigo-50/50 hover:bg-indigo-100/50 border border-indigo-100 rounded-2xl transition-all group"
                        >
                          <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                            <Icons.FileText />
                          </div>
                          <div className="truncate">
                            <p className="text-[10px] font-black text-indigo-900 truncate tracking-tight">{source.title}</p>
                            <p className="text-[8px] text-indigo-400 truncate mt-0.5">{source.uri}</p>
                          </div>
                          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-indigo-50/50 border border-indigo-100 p-5 rounded-[2rem] rounded-tl-none">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 bg-indigo-300 rounded-full animate-bounce"></div>
                    <div className="w-2.5 h-2.5 bg-indigo-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2.5 h-2.5 bg-indigo-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-white border-t border-slate-100">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Search global academic resources..."
                className="w-full pl-6 pr-14 py-5 bg-slate-50 border-2 border-slate-50 rounded-3xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-600 outline-none transition-all"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-11 h-11 bg-indigo-700 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-800 transition-all shadow-xl shadow-indigo-200 active:scale-90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-slate-900 text-white w-20 h-20 rounded-[2.5rem] shadow-[0_24px_48px_-12px_rgba(15,23,42,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 group-hover:rotate-12 transition-transform scale-125">
            <Icons.Library />
          </div>
          <div className="absolute top-3 right-3 w-4 h-4 bg-emerald-500 rounded-full border-4 border-slate-900"></div>
        </button>
      )}
    </div>
  );
};

export default LibrarianChat;
