
import { useState, useEffect, useCallback } from 'react';
import { Book, User, BorrowRecord, Reservation, BookStatus } from '../types';
import { libraryService } from '../services/libraryService';
import { supabase, TABLES } from '../services/supabase';
import { MOCK_BOOKS, MOCK_USERS } from '../pages/constants';

export const useLibraryState = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const data = await libraryService.getAllData();
      
      // Fallback to mocks if DB is empty/unconfigured
      setBooks(data.books.length > 0 ? data.books : MOCK_BOOKS);
      setUsers(data.users.length > 0 ? data.users : MOCK_USERS);
      setBorrowRecords(data.records);
      setReservations(data.reservations);
    } catch (error) {
      console.warn("Backend unavailable, using mocks:", error);
      setBooks(MOCK_BOOKS);
      setUsers(MOCK_USERS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Setup real-time listeners (Backend-to-Frontend push)
    const channel = supabase.channel('library-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: TABLES.BOOKS }, loadData)
      .on('postgres_changes', { event: '*', schema: 'public', table: TABLES.PROFILES }, loadData)
      .on('postgres_changes', { event: '*', schema: 'public', table: TABLES.BORROW_RECORDS }, loadData)
      .on('postgres_changes', { event: '*', schema: 'public', table: TABLES.RESERVATIONS }, loadData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadData]);

  // Expose simplified interface to components
  return {
    books,
    users,
    borrowRecords,
    reservations,
    isLoading,
    actions: {
      borrow: libraryService.borrowBook,
      return: libraryService.returnBook,
      reserve: libraryService.reserveBook,
      updateStatus: libraryService.updateBookStatus,
      issueCard: libraryService.issueLibraryCard
    }
  };
};
