'use client';

import React from 'react';
import { Layout } from '../../components/Layout';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { AdminPoints } from '../../components/admin/AdminPoints';

export default function AdminPointsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <Layout role="admin">
        <AdminPoints />
      </Layout>
    </ProtectedRoute>
  );
}

