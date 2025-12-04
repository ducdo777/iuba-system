import React, { useEffect, useState, useCallback } from 'react';
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
import { activityPointsService, ActivityPointConfig } from '../../services/activityPoints';

export const AdminDashboard: React.FC = () => {
  const [overview, setOverview] = useState<StatisticsOverview | null>(null);
  const [pointConfigs, setPointConfigs] = useState<ActivityPointConfig[]>([]);
  const [loading, setLoading] = useState(true);

  const getDefaultConfigs = useCallback((): ActivityPointConfig[] => [
    { activityType: 'donThuan', pointPerUnit: 1 } as ActivityPointConfig,
    { activityType: 'huuHieu', pointPerUnit: 10 } as ActivityPointConfig,
    { activityType: 'baptem', pointPerUnit: 500 } as ActivityPointConfig,
    { activityType: 'thoPhuong', pointPerUnit: 1000 } as ActivityPointConfig,
    { activityType: 'lapCLB', pointPerUnit: 500 } as ActivityPointConfig,
    { activityType: 'lenGiaiDoan', pointPerUnit: 1000 } as ActivityPointConfig,
  ], []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      // Load both APIs in parallel for better performance
      const [overviewData, configs] = await Promise.all([
        statisticsService.getOverview(),
        activityPointsService.getAll().catch(() => []),
      ]);
      setOverview(overviewData);
      setPointConfigs(configs.length > 0 ? configs : getDefaultConfigs());
    } catch (error) {
      console.error('Error loading data:', error);
      setPointConfigs(getDefaultConfigs());
    } finally {
      setLoading(false);
    }
  }, [getDefaultConfigs]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getPointPerUnit = (activityType: string): number => {
    const config = pointConfigs.find(c => c.activityType === activityType);
    return config?.pointPerUnit || 0;
  };

  const calculateActivityPoints = (activityType: string, quantity: number): number => {
    return quantity * getPointPerUnit(activityType);
  };

  const calculateTotalPoints = (): number => {
    if (!overview?.summary) return 0;
    const { summary } = overview;
    
    const donThuan = calculateActivityPoints('donThuan', summary.donThuan);
    const huuHieu = calculateActivityPoints('huuHieu', summary.huuHieu);
    const baptem = calculateActivityPoints('baptem', summary.baptem);
    const thoPhuong = calculateActivityPoints('thoPhuong', summary.thoPhuong);
    const lapCLB = calculateActivityPoints('lapCLB', summary.lapCLB);
    const lenGiaiDoan = calculateActivityPoints('lenGiaiDoan', summary.lenGiaiDoan);

    return donThuan + huuHieu + baptem + thoPhuong + lapCLB + lenGiaiDoan;
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
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box mb={8}>
          <Heading size="2xl" color="gray.900" mb={2}>
            IUBA System
          </Heading>
          <Heading size="lg" color="gray.700">
            Dashboard Tổng quan
          </Heading>
        </Box>

        {/* Data Summary */}
        <VStack spacing={6} align="stretch">
          <HStack spacing={3}>
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
              { 
                value: summary.donThuan, 
                activityType: 'donThuan',
                label: 'Đơn thuần', 
                icon: 'fas fa-hand-holding-heart', 
                color: 'pink' 
              },
              { 
                value: summary.huuHieu, 
                activityType: 'huuHieu',
                label: 'Hữu hiệu', 
                icon: 'fas fa-check-circle', 
                color: 'green' 
              },
              { 
                value: summary.baptem, 
                activityType: 'baptem',
                label: 'Baptem', 
                icon: 'fas fa-water', 
                color: 'blue' 
              },
              { 
                value: summary.thoPhuong, 
                activityType: 'thoPhuong',
                label: 'Thờ phượng', 
                icon: 'fas fa-praying-hands', 
                color: 'purple' 
              },
              { 
                value: summary.lapCLB, 
                activityType: 'lapCLB',
                label: 'Lập CLB', 
                icon: 'fas fa-users', 
                color: 'indigo' 
              },
              { 
                value: summary.lenGiaiDoan, 
                activityType: 'lenGiaiDoan',
                label: 'Lên giai đoạn', 
                icon: 'fas fa-arrow-up', 
                color: 'orange' 
              },
            ].map((item) => {
              const points = calculateActivityPoints(item.activityType, item.value);
              return (
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
                      {item.value.toLocaleString('vi-VN')}
                    </Heading>
                    <Text fontSize="xs" color="gray.500" mb={1}>
                      Tổng điểm: {points.toLocaleString('vi-VN')}
                    </Text>
                    <Text fontSize="sm" color="gray.600" fontWeight="medium">
                      {item.label}
                    </Text>
                  </CardBody>
                </Card>
              );
            })}

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
                  {calculateTotalPoints().toLocaleString('vi-VN')}
                </Heading>
                <Text fontSize="sm" color="primary.100" fontWeight="medium">
                  Tổng điểm
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
            <HStack spacing={3}>
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
                    Tổng điểm
                  </Th>
                  <Th textTransform="uppercase" fontSize="xs" fontWeight="bold" color="gray.700">
                    Điểm TB
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {overview.byTeam.map((team, index) => {
                  const teamTotalPoints = 
                    calculateActivityPoints('donThuan', team.donThuan) +
                    calculateActivityPoints('huuHieu', team.huuHieu) +
                    calculateActivityPoints('baptem', team.baptem) +
                    calculateActivityPoints('thoPhuong', team.thoPhuong) +
                    calculateActivityPoints('lapCLB', team.lapCLB) +
                    calculateActivityPoints('lenGiaiDoan', team.lenGiaiDoan);
                  
                  const averagePoints = team.totalMembers > 0 
                    ? teamTotalPoints / team.totalMembers 
                    : 0;
                  
                  return (
                    <Tr
                      key={team.teamId}
                      bg={index % 2 === 0 ? 'white' : 'gray.50'}
                      _hover={{ bg: 'gray.100' }}
                      transition="background 0.2s"
                    >
                      <Td fontWeight="semibold" color="gray.900">
                        {team.teamName}
                      </Td>
                      <Td color="gray.700" isNumeric>{team.totalMembers || 0}</Td>
                      <Td color="gray.700" isNumeric>{team.donThuan}</Td>
                      <Td color="gray.700" isNumeric>{team.huuHieu}</Td>
                      <Td color="gray.700" isNumeric>{team.baptem}</Td>
                      <Td color="gray.700" isNumeric>{team.thoPhuong}</Td>
                      <Td color="gray.700" isNumeric>{team.lapCLB}</Td>
                      <Td color="gray.700" isNumeric>{team.lenGiaiDoan}</Td>
                      <Td fontWeight="bold" color="primary.600" isNumeric>
                        {teamTotalPoints.toLocaleString('vi-VN')}
                      </Td>
                      <Td fontWeight="bold" color="primary.700" isNumeric>
                        {averagePoints.toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </Card>
      </VStack>
    </Box>
  );
};
