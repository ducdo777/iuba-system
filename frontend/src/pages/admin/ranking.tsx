'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Layout } from '../../components/Layout';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { Box, Spinner, Flex, Text } from '@chakra-ui/react';

// Lazy load Ranking component
const Ranking = dynamic(
  () => import('../../components/Ranking').then(mod => ({ default: mod.Ranking })),
  {
    loading: () => (
      <Flex minH="400px" align="center" justify="center">
        <Box textAlign="center">
          <Spinner size="xl" color="primary.600" thickness="4px" mb={4} />
          <Text color="gray.600">Đang tải bảng xếp hạng...</Text>
        </Box>
      </Flex>
    ),
    ssr: false,
  }
);

export default function AdminRankingPage() {
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
          <Ranking />
        </Suspense>
      </Layout>
    </ProtectedRoute>
  );
}

