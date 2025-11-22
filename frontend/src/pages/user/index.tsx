'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Layout } from '../../components/Layout';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { Box, Spinner, Flex, Text } from '@chakra-ui/react';

// Lazy load UserDataInput để giảm initial bundle size
const UserDataInput = dynamic(
  () => import('../../components/user/UserDataInput').then(mod => ({ default: mod.UserDataInput })),
  {
    loading: () => (
      <Flex minH="400px" align="center" justify="center">
        <Box textAlign="center">
          <Spinner size="xl" color="primary.600" thickness="4px" mb={4} />
          <Text color="gray.600">Đang tải form nhập liệu...</Text>
        </Box>
      </Flex>
    ),
    ssr: false,
  }
);

export default function UserPage() {
  return (
    <ProtectedRoute requiredRole="user">
      <Layout role="user">
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
          <UserDataInput />
        </Suspense>
      </Layout>
    </ProtectedRoute>
  );
}

