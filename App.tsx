
import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Catalog from './pages/Catalog';
import CalendarPage from './pages/CalendarPage';
import Dashboard from './Dashboard';
import AdminDashboard from './components/AdminDashboard';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import LibrarianChat from './components/LibrarianChat';
import { useLibraryState } from './hooks/useLibraryState';
import { User, UserRole } from './types';
import { BORROW_LIMITS } from './pages/constants';

import { NotificationProvider, useNotification } from './components/Notification';

const AppContent: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bbuc_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const navigate = useNavigate();
  const { books, users, borrowRecords, reservations, isLoading, actions } = useLibraryState();
  const { showNotification } = useNotification();

  const handleAuthComplete = (selectedUser: User) => {
    setUser(selectedUser);
    localStorage.setItem('bbuc_user', JSON.stringify(selectedUser));
    showNotification(`Welcome back, ${selectedUser.name}`, 'success', 'Authentication Success');
    navigate('/');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('bbuc_user');
    showNotification('You have been securely logged out.', 'info', 'Session Ended');
    navigate('/auth');
  };

  const activeBorrowsForUser = borrowRecords.filter(r => r.userId === user?.id && !r.returnDate);
  const borrowLimit = user ? BORROW_LIMITS[user.role] : 0;
  const canBorrowMore = activeBorrowsForUser.length < borrowLimit;

  const handleBorrow = async (bookId: string) => {
    if (!user) return;
    
    // Check limits for Students and Lecturers
    if (user.role !== UserRole.ADMIN && !canBorrowMore) {
      showNotification(
        `Institutional Policy: You have reached your borrowing limit of ${borrowLimit} books. Please return an active loan to borrow more resources.`,
        'warning',
        'Borrowing Limit'
      );
      return;
    }

    try {
      await actions.borrow(bookId, user.id);
      showNotification('Resource successfully allocated to your account.', 'success', 'Borrow Success');
    } catch (err) {
      console.error("Borrow failed:", err);
      showNotification("System error during resource allocation. Please try again.", 'error', 'System Error');
    }
  };

  const handleReserve = async (bookId: string) => {
    if (!user) return;
    try {
      await actions.reserve(bookId, user.id);
      showNotification('Title reserved. You will be notified when it becomes available.', 'success', 'Reservation Success');
    } catch (err) {
      showNotification('Failed to reserve title. Please try again.', 'error', 'System Error');
    }
  };

  const handleReturn = async (recordId: string) => {
    if (!user) return;
    try {
      await actions.return(recordId, user.id);
      showNotification('Resource successfully returned to the collection.', 'success', 'Return Success');
    } catch (err) {
      showNotification('Failed to process return. Please contact a librarian.', 'error', 'System Error');
    }
  };

  const handleRenew = async (recordId: string, currentDueDate: string, currentRenewalCount: number) => {
    if (!user) return;
    if (currentRenewalCount >= 2) {
      showNotification('Maximum renewal limit (2) reached for this resource.', 'warning', 'Renewal Limit');
      return;
    }
    try {
      await actions.renew(recordId, currentDueDate, currentRenewalCount);
      showNotification('Resource successfully renewed for 14 additional days.', 'success', 'Renewal Success');
    } catch (err) {
      showNotification('Failed to renew resource. Please try again.', 'error', 'System Error');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050d1a] flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 border-4 border-[rgba(201,168,76,0.1)] border-t-[#c9a84c] rounded-full animate-spin mb-6 shadow-[0_0_30px_rgba(201,168,76,0.2)]"></div>
        <p className="text-[#c9a84c] font-bold uppercase tracking-[0.3em] text-[0.7rem] animate-pulse">BBUC Cloud Syncing...</p>
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
            canBorrowMore={canBorrowMore}
            activeBorrowsCount={activeBorrowsForUser.length}
            borrowLimit={borrowLimit}
            onBorrow={handleBorrow} 
            onReserve={handleReserve} 
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
            onReturn={handleReturn}
            onRenew={handleRenew}
          />
        </Layout>
      } />
      <Route path="/profile" element={
        <Layout user={user} onLogout={handleLogout}>
          <Profile 
            user={user!} 
            onUpdate={async (updates) => {
              try {
                await actions.updateUser(user!.id, updates);
                const updatedUser = { ...user!, ...updates };
                setUser(updatedUser);
                localStorage.setItem('bbuc_user', JSON.stringify(updatedUser));
                showNotification('Profile updated successfully.', 'success', 'Profile Update');
              } catch (err) {
                showNotification('Failed to update profile.', 'error', 'Profile Error');
                throw err;
              }
            }}
          />
        </Layout>
      } />
      <Route path="/admin" element={
        (user?.role === UserRole.ADMIN || user?.role === UserRole.LIBRARIAN) ? (
          <Layout user={user} onLogout={handleLogout}>
            <AdminDashboard 
              books={books} 
              records={borrowRecords} 
              users={users} 
              onIssueCard={async (userId) => {
                try {
                  await actions.issueCard(userId);
                  showNotification('Library ID card successfully issued.', 'success', 'Admin Action');
                } catch (err) {
                  showNotification('Failed to issue library card. Please try again.', 'error', 'Admin Error');
                }
              }}
              onUpdateBookStatus={async (bookId, status) => {
                try {
                  await actions.updateStatus(bookId, status);
                  showNotification(`Book status updated to ${status}.`, 'info', 'Admin Action');
                } catch (err) {
                  showNotification('Failed to update book status.', 'error', 'Admin Error');
                }
              }}
              onUpdateUser={async (userId, updates) => {
                try {
                  await actions.updateUser(userId, updates);
                  showNotification('User profile successfully updated.', 'success', 'Admin Action');
                } catch (err) {
                  showNotification('Failed to update user profile.', 'error', 'Admin Error');
                }
              }}
              onToggleCardStatus={async (userId, card) => {
                try {
                  await actions.toggleCardStatus(userId, card);
                  showNotification('ID card status toggled.', 'info', 'Admin Action');
                } catch (err) {
                  showNotification('Failed to toggle card status.', 'error', 'Admin Error');
                }
              }}
              onReturn={handleReturn}
              onRenew={handleRenew}
              onAddBook={async (book) => {
                try {
                  await actions.addBook(book);
                  showNotification('New resource added to the collection.', 'success', 'Admin Action');
                } catch (err) {
                  showNotification('Failed to add resource.', 'error', 'Admin Error');
                }
              }}
              onUpdateBook={async (bookId, updates) => {
                try {
                  await actions.updateBook(bookId, updates);
                  showNotification('Resource details updated.', 'success', 'Admin Action');
                } catch (err) {
                  showNotification('Failed to update resource.', 'error', 'Admin Error');
                }
              }}
              onDeleteBook={async (bookId) => {
                try {
                  await actions.deleteBook(bookId);
                  showNotification('Resource removed from the collection.', 'success', 'Admin Action');
                } catch (err) {
                  showNotification('Failed to remove resource.', 'error', 'Admin Error');
                }
              }}
            />
          </Layout>
        ) : <Navigate to="/" replace />
      } />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  );
};


export default App;
