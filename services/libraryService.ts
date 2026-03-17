
import { supabase, TABLES } from './supabase';
import { Book, User, BorrowRecord, Reservation, BookStatus, LibraryCard, UserRole } from '../types';
import { notificationService } from './notificationService';

export const libraryService = {
  /**
   * Fetches all core library data in parallel
   */
  async getAllData() {
    const [books, profiles, records, reservations] = await Promise.all([
      supabase.from(TABLES.BOOKS).select('*'),
      supabase.from(TABLES.PROFILES).select('*'),
      supabase.from(TABLES.BORROW_RECORDS).select('*'),
      supabase.from(TABLES.RESERVATIONS).select('*')
    ]);

    return {
      books: books.data || [],
      users: profiles.data || [],
      records: records.data || [],
      reservations: reservations.data || []
    };
  },

  /**
   * Handle borrowing a resource
   */
  async borrowBook(bookId: string, userId: string) {
    const newRecord = {
      bookId,
      userId,
      borrowDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      renewalCount: 0,
      fineAmount: 0
    };

    const { error: recordError } = await supabase.from(TABLES.BORROW_RECORDS).insert(newRecord);
    if (recordError) throw recordError;

    const { error: bookError } = await supabase.from(TABLES.BOOKS).update({ status: BookStatus.BORROWED }).eq('id', bookId);
    if (bookError) throw bookError;
  },

  /**
   * Handle returning a resource
   */
  async returnBook(bookId: string, userId: string) {
    const returnDate = new Date().toISOString();
    
    // Get book title for notification
    const { data: bookData } = await supabase.from(TABLES.BOOKS).select('title').eq('id', bookId).single();

    const { error: recordError } = await supabase.from(TABLES.BORROW_RECORDS)
      .update({ returnDate })
      .eq('bookId', bookId)
      .eq('userId', userId)
      .is('returnDate', null);
    
    if (recordError) throw recordError;

    const { error: bookError } = await supabase.from(TABLES.BOOKS).update({ status: BookStatus.AVAILABLE }).eq('id', bookId);
    if (bookError) throw bookError;

    // Trigger availability notifications
    if (bookData) {
      await notificationService.handleBookReturned(bookId, bookData.title);
    }
  },

  /**
   * Handle resource reservation
   */
  async reserveBook(bookId: string, userId: string) {
    const newRes = {
      bookId,
      userId,
      reservationDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    };

    const { error: resError } = await supabase.from(TABLES.RESERVATIONS).insert(newRes);
    if (resError) throw resError;

    const { error: bookError } = await supabase.from(TABLES.BOOKS).update({ status: BookStatus.RESERVED }).eq('id', bookId);
    if (bookError) throw bookError;
  },

  /**
   * Administrative status update
   */
  async updateBookStatus(bookId: string, status: BookStatus) {
    const { error } = await supabase.from(TABLES.BOOKS).update({ status }).eq('id', bookId);
    if (error) throw error;
  },

  /**
   * Add a new book to the catalog
   */
  async addBook(book: Omit<Book, 'id'>) {
    const { data, error } = await supabase.from(TABLES.BOOKS).insert(book).select().single();
    if (error) throw error;
    return data;
  },

  /**
   * Update book details
   */
  async updateBook(bookId: string, updates: Partial<Book>) {
    const { data, error } = await supabase.from(TABLES.BOOKS).update(updates).eq('id', bookId).select().single();
    if (error) throw error;
    return data;
  },

  /**
   * Delete a book from the catalog
   */
  async deleteBook(bookId: string) {
    const { error } = await supabase.from(TABLES.BOOKS).delete().eq('id', bookId);
    if (error) throw error;
  },

  /**
   * Library card issuance with professional institutional formatting
   */
  async issueLibraryCard(userId: string) {
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4 digit random
    
    const newCard: LibraryCard = {
      cardNumber: `BBUC/${year}/${randomSuffix}`,
      issueDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE'
    };

    const { error } = await supabase.from(TABLES.PROFILES).update({ libraryCard: newCard }).eq('id', userId);
    if (error) throw error;
    return newCard;
  },

  /**
   * Update user profile details
   */
  async updateUserProfile(userId: string, updates: { name: string, department: string, role: UserRole }) {
    const { error } = await supabase.from(TABLES.PROFILES).update(updates).eq('id', userId);
    if (error) throw error;
  },

  /**
   * Toggle library card status (Active vs Suspended)
   */
  async toggleLibraryCardStatus(userId: string, currentCard: LibraryCard) {
    const updatedCard: LibraryCard = {
      ...currentCard,
      status: currentCard.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
    };

    const { error } = await supabase.from(TABLES.PROFILES).update({ libraryCard: updatedCard }).eq('id', userId);
    if (error) throw error;
    return updatedCard;
  },

  /**
   * Renew a borrowed resource
   */
  async renewBook(recordId: string, currentDueDate: string, currentRenewalCount: number) {
    const newDueDate = new Date(new Date(currentDueDate).getTime() + 14 * 24 * 60 * 60 * 1000).toISOString();
    const { error } = await supabase.from(TABLES.BORROW_RECORDS)
      .update({ 
        dueDate: newDueDate,
        renewalCount: currentRenewalCount + 1 
      })
      .eq('id', recordId);
    
    if (error) throw error;
  },

  /**
   * Calculate fines for overdue records (Mock logic for UI display)
   * In a real system, this would be a database function or scheduled task
   */
  calculateFine(dueDate: string, returnDate?: string): number {
    const end = returnDate ? new Date(returnDate) : new Date();
    const due = new Date(dueDate);
    
    if (end <= due) return 0;
    
    const diffTime = end.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // 500 UGX per day fine
    return diffDays * 500;
  }
};
