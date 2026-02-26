
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
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      {isOpen ? (
        <div className="bg-[#0a1526] w-[400px] h-[600px] rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.6)] border border-[rgba(201,168,76,0.18)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-[#050d1a] p-8 flex items-center justify-between border-b border-[rgba(201,168,76,0.18)]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#c9a84c] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(201,168,76,0.3)]">
                <Icons.Library className="text-[#050d1a]" />
              </div>
              <div>
                <p className="font-playfair font-bold text-lg text-[#f5f0e8] leading-none">Research <em className="italic text-[#c9a84c]">Hub.</em></p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="w-1.5 h-1.5 bg-[#4ade80] rounded-full animate-pulse shadow-[0_0_5px_#4ade80]"></div>
                  <p className="text-[0.65rem] text-[#f5f0e8]/40 uppercase tracking-widest font-bold">Librarian Online</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-[#f5f0e8]/40 hover:text-[#f5f0e8] transition-colors text-2xl">×</button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-[rgba(255,255,255,0.01)]">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[90%] p-5 rounded-[2rem] text-[0.85rem] leading-relaxed shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-[#c9a84c] text-[#050d1a] font-bold rounded-tr-none' 
                    : 'bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.1)] text-[#f5f0e8] rounded-tl-none'
                }`}>
                  {m.text}
                </div>
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-4 w-full space-y-2">
                    <p className="text-[0.6rem] font-bold text-[#c9a84c] uppercase tracking-[0.2em] ml-2">Academic Citations</p>
                    <div className="grid grid-cols-1 gap-2">
                      {m.sources.map((source, idx) => (
                        <a 
                          key={idx} 
                          href={source.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.1)] rounded-2xl transition-all group"
                        >
                          <div className="w-8 h-8 bg-[rgba(201,168,76,0.1)] rounded-xl flex items-center justify-center text-[#c9a84c] shadow-sm shrink-0">
                            <Icons.FileText size={14} />
                          </div>
                          <div className="truncate">
                            <p className="text-[0.7rem] font-bold text-[#f5f0e8] truncate tracking-tight">{source.title}</p>
                            <p className="text-[0.6rem] text-[#f5f0e8]/30 truncate mt-0.5">{source.uri}</p>
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
                <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.1)] p-5 rounded-[2rem] rounded-tl-none">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-[#c9a84c] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#c9a84c] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-[#c9a84c] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-[#050d1a] border-t border-[rgba(201,168,76,0.18)]">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Ask your research assistant..."
                className="w-full pl-6 pr-14 py-4 bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.18)] rounded-2xl text-[0.85rem] text-[#f5f0e8] font-bold focus:border-[#c9a84c] outline-none transition-all"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#c9a84c] text-[#050d1a] rounded-xl flex items-center justify-center hover:bg-[#f0c84a] transition-all shadow-xl shadow-[rgba(201,168,76,0.1)] active:scale-90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-[#050d1a] text-[#c9a84c] w-20 h-20 rounded-[2.5rem] shadow-[0_24px_60px_rgba(0,0,0,0.5)] border border-[rgba(201,168,76,0.3)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-[#c9a84c]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 group-hover:rotate-12 transition-transform scale-125">
            <Icons.Library size={28} />
          </div>
          <div className="absolute top-4 right-4 w-3 h-3 bg-[#4ade80] rounded-full border-2 border-[#050d1a] shadow-[0_0_10px_#4ade80]"></div>
        </button>
      )}
    </div>
  );
};

export default LibrarianChat;
