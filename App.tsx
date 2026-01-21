
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Catalog from './pages/Catalog';
import CalendarPage from './pages/CalendarPage';
import Dashboard from './Dashboard';
import AdminDashboard from './components/AdminDashboard';
import Auth from './pages/Auth';
import LibrarianChat from './components/LibrarianChat';
import { MOCK_BOOKS, MOCK_USERS } from './pages/constants';
import { User, Book, BorrowRecord, Reservation, BookStatus, UserRole, LibraryCard } from './types';
import { supabase, TABLES } from './services/supabase';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bbuc_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data: bks } = await supabase.from(TABLES.BOOKS).select('*');
        const { data: urs } = await supabase.from(TABLES.PROFILES).select('*');
        const { data: brs } = await supabase.from(TABLES.BORROW_RECORDS).select('*');
        const { data: res } = await supabase.from(TABLES.RESERVATIONS).select('*');

        if (bks && bks.length > 0) setBooks(bks); else setBooks(MOCK_BOOKS);
        if (urs && urs.length > 0) setUsers(urs); else setUsers(MOCK_USERS);
        if (brs) setBorrowRecords(brs);
        if (res) setReservations(res);
      } catch (e) {
        console.error("Supabase fetch error, using mocks", e);
        setBooks(MOCK_BOOKS);
        setUsers(MOCK_USERS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    const bookSub = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: TABLES.BOOKS }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: TABLES.PROFILES }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: TABLES.BORROW_RECORDS }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(bookSub);
    };
  }, []);

  const handleAuthComplete = (selectedUser: User) => {
    setUser(selectedUser);
    localStorage.setItem('bbuc_user', JSON.stringify(selectedUser));
    navigate('/');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('bbuc_user');
    navigate('/auth');
  };

  const handleIssueCard = async (userId: string) => {
    const newCard: LibraryCard = {
      cardNumber: 'BBUC-' + Math.random().toString().slice(2, 10),
      issueDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE'
    };

    await supabase.from(TABLES.PROFILES).update({ libraryCard: newCard }).eq('id', userId);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, libraryCard: newCard } : u));
  };

  const handleBorrow = async (bookId: string) => {
    if (!user) return;
    const newRecord = {
      bookId,
      userId: user.id,
      borrowDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
    };
    await supabase.from(TABLES.BORROW_RECORDS).insert(newRecord);
    await supabase.from(TABLES.BOOKS).update({ status: BookStatus.BORROWED }).eq('id', bookId);
  };

  const handleReturn = async (bookId: string) => {
    const returnDate = new Date().toISOString();
    await supabase.from(TABLES.BORROW_RECORDS).update({ returnDate }).eq('bookId', bookId).eq('userId', user?.id).is('returnDate', null);
    await supabase.from(TABLES.BOOKS).update({ status: BookStatus.AVAILABLE }).eq('id', bookId);
  };

  const handleReserve = async (bookId: string) => {
    if (!user) return;
    const newRes = {
      bookId,
      userId: user.id,
      reservationDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    };
    await supabase.from(TABLES.RESERVATIONS).insert(newRes);
    await supabase.from(TABLES.BOOKS).update({ status: BookStatus.RESERVED }).eq('id', bookId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] animate-pulse">BBUC Cloud Syncing...</p>
      </div>
    );
  }

  const isAuthPage = window.location.hash.includes('#/auth');
  if (!user && !isAuthPage) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <Routes>
      <Route path="/auth" element={<Auth onAuthComplete={handleAuthComplete} existingUsers={users} />} />
      <Route path="/" element={
        <Layout user={user} onLogout={handleLogout}>
          <Catalog books={books} onBorrow={handleBorrow} onReserve={handleReserve} />
          <LibrarianChat books={books} />
        </Layout>
      } />
      <Route path="/calendar" element={
        <Layout user={user} onLogout={handleLogout}>
          <CalendarPage />
        </Layout>
      } />
      <Route path="/dashboard" element={
        <Layout user={user} onLogout={handleLogout}>
          <Dashboard 
            user={user!} 
            books={books} 
            records={borrowRecords.filter(r => r.userId === user?.id)}
            reservations={reservations.filter(res => res.userId === user?.id)}
            onReturn={handleReturn}
          />
        </Layout>
      } />
      <Route path="/admin" element={
        user?.role === UserRole.ADMIN ? (
          <Layout user={user} onLogout={handleLogout}>
            <AdminDashboard 
              books={books} 
              records={borrowRecords} 
              users={users} 
              onIssueCard={handleIssueCard}
            />
          </Layout>
        ) : <Navigate to="/" replace />
      } />
    </Routes>
  );
};

export default App;
