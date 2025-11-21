import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminTeams } from './pages/admin/AdminTeams';
import { AdminStatistics } from './pages/admin/AdminStatistics';
import { UserLayout } from './pages/user/UserLayout';
import { UserDataInput } from './pages/user/UserDataInput';
import './App.css';

const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="teams" element={<AdminTeams />} />
        <Route path="statistics" element={<AdminStatistics />} />
      </Route>
      <Route
        path="/user"
        element={
          <ProtectedRoute requiredRole="user">
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<UserDataInput />} />
      </Route>
      <Route
        path="/"
        element={
          isAuthenticated && user ? (
            <Navigate to={user.role === 'admin' ? '/admin' : '/user'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;