
import { supabase, TABLES } from './supabase';
import { Book, User, BorrowRecord, Reservation, BookStatus, LibraryCard } from '../types';

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
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
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
    
    const { error: recordError } = await supabase.from(TABLES.BORROW_RECORDS)
      .update({ returnDate })
      .eq('bookId', bookId)
      .eq('userId', userId)
      .is('returnDate', null);
    
    if (recordError) throw recordError;

    const { error: bookError } = await supabase.from(TABLES.BOOKS).update({ status: BookStatus.AVAILABLE }).eq('id', bookId);
    if (bookError) throw bookError;
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
   * Library card issuance
   */
  async issueLibraryCard(userId: string) {
    const newCard: LibraryCard = {
      cardNumber: 'BBUC-' + Math.random().toString().slice(2, 10),
      issueDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE'
    };

    const { error } = await supabase.from(TABLES.PROFILES).update({ libraryCard: newCard }).eq('id', userId);
    if (error) throw error;
    return newCard;
  }
};
