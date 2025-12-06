import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Spinner, Flex, Text } from '@chakra-ui/react';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';

// Lazy load components
const Login = lazy(() => import('./pages/login').then(m => ({ default: m.default })));
const AdminDashboard = lazy(() => import('./pages/admin/index').then(m => ({ default: m.default })));
const AdminUsers = lazy(() => import('./pages/admin/users').then(m => ({ default: m.default })));
const AdminTeams = lazy(() => import('./pages/admin/teams').then(m => ({ default: m.default })));
const AdminStatistics = lazy(() => import('./pages/admin/statistics').then(m => ({ default: m.default })));
const AdminRanking = lazy(() => import('./pages/admin/ranking').then(m => ({ default: m.default })));
const AdminPoints = lazy(() => import('./pages/admin/points').then(m => ({ default: m.default })));
const UserDashboard = lazy(() => import('./pages/user/index').then(m => ({ default: m.default })));
const UserRanking = lazy(() => import('./pages/user/ranking').then(m => ({ default: m.default })));

const LoadingFallback = () => (
  <Flex minH="400px" align="center" justify="center">
    <Box textAlign="center">
      <Spinner size="xl" color="primary.600" thickness="4px" mb={4} />
      <Text color="gray.600">Đang tải...</Text>
    </Box>
  </Flex>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout role="admin">
                  <Suspense fallback={<LoadingFallback />}>
                    <AdminDashboard />
                  </Suspense>
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout role="admin">
                  <Suspense fallback={<LoadingFallback />}>
                    <AdminUsers />
                  </Suspense>
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/teams"
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout role="admin">
                  <Suspense fallback={<LoadingFallback />}>
                    <AdminTeams />
                  </Suspense>
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/statistics"
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout role="admin">
                  <Suspense fallback={<LoadingFallback />}>
                    <AdminStatistics />
                  </Suspense>
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/ranking"
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout role="admin">
                  <Suspense fallback={<LoadingFallback />}>
                    <AdminRanking />
                  </Suspense>
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/points"
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout role="admin">
                  <Suspense fallback={<LoadingFallback />}>
                    <AdminPoints />
                  </Suspense>
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/user"
            element={
              <ProtectedRoute requiredRole="user">
                <Layout role="user">
                  <Suspense fallback={<LoadingFallback />}>
                    <UserDashboard />
                  </Suspense>
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/ranking"
            element={
              <ProtectedRoute requiredRole="user">
                <Layout role="user">
                  <Suspense fallback={<LoadingFallback />}>
                    <UserRanking />
                  </Suspense>
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

