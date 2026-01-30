
import { useState, useEffect, useCallback } from 'react';
import { Book, User, BorrowRecord, Reservation, BookStatus } from '../types';
import { libraryService } from '../services/libraryService';
import { supabase, TABLES, isConfigured } from '../services/supabase';
import { MOCK_BOOKS, MOCK_USERS } from '../pages/constants';

export const useLibraryState = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!isConfigured) {
      console.info("useLibraryState: No Supabase config detected. Running in Mock Mode.");
      setBooks(MOCK_BOOKS);
      setUsers(MOCK_USERS);
      setIsLoading(false);
      return;
    }

    try {
      const data = await libraryService.getAllData();
      
      // Fallback to mocks if DB tables are empty
      setBooks(data.books.length > 0 ? data.books : MOCK_BOOKS);
      setUsers(data.users.length > 0 ? data.users : MOCK_USERS);
      setBorrowRecords(data.records);
      setReservations(data.reservations);
      console.log("useLibraryState: Live data synchronized from Supabase.");
    } catch (error) {
      console.warn("useLibraryState: Failed to fetch live data, using fallbacks:", error);
      setBooks(MOCK_BOOKS);
      setUsers(MOCK_USERS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    if (isConfigured) {
      const channel = supabase.channel('library-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: TABLES.BOOKS }, loadData)
        .on('postgres_changes', { event: '*', schema: 'public', table: TABLES.PROFILES }, loadData)
        .on('postgres_changes', { event: '*', schema: 'public', table: TABLES.BORROW_RECORDS }, loadData)
        .on('postgres_changes', { event: '*', schema: 'public', table: TABLES.RESERVATIONS }, loadData)
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [loadData]);

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
      issueCard: libraryService.issueLibraryCard,
      updateUser: libraryService.updateUserProfile,
      toggleCardStatus: libraryService.toggleLibraryCardStatus
    }
  };
};
