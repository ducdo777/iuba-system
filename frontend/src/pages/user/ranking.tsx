'use client';

import React from 'react';
import { Layout } from '../../components/Layout';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { Ranking } from '../../components/Ranking';

export default function UserRankingPage() {
  return (
    <ProtectedRoute requiredRole="user">
      <Layout role="user">
        <Ranking />
      </Layout>
    </ProtectedRoute>
  );
}

