
import React from 'react';
import { Icons, MOCK_EVENTS, ACADEMIC_YEAR_CONFIG } from './constants';
import { AcademicEvent } from '../types';

const CalendarPage: React.FC = () => {
  const getEventTypeColor = (type: AcademicEvent['type']) => {
    switch (type) {
      case 'EXAM': return 'bg-red-50 text-red-600 border-red-100';
      case 'HOLIDAY': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'LIBRARY_EVENT': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'SEMESTER_START': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'SEMESTER_END': return 'bg-purple-50 text-purple-600 border-purple-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getDay = (dateStr: string) => new Date(dateStr).getDate();
  const getMonth = (dateStr: string) => new Date(dateStr).toLocaleString('default', { month: 'short' });

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Academic Calendar</h1>
          <p className="text-slate-500 mt-2 text-lg">Bishop Barham University College schedule for {ACADEMIC_YEAR_CONFIG.year}</p>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Icons.Calendar />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Semester</p>
            <p className="font-bold text-slate-800">{ACADEMIC_YEAR_CONFIG.semester}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 px-2">Upcoming Events & Deadlines</h2>
          <div className="space-y-4">
            {MOCK_EVENTS.map(event => (
              <div key={event.id} className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex gap-6">
                <div className="flex flex-col items-center justify-center w-16 h-16 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                  <span className="text-xl font-black text-slate-800 group-hover:text-blue-700">{getDay(event.date)}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-blue-400">{getMonth(event.date)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-700 transition-colors">{event.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${getEventTypeColor(event.type)}`}>
                      {event.type.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {/* Library Hours */}
          <section className="bg-blue-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Icons.Library />
              </div>
              <h2 className="text-xl font-bold">Standard Hours</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-white/60 font-medium">Mon - Fri</span>
                <span className="font-bold">08:00 - 21:00</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-white/60 font-medium">Saturday</span>
                <span className="font-bold">09:00 - 17:00</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-white/60 font-medium">Sunday</span>
                <span className="font-bold">14:00 - 18:00</span>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-white/10 rounded-2xl border border-white/10">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Public Holidays</p>
              <p className="text-sm font-semibold">Closed on all gazetted public holidays.</p>
            </div>
          </section>

          {/* Quick Links */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-6">Important Reminders</h2>
            <ul className="space-y-4">
              {[
                "Renew books 3 days before due date.",
                "Library cards are required for entry.",
                "E-Resources accessible 24/7.",
                "Quiet zones are strictly enforced."
              ].map((note, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-600">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 shrink-0"></span>
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
