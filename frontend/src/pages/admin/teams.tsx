'use client';

import React from 'react';
import { Layout } from '../../components/Layout';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { AdminTeams } from '../../components/admin/AdminTeams';

export default function AdminTeamsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <Layout role="admin">
        <AdminTeams />
      </Layout>
    </ProtectedRoute>
  );
}

