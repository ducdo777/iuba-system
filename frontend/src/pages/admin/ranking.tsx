'use client';

import React from 'react';
import { Layout } from '../../components/Layout';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { Ranking } from '../../components/Ranking';

export default function AdminRankingPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <Layout role="admin">
        <Ranking />
      </Layout>
    </ProtectedRoute>
  );
}

