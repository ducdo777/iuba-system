'use client';

import React from 'react';
import { Layout } from '../../components/Layout';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { AdminDashboard } from '../../components/admin/AdminDashboard';

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <Layout role="admin">
        <AdminDashboard />
      </Layout>
    </ProtectedRoute>
  );
}

