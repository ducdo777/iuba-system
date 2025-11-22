'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Layout } from '../../components/Layout';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { Box, Spinner, Flex, Text } from '@chakra-ui/react';

// Lazy load AdminDashboard để giảm initial bundle size
const AdminDashboard = dynamic(
  () => import('../../components/admin/AdminDashboard').then(mod => ({ default: mod.AdminDashboard })),
  {
    loading: () => (
      <Flex minH="400px" align="center" justify="center">
        <Box textAlign="center">
          <Spinner size="xl" color="primary.600" thickness="4px" mb={4} />
          <Text color="gray.600">Đang tải dashboard...</Text>
        </Box>
      </Flex>
    ),
    ssr: false,
  }
);

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <Layout role="admin">
        <Suspense
          fallback={
            <Flex minH="400px" align="center" justify="center">
              <Box textAlign="center">
                <Spinner size="xl" color="primary.600" thickness="4px" mb={4} />
                <Text color="gray.600">Đang tải...</Text>
              </Box>
            </Flex>
          }
        >
          <AdminDashboard />
        </Suspense>
      </Layout>
    </ProtectedRoute>
  );
}

