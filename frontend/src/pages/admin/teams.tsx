'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Layout } from '../../components/Layout';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { Box, Spinner, Flex, Text } from '@chakra-ui/react';

const AdminTeams = dynamic(
  () => import('../../components/admin/AdminTeams').then(mod => ({ default: mod.AdminTeams })),
  {
    loading: () => (
      <Flex minH="400px" align="center" justify="center">
        <Box textAlign="center">
          <Spinner size="xl" color="primary.600" thickness="4px" mb={4} />
          <Text color="gray.600">Đang tải danh sách teams...</Text>
        </Box>
      </Flex>
    ),
    ssr: false,
  }
);

export default function AdminTeamsPage() {
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
          <AdminTeams />
        </Suspense>
      </Layout>
    </ProtectedRoute>
  );
}

