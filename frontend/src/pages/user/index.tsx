'use client';

import React from 'react';
import { Layout } from '../../components/Layout';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { UserDataInput } from '../../components/user/UserDataInput';

export default function UserPage() {
  return (
    <ProtectedRoute requiredRole="user">
      <Layout role="user">
        <UserDataInput />
      </Layout>
    </ProtectedRoute>
  );
}

