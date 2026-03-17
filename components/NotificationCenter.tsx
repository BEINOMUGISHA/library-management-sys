
import React, { useState } from 'react';
import { Notification, NotificationType } from '../types';
import { formatRelativeTime } from '../utils/formatters';

interface NotificationCenterProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ 
  notifications, 
  unreadCount, 
  onMarkAsRead, 
  onMarkAllAsRead 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.DUE_DATE_REMINDER: return '⏰';
      case NotificationType.OVERDUE_ALERT: return '⚠️';
      case NotificationType.BOOK_AVAILABLE: return '📖';
      case NotificationType.RESERVATION_READY: return '✅';
      case NotificationType.RESERVATION_EXPIRING: return '⏳';
      case NotificationType.RENEWAL_REMINDER: return '🔄';
      case NotificationType.ADMIN_ALERT: return '🛡️';
      case NotificationType.INSTITUTIONAL: return '📢';
      default: return '🔔';
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[#f5f0e8]/60 hover:text-[#c9a84c] transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[100]" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 max-h-[480px] overflow-hidden rounded-2xl border border-[rgba(201,168,76,0.18)] bg-[#0a1526] shadow-2xl z-[101] animate-in slide-in-from-top-2">
            <div className="flex items-center justify-between border-b border-[rgba(201,168,76,0.1)] p-4 bg-[rgba(255,255,255,0.02)]">
              <h3 className="text-[0.85rem] font-bold text-[#f5f0e8]">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={onMarkAllAsRead}
                  className="text-[0.7rem] text-[#c9a84c] hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="overflow-y-auto max-h-[400px] scrollbar-hide">
              {notifications.length > 0 ? (
                notifications.map(note => (
                  <div 
                    key={note.id}
                    onClick={() => !note.isRead && onMarkAsRead(note.id)}
                    className={`p-4 border-b border-[rgba(201,168,76,0.05)] hover:bg-[rgba(255,255,255,0.02)] transition-colors cursor-pointer ${!note.isRead ? 'bg-[rgba(201,168,76,0.03)]' : ''}`}
                  >
                    <div className="flex gap-3">
                      <span className="text-lg">{getIcon(note.type)}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-[0.8rem] ${!note.isRead ? 'font-bold text-[#f5f0e8]' : 'text-[#f5f0e8]/70'}`}>
                            {note.title}
                          </p>
                          {!note.isRead && <div className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />}
                        </div>
                        <p className="text-[0.72rem] text-[#f5f0e8]/50 mt-1 leading-relaxed">
                          {note.message}
                        </p>
                        <p className="text-[0.6rem] text-[#f5f0e8]/30 mt-2 uppercase tracking-widest">
                          {formatRelativeTime(note.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-[0.8rem] text-[#f5f0e8]/30 italic">No notifications yet.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationCenter;
