'use client';

import React from 'react';
import { Layout } from '../../components/Layout';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { AdminUsers } from '../../components/admin/AdminUsers';

export default function AdminUsersPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <Layout role="admin">
        <AdminUsers />
      </Layout>
    </ProtectedRoute>
  );
}

