
import { supabase, TABLES } from './supabase';
import { Notification, NotificationType, BorrowRecord, Book, User, Reservation, BookStatus } from '../types';

export const notificationService = {
  /**
   * Fetch notifications for a specific user
   */
  async getNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from(TABLES.NOTIFICATIONS)
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
    return data || [];
  },

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: string) {
    const { error } = await supabase
      .from(TABLES.NOTIFICATIONS)
      .update({ isRead: true })
      .eq('id', notificationId);

    if (error) throw error;
  },

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string) {
    const { error } = await supabase
      .from(TABLES.NOTIFICATIONS)
      .update({ isRead: true })
      .eq('userId', userId)
      .eq('isRead', false);

    if (error) throw error;
  },

  /**
   * Create a new notification
   */
  async createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) {
    const { error } = await supabase
      .from(TABLES.NOTIFICATIONS)
      .insert({
        ...notification,
        createdAt: new Date().toISOString(),
        isRead: false
      });

    if (error) {
      console.error('Error creating notification:', error);
    }
  },

  /**
   * Subscribe to book availability
   */
  async subscribeToAvailability(userId: string, bookId: string) {
    const { error } = await supabase
      .from(TABLES.AVAILABILITY_SUBSCRIPTIONS)
      .insert({ userId, bookId, createdAt: new Date().toISOString() });

    if (error) throw error;
  },

  /**
   * Alert Engine: Checks all records and generates necessary notifications
   * In a real app, this would be a server-side cron job.
   * Here we simulate it by running it on admin/librarian login or dashboard load.
   */
  async runAlertEngine(books: Book[], records: BorrowRecord[], reservations: Reservation[], users: User[]) {
    const now = new Date();
    const notificationsToCreate: Omit<Notification, 'id' | 'createdAt' | 'isRead'>[] = [];

    // 1. Due Date Reminders & Overdue Alerts
    for (const record of records) {
      if (record.returnDate) continue; // Already returned

      const dueDate = new Date(record.dueDate);
      const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const book = books.find(b => b.id === record.bookId);

      if (!book) continue;

      // 2-3 days before
      if (diffDays > 0 && diffDays <= 3) {
        notificationsToCreate.push({
          userId: record.userId,
          type: NotificationType.DUE_DATE_REMINDER,
          title: 'Due Date Approaching',
          message: `The book "${book.title}" is due in ${diffDays} days.`,
          metadata: { bookId: book.id, recordId: record.id }
        });
      }
      // On due date
      else if (diffDays === 0) {
        notificationsToCreate.push({
          userId: record.userId,
          type: NotificationType.DUE_DATE_REMINDER,
          title: 'Due Date Today',
          message: `The book "${book.title}" is due today. Please return or renew it.`,
          metadata: { bookId: book.id, recordId: record.id }
        });
      }
      // Overdue
      else if (diffDays < 0) {
        const overdueDays = Math.abs(diffDays);
        const fine = overdueDays * 500; // 500 UGX per day
        notificationsToCreate.push({
          userId: record.userId,
          type: NotificationType.OVERDUE_ALERT,
          title: 'Book Overdue!',
          message: `"${book.title}" is ${overdueDays} days overdue. Accrued fine: ${fine.toLocaleString()} UGX.`,
          metadata: { bookId: book.id, recordId: record.id, fine }
        });
      }
    }

    // 2. Reservation Alerts
    for (const res of reservations) {
      const expiryDate = new Date(res.expiryDate);
      const diffDays = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const book = books.find(b => b.id === res.bookId);

      if (!book) continue;

      if (diffDays === 1) {
        notificationsToCreate.push({
          userId: res.userId,
          type: NotificationType.RESERVATION_EXPIRING,
          title: 'Reservation Expiring',
          message: `Your reservation for "${book.title}" will expire tomorrow.`,
          metadata: { bookId: book.id, reservationId: res.id }
        });
      }
    }

    // 3. Admin Alerts: Low Stock
    const lowStockBooks = books.filter(b => b.status === BookStatus.AVAILABLE && b.isDigital === false);
    // (In a real system we'd track quantity, here we just check if it's available)
    // For this mock, let's say if a book is borrowed, we check if there are others.
    // Since our mock only has 1 of each, we'll skip complex low stock for now.

    // Deduplicate and save (In real app, we'd check if notification already exists for today)
    // For this simulation, we'll just log them or create them if they don't exist in a "lastChecked" state.
    console.log('Alert Engine generated notifications:', notificationsToCreate.length);
    
    // To avoid spamming, we'd ideally check if a similar notification was sent in the last 24h.
    // For this demo, we'll just create them.
    for (const note of notificationsToCreate) {
      await this.createNotification(note);
    }
  },

  /**
   * Triggered when a book is returned
   */
  async handleBookReturned(bookId: string, bookTitle: string) {
    // Check for availability subscriptions
    const { data: subs, error } = await supabase
      .from(TABLES.AVAILABILITY_SUBSCRIPTIONS)
      .select('*')
      .eq('bookId', bookId);

    if (error) return;

    for (const sub of (subs || [])) {
      await this.createNotification({
        userId: sub.userId,
        type: NotificationType.BOOK_AVAILABLE,
        title: 'Book Available',
        message: `The book you were waiting for, "${bookTitle}", is now available!`,
        metadata: { bookId }
      });
      
      // Remove subscription
      await supabase.from(TABLES.AVAILABILITY_SUBSCRIPTIONS).delete().eq('id', sub.id);
    }
  }
};
