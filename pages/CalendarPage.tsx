import React from 'react';
import { Icons, MOCK_EVENTS, ACADEMIC_YEAR_CONFIG } from './constants';
import { AcademicEvent } from '../types';

const CalendarPage: React.FC = () => {
  const getEventTypeColor = (type: AcademicEvent['type']) => {
    switch (type) {
      case 'EXAM': return 'bg-[rgba(248,113,113,0.1)] text-[#f87171] border-[rgba(248,113,113,0.2)]';
      case 'HOLIDAY': return 'bg-[rgba(201,168,76,0.1)] text-[#c9a84c] border-[rgba(201,168,76,0.2)]';
      case 'LIBRARY_EVENT': return 'bg-[rgba(79,110,247,0.1)] text-[#4f6ef7] border-[rgba(79,110,247,0.2)]';
      case 'SEMESTER_START': return 'bg-[rgba(74,222,128,0.1)] text-[#4ade80] border-[rgba(74,222,128,0.2)]';
      case 'SEMESTER_END': return 'bg-[rgba(168,85,247,0.1)] text-[#a855f7] border-[rgba(168,85,247,0.2)]';
      default: return 'bg-[rgba(245,240,232,0.05)] text-[#f5f0e8]/50 border-[rgba(245,240,232,0.1)]';
    }
  };

  const getDay = (dateStr: string) => new Date(dateStr).getDate();
  const getMonth = (dateStr: string) => new Date(dateStr).toLocaleString('default', { month: 'short' });

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[rgba(201,168,76,0.18)] pb-8">
        <div>
          <h1 className="font-playfair text-[2.5rem] font-bold leading-none">
            Academic <em className="italic text-[#c9a84c]">Calendar.</em>
          </h1>
          <p className="text-[0.85rem] text-[#f5f0e8]/55 mt-2">Bishop Barham University College schedule for {ACADEMIC_YEAR_CONFIG.year}</p>
        </div>
        <div className="bg-[rgba(255,255,255,0.04)] p-5 rounded-[2rem] border border-[rgba(201,168,76,0.18)] flex items-center gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
          <div className="w-10 h-10 bg-[rgba(201,168,76,0.1)] text-[#c9a84c] rounded-xl flex items-center justify-center">
            <Icons.Calendar />
          </div>
          <div>
            <p className="text-[0.65rem] font-bold text-[#f5f0e8]/30 uppercase tracking-widest">Current Semester</p>
            <p className="font-bold text-[#f5f0e8] text-[0.9rem]">{ACADEMIC_YEAR_CONFIG.semester}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <h2 className="font-playfair text-[1.4rem] font-bold text-[#f5f0e8] flex items-center gap-3">
            Upcoming Events
            <div className="flex-1 h-px bg-gradient-to-r from-[rgba(201,168,76,0.18)] to-transparent"></div>
          </h2>
          <div className="space-y-5">
            {MOCK_EVENTS.map(event => (
              <div key={event.id} className="group bg-[rgba(255,255,255,0.03)] p-6 rounded-[2.5rem] border border-[rgba(201,168,76,0.12)] hover:border-[rgba(201,168,76,0.3)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all flex gap-6">
                <div className="flex flex-col items-center justify-center w-16 h-16 bg-[rgba(201,168,76,0.05)] rounded-2xl border border-[rgba(201,168,76,0.1)] group-hover:bg-[rgba(201,168,76,0.15)] transition-colors shrink-0">
                  <span className="text-2xl font-bold text-[#c9a84c]">{getDay(event.date)}</span>
                  <span className="text-[0.65rem] font-bold text-[#f5f0e8]/40 uppercase tracking-widest">{getMonth(event.date)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="font-bold text-[#f5f0e8] text-[1.1rem] tracking-tight">{event.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-[0.6rem] font-bold uppercase tracking-widest border ${getEventTypeColor(event.type)}`}>
                      {event.type.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[#f5f0e8]/50 text-[0.85rem] leading-relaxed">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-10">
          {/* Library Hours */}
          <section className="bg-gradient-to-br from-[#0a1526] to-[#050d1a] rounded-[3rem] p-10 border border-[rgba(201,168,76,0.18)] shadow-[0_30px_80px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#c9a84c]/5 blur-[60px] rounded-full"></div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-[rgba(201,168,76,0.1)] rounded-xl flex items-center justify-center text-[#c9a84c]">
                <Icons.Library />
              </div>
              <h2 className="font-playfair text-[1.3rem] font-bold text-[#f5f0e8]">Library Hours</h2>
            </div>
            
            <div className="space-y-5">
              <div className="flex justify-between items-center py-3 border-b border-[rgba(245,240,232,0.05)]">
                <span className="text-[#f5f0e8]/40 text-[0.85rem] font-medium">Mon - Fri</span>
                <span className="font-bold text-[#f5f0e8]">08:00 - 21:00</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[rgba(245,240,232,0.05)]">
                <span className="text-[#f5f0e8]/40 text-[0.85rem] font-medium">Saturday</span>
                <span className="font-bold text-[#f5f0e8]">09:00 - 17:00</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-[#f5f0e8]/40 text-[0.85rem] font-medium">Sunday</span>
                <span className="font-bold text-[#f5f0e8]">14:00 - 18:00</span>
              </div>
            </div>
            
            <div className="mt-10 p-5 bg-[rgba(201,168,76,0.05)] rounded-2xl border border-[rgba(201,168,76,0.1)]">
              <p className="text-[0.65rem] font-bold uppercase tracking-widest text-[#c9a84c] mb-1.5">Public Holidays</p>
              <p className="text-[0.8rem] text-[#f5f0e8]/60 leading-relaxed font-medium">The physical library remains closed on all gazetted public holidays.</p>
            </div>
          </section>

          {/* Quick Links */}
          <section className="bg-[rgba(255,255,255,0.02)] p-10 rounded-[3rem] border border-[rgba(201,168,76,0.12)]">
            <h2 className="font-playfair text-[1.2rem] font-bold text-[#f5f0e8] mb-8">Institutional Policy</h2>
            <ul className="space-y-5">
              {[
                "Renew books 3 days before due date.",
                "Library cards are required for entry.",
                "E-Resources accessible 24/7.",
                "Quiet zones are strictly enforced."
              ].map((note, i) => (
                <li key={i} className="flex gap-4 text-[0.85rem] text-[#f5f0e8]/50 leading-relaxed">
                  <span className="w-1.5 h-1.5 bg-[#c9a84c] rounded-full mt-2 shrink-0 shadow-[0_0_8px_#c9a84c]"></span>
                  {note}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
