'use client';

import React from 'react';
import { Layout } from '../../components/Layout';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { AdminStatistics } from '../../components/admin/AdminStatistics';

export default function AdminStatisticsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <Layout role="admin">
        <AdminStatistics />
      </Layout>
    </ProtectedRoute>
  );
}

