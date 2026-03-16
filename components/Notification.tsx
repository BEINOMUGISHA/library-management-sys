
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  title?: string;
}

interface NotificationContextType {
  showNotification: (message: string, type?: NotificationType, title?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((message: string, type: NotificationType = 'info', title?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, message, type, title }]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-4 w-full max-w-sm pointer-events-none">
        <AnimatePresence mode="popLayout">
          {notifications.map((n) => (
            <NotificationItem 
              key={n.id} 
              notification={n} 
              onClose={() => removeNotification(n.id)} 
            />
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

const NotificationItem: React.FC<{ notification: Notification; onClose: () => void }> = ({ notification, onClose }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-indigo-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  };

  const bgColors = {
    success: 'bg-[#0a1a10] border-emerald-500/20 shadow-emerald-500/5',
    error: 'bg-[#1a0a0a] border-rose-500/20 shadow-rose-500/5',
    info: 'bg-[#0a0d1a] border-indigo-500/20 shadow-indigo-500/5',
    warning: 'bg-[#1a150a] border-amber-500/20 shadow-amber-500/5',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`pointer-events-auto w-full p-5 rounded-2xl border backdrop-blur-xl shadow-2xl flex gap-4 ${bgColors[notification.type]}`}
    >
      <div className="shrink-0 mt-0.5">
        {icons[notification.type]}
      </div>
      <div className="flex-1 min-w-0">
        {notification.title && (
          <h4 className="text-[0.7rem] font-black uppercase tracking-widest text-[#f5f0e8]/90 mb-1">
            {notification.title}
          </h4>
        )}
        <p className="text-[0.85rem] text-[#f5f0e8]/60 leading-relaxed font-medium">
          {notification.message}
        </p>
      </div>
      <button 
        onClick={onClose}
        className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center hover:bg-white/5 text-[#f5f0e8]/30 hover:text-[#f5f0e8] transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
