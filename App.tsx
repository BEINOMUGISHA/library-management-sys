
import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Catalog from './pages/Catalog';
import CalendarPage from './pages/CalendarPage';
import Dashboard from './Dashboard';
import AdminDashboard from './components/AdminDashboard';
import Auth from './pages/Auth';
import LibrarianChat from './components/LibrarianChat';
import { useLibraryState } from './hooks/useLibraryState';
import { User, UserRole } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bbuc_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const navigate = useNavigate();
  const { books, users, borrowRecords, reservations, isLoading, actions } = useLibraryState();

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
          <Catalog 
            user={user!}
            books={books} 
            onBorrow={(id) => actions.borrow(id, user!.id)} 
            onReserve={(id) => actions.reserve(id, user!.id)} 
          />
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
            onReturn={(id) => actions.return(id, user!.id)}
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
              onIssueCard={actions.issueCard}
              onUpdateBookStatus={actions.updateStatus}
            />
          </Layout>
        ) : <Navigate to="/" replace />
      } />
    </Routes>
  );
};

export default App;
