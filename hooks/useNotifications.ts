
import { useState, useEffect, useCallback } from 'react';
import { Notification } from '../types';
import { notificationService } from '../services/notificationService';
import { supabase, TABLES } from '../services/supabase';

export const useNotifications = (userId: string | undefined) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    const data = await notificationService.getNotifications(userId);
    setNotifications(data);
    setUnreadCount(data.filter(n => !n.isRead).length);
    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchNotifications();

    if (userId) {
      const channel = supabase.channel(`notifications-${userId}`)
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: TABLES.NOTIFICATIONS,
          filter: `userId=eq.${userId}`
        }, fetchNotifications)
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [userId, fetchNotifications]);

  const markAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    fetchNotifications();
  };

  const markAllAsRead = async () => {
    if (!userId) return;
    await notificationService.markAllAsRead(userId);
    fetchNotifications();
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications
  };
};
