import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Grid,
  Card,
  CardBody,
  Spinner,
  Alert,
  AlertIcon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  HStack,
  VStack,
} from '@chakra-ui/react';
import { statisticsService, StatisticsOverview } from '../../services/statistics';

export const AdminDashboard: React.FC = () => {
  const [overview, setOverview] = useState<StatisticsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    try {
      setLoading(true);
      const data = await statisticsService.getOverview();
      setOverview(data);
    } catch (error) {
      console.error('Error loading overview:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Flex minH="400px" align="center" justify="center">
        <Box textAlign="center">
          <Spinner size="xl" color="primary.600" thickness="4px" mb={4} />
          <Text color="gray.600">Đang tải...</Text>
        </Box>
      </Flex>
    );
  }

  if (!overview) {
    return (
      <Flex minH="400px" align="center" justify="center">
        <Alert status="error" borderRadius="md" maxW="md">
          <AlertIcon />
          <Text fontWeight="medium">Không thể tải dữ liệu</Text>
        </Alert>
      </Flex>
    );
  }

  const { summary } = overview;

  return (
    <Box w="full" p={{ base: 4, md: 6, lg: 8 }}>
      <VStack gap={8} align="stretch">
        {/* Header */}
        <Box mb={8}>
          <Heading size="2xl" color="gray.900" mb={2}>
            IUBA System
          </Heading>
          <Heading size="lg" color="gray.700">
            Dashboard Tổng quan
          </Heading>
        </Box>

        {/* Top Stats Cards */}
        <Grid
          templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
          gap={6}
        >
          <Card
            bgGradient="linear(to-br, blue.500, blue.600)"
            color="white"
            borderRadius="2xl"
            boxShadow="lg"
            _hover={{ transform: 'scale(1.05)', transition: 'all 0.3s' }}
          >
            <CardBody p={6}>
              <Flex justify="space-between" align="center" mb={4}>
                <Box
                  w={16}
                  h={16}
                  borderRadius="xl"
                  bg="whiteAlpha.200"
                  backdropFilter="blur(10px)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <i className="fas fa-user-friends" style={{ fontSize: '2rem' }} />
                </Box>
                <Text fontSize="sm" color="blue.100" fontWeight="medium">
                  Teams
                </Text>
              </Flex>
              <Heading size="2xl" mb={1}>
                {summary.totalTeams}
              </Heading>
              <Text fontSize="sm" color="blue.100">
                Tổng số teams
              </Text>
            </CardBody>
          </Card>

          <Card
            bgGradient="linear(to-br, green.500, green.600)"
            color="white"
            borderRadius="2xl"
            boxShadow="lg"
            _hover={{ transform: 'scale(1.05)', transition: 'all 0.3s' }}
          >
            <CardBody p={6}>
              <Flex justify="space-between" align="center" mb={4}>
                <Box
                  w={16}
                  h={16}
                  borderRadius="xl"
                  bg="whiteAlpha.200"
                  backdropFilter="blur(10px)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <i className="fas fa-users" style={{ fontSize: '2rem' }} />
                </Box>
                <Text fontSize="sm" color="green.100" fontWeight="medium">
                  Người dùng
                </Text>
              </Flex>
              <Heading size="2xl" mb={1}>
                {summary.totalUsers}
              </Heading>
              <Text fontSize="sm" color="green.100">
                Tổng số người dùng
              </Text>
            </CardBody>
          </Card>

          <Card
            bgGradient="linear(to-br, amber.500, amber.600)"
            color="white"
            borderRadius="2xl"
            boxShadow="lg"
            _hover={{ transform: 'scale(1.05)', transition: 'all 0.3s' }}
          >
            <CardBody p={6}>
              <Flex justify="space-between" align="center" mb={4}>
                <Box
                  w={16}
                  h={16}
                  borderRadius="xl"
                  bg="whiteAlpha.200"
                  backdropFilter="blur(10px)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <i className="fas fa-list" style={{ fontSize: '2rem' }} />
                </Box>
                <Text fontSize="sm" color="amber.100" fontWeight="medium">
                  Bản ghi
                </Text>
              </Flex>
              <Heading size="2xl" mb={1}>
                {summary.totalRecords}
              </Heading>
              <Text fontSize="sm" color="amber.100">
                Tổng số bản ghi
              </Text>
            </CardBody>
          </Card>
        </Grid>

        {/* Data Summary */}
        <VStack gap={6} align="stretch">
          <HStack gap={3}>
            <Box h={1} w={12} bgGradient="linear(to-r, primary.600, primary.400)" borderRadius="full" />
            <Heading size="lg" color="gray.800">
              Tổng kết dữ liệu
            </Heading>
          </HStack>

          <Grid
            templateColumns={{
              base: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
              xl: 'repeat(4, 1fr)',
            }}
            gap={4}
          >
            {[
              { value: summary.donThuan, label: 'Đơn thuần', icon: 'fas fa-hand-holding-heart', color: 'pink' },
              { value: summary.huuHieu, label: 'Hữu hiệu', icon: 'fas fa-check-circle', color: 'green' },
              { value: summary.baptem, label: 'Baptem', icon: 'fas fa-water', color: 'blue' },
              { value: summary.thoPhuong, label: 'Thờ phượng', icon: 'fas fa-praying-hands', color: 'purple' },
              { value: summary.lapCLB, label: 'Lập CLB', icon: 'fas fa-users', color: 'indigo' },
              { value: summary.lenGiaiDoan, label: 'Lên giai đoạn', icon: 'fas fa-arrow-up', color: 'orange' },
            ].map((item) => (
              <Card
                key={item.label}
                borderRadius="xl"
                border="1px"
                borderColor="gray.200"
                _hover={{ boxShadow: 'lg', borderColor: `${item.color}.300` }}
                transition="all 0.3s"
              >
                <CardBody p={5}>
                  <Box
                    w={12}
                    h={12}
                    borderRadius="lg"
                    bg={`${item.color}.100`}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color={`${item.color}.600`}
                    mb={3}
                  >
                    <i className={item.icon} style={{ fontSize: '1.25rem' }} />
                  </Box>
                  <Heading size="lg" color="gray.900" mb={1}>
                    {item.value}
                  </Heading>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    {item.label}
                  </Text>
                </CardBody>
              </Card>
            ))}

            <Card
              gridColumn={{ base: '1', sm: 'span 2', lg: 'span 2' }}
              bgGradient="linear(to-br, primary.600, primary.700)"
              color="white"
              borderRadius="xl"
              boxShadow="lg"
              _hover={{ transform: 'scale(1.05)', transition: 'all 0.3s' }}
            >
              <CardBody p={5}>
                <Box
                  w={14}
                  h={14}
                  borderRadius="xl"
                  bg="whiteAlpha.200"
                  backdropFilter="blur(10px)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mb={3}
                >
                  <i className="fas fa-chart-line" style={{ fontSize: '2rem' }} />
                </Box>
                <Heading size="xl" mb={1}>
                  {summary.grandTotal}
                </Heading>
                <Text fontSize="sm" color="primary.100" fontWeight="medium">
                  Tổng cộng
                </Text>
              </CardBody>
            </Card>
          </Grid>
        </VStack>

        {/* Team Stats Table */}
        <Card borderRadius="2xl" boxShadow="lg" overflow="hidden">
          <Box
            bgGradient="linear(to-r, gray.50, gray.100)"
            px={6}
            py={4}
            borderBottom="1px"
            borderColor="gray.200"
          >
            <HStack gap={3}>
              <Box h={1} w={12} bgGradient="linear(to-r, primary.600, primary.400)" borderRadius="full" />
              <Heading size="md" color="gray.800">
                Thống kê theo Team
              </Heading>
            </HStack>
          </Box>
          <TableContainer>
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th textTransform="uppercase" fontSize="xs" fontWeight="bold" color="gray.700">
                    Team
                  </Th>
                  <Th textTransform="uppercase" fontSize="xs" fontWeight="bold" color="gray.700">
                    Số thành viên
                  </Th>
                  <Th textTransform="uppercase" fontSize="xs" fontWeight="bold" color="gray.700">
                    Đơn thuần
                  </Th>
                  <Th textTransform="uppercase" fontSize="xs" fontWeight="bold" color="gray.700">
                    Hữu hiệu
                  </Th>
                  <Th textTransform="uppercase" fontSize="xs" fontWeight="bold" color="gray.700">
                    Baptem
                  </Th>
                  <Th textTransform="uppercase" fontSize="xs" fontWeight="bold" color="gray.700">
                    Thờ phượng
                  </Th>
                  <Th textTransform="uppercase" fontSize="xs" fontWeight="bold" color="gray.700">
                    Lập CLB
                  </Th>
                  <Th textTransform="uppercase" fontSize="xs" fontWeight="bold" color="gray.700">
                    Lên giai đoạn
                  </Th>
                  <Th textTransform="uppercase" fontSize="xs" fontWeight="bold" color="gray.700">
                    Tổng
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {overview.byTeam.map((team, index) => (
                  <Tr
                    key={team.teamId}
                    bg={index % 2 === 0 ? 'white' : 'gray.50'}
                    _hover={{ bg: 'gray.100' }}
                    transition="background 0.2s"
                  >
                    <Td fontWeight="semibold" color="gray.900">
                      {team.teamName}
                    </Td>
                    <Td color="gray.700">{team.totalMembers || '-'}</Td>
                    <Td color="gray.700">{team.donThuan}</Td>
                    <Td color="gray.700">{team.huuHieu}</Td>
                    <Td color="gray.700">{team.baptem}</Td>
                    <Td color="gray.700">{team.thoPhuong}</Td>
                    <Td color="gray.700">{team.lapCLB}</Td>
                    <Td color="gray.700">{team.lenGiaiDoan}</Td>
                    <Td fontWeight="bold" color="primary.600">
                      {team.total}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Card>
      </VStack>
    </Box>
  );
};
