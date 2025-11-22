import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Card,
  CardBody,
  Spinner,
  Badge,
  HStack,
  VStack,
} from '@chakra-ui/react';
import { statisticsService, StatisticsOverview } from '../services/statistics';
import { activityPointsService, ActivityPointConfig } from '../services/activityPoints';

interface TeamRanking {
  teamId: string;
  teamCode: string;
  teamName: string;
  totalMembers: number;
  donThuan: number;
  huuHieu: number;
  baptem: number;
  thoPhuong: number;
  lapCLB: number;
  lenGiaiDoan: number;
  totalPoints: number;
  averagePoints: number;
  rank: number;
}

export const Ranking: React.FC = () => {
  const [overview, setOverview] = useState<StatisticsOverview | null>(null);
  const [pointConfigs, setPointConfigs] = useState<ActivityPointConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [rankings, setRankings] = useState<TeamRanking[]>([]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [overviewData, configs] = await Promise.all([
        statisticsService.getOverview(),
        activityPointsService.getAll().catch(() => []),
      ]);
      setOverview(overviewData);
      setPointConfigs(configs.length > 0 ? configs : getDefaultConfigs());
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getDefaultConfigs = (): ActivityPointConfig[] => [
    { activityType: 'donThuan', pointPerUnit: 1 } as ActivityPointConfig,
    { activityType: 'huuHieu', pointPerUnit: 10 } as ActivityPointConfig,
    { activityType: 'baptem', pointPerUnit: 500 } as ActivityPointConfig,
    { activityType: 'thoPhuong', pointPerUnit: 1000 } as ActivityPointConfig,
    { activityType: 'lapCLB', pointPerUnit: 500 } as ActivityPointConfig,
    { activityType: 'lenGiaiDoan', pointPerUnit: 1000 } as ActivityPointConfig,
  ];

  const getPointPerUnit = useCallback((activityType: string): number => {
    const config = pointConfigs.find(c => c.activityType === activityType);
    return config?.pointPerUnit || 0;
  }, [pointConfigs]);

  const calculateTeamPoints = useCallback((team: StatisticsOverview['byTeam'][0]): number => {
    const donThuan = team.donThuan * getPointPerUnit('donThuan');
    const huuHieu = team.huuHieu * getPointPerUnit('huuHieu');
    const baptem = team.baptem * getPointPerUnit('baptem');
    const thoPhuong = team.thoPhuong * getPointPerUnit('thoPhuong');
    const lapCLB = team.lapCLB * getPointPerUnit('lapCLB');
    const lenGiaiDoan = team.lenGiaiDoan * getPointPerUnit('lenGiaiDoan');

    return donThuan + huuHieu + baptem + thoPhuong + lapCLB + lenGiaiDoan;
  }, [getPointPerUnit]);

  useEffect(() => {
    if (overview && pointConfigs.length > 0) {
      const teamRankings: TeamRanking[] = overview.byTeam
        .map((team) => {
          const totalPoints = calculateTeamPoints(team);
          const averagePoints = team.totalMembers > 0 ? totalPoints / team.totalMembers : 0;
          return {
            teamId: team.teamId,
            teamCode: team.teamCode,
            teamName: team.teamName,
            totalMembers: team.totalMembers,
            donThuan: team.donThuan,
            huuHieu: team.huuHieu,
            baptem: team.baptem,
            thoPhuong: team.thoPhuong,
            lapCLB: team.lapCLB,
            lenGiaiDoan: team.lenGiaiDoan,
            totalPoints,
            averagePoints,
            rank: 0,
          };
        })
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .slice(0, 10)
        .map((team, index) => ({
          ...team,
          rank: index + 1,
        }));

      setRankings(teamRankings);
    }
  }, [overview, pointConfigs, calculateTeamPoints]);

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'yellow';
    if (rank === 2) return 'gray';
    if (rank === 3) return 'orange';
    return 'blue';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
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

  return (
    <Box w="full" p={{ base: 2, md: 4, lg: 6 }} maxW="100%" overflowX="hidden">
      <VStack spacing={4} align="stretch">
        <Box>
          <Heading size={{ base: 'lg', md: 'xl' }} color="gray.900" mb={2}>
            Bảng xếp hạng
          </Heading>
          <Text color="gray.600" fontSize={{ base: 'sm', md: 'md' }}>
            Top 10 Teams có tổng điểm cao nhất (Điểm TB = Tổng điểm / Số thành viên)
          </Text>
        </Box>

        <Card borderRadius="2xl" boxShadow="lg" overflow="hidden" w="full" maxW="100%">
          <Box
            bgGradient="linear(to-r, primary.50, primary.100)"
            px={6}
            py={4}
            borderBottom="1px"
            borderColor="gray.200"
          >
            <HStack spacing={3}>
              <Box h={1} w={12} bgGradient="linear(to-r, primary.600, primary.400)" borderRadius="full" />
              <Heading size="md" color="gray.800">
                Xếp hạng Teams
              </Heading>
            </HStack>
          </Box>
          <TableContainer overflowX="visible" w="full" maxW="100%">
            <Table variant="simple" size="sm" whiteSpace="nowrap" w="full" layout="fixed">
              <Thead bg="gray.50">
                <Tr>
                  <Th textTransform="uppercase" fontSize={{ base: '10px', md: '11px', lg: '12px' }} fontWeight="bold" color="gray.700" width={{ base: '50px', md: '70px' }} px={{ base: 1, md: 2 }}>
                    Hạng
                  </Th>
                  <Th textTransform="uppercase" fontSize={{ base: '10px', md: '11px', lg: '12px' }} fontWeight="bold" color="gray.700" px={{ base: 1, md: 2 }}>
                    Team
                  </Th>
                  <Th textTransform="uppercase" fontSize={{ base: '10px', md: '11px', lg: '12px' }} fontWeight="bold" color="gray.700" px={{ base: 1, md: 2 }} display={{ base: 'none', md: 'table-cell' }}>
                    Mã Team
                  </Th>
                  <Th textTransform="uppercase" fontSize={{ base: '10px', md: '11px', lg: '12px' }} fontWeight="bold" color="gray.700" isNumeric px={{ base: 1, md: 2 }}>
                    TV
                  </Th>
                  <Th textTransform="uppercase" fontSize={{ base: '10px', md: '11px', lg: '12px' }} fontWeight="bold" color="gray.700" isNumeric px={{ base: 1, md: 2 }}>
                    Đơn
                  </Th>
                  <Th textTransform="uppercase" fontSize={{ base: '10px', md: '11px', lg: '12px' }} fontWeight="bold" color="gray.700" isNumeric px={{ base: 1, md: 2 }}>
                    Hữu
                  </Th>
                  <Th textTransform="uppercase" fontSize={{ base: '10px', md: '11px', lg: '12px' }} fontWeight="bold" color="gray.700" isNumeric px={{ base: 1, md: 2 }}>
                    Bap
                  </Th>
                  <Th textTransform="uppercase" fontSize={{ base: '10px', md: '11px', lg: '12px' }} fontWeight="bold" color="gray.700" isNumeric px={{ base: 1, md: 2 }}>
                    Thờ
                  </Th>
                  <Th textTransform="uppercase" fontSize={{ base: '10px', md: '11px', lg: '12px' }} fontWeight="bold" color="gray.700" isNumeric px={{ base: 1, md: 2 }}>
                    CLB
                  </Th>
                  <Th textTransform="uppercase" fontSize={{ base: '10px', md: '11px', lg: '12px' }} fontWeight="bold" color="gray.700" isNumeric px={{ base: 1, md: 2 }}>
                    GĐ
                  </Th>
                  <Th textTransform="uppercase" fontSize={{ base: '10px', md: '11px', lg: '12px' }} fontWeight="bold" color="gray.700" isNumeric px={{ base: 1, md: 2 }}>
                    Tổng
                  </Th>
                  <Th textTransform="uppercase" fontSize={{ base: '10px', md: '11px', lg: '12px' }} fontWeight="bold" color="gray.700" isNumeric px={{ base: 1, md: 2 }}>
                    Điểm TB
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {rankings.length === 0 ? (
                  <Tr>
                    <Td colSpan={12} textAlign="center" py={8} color="gray.500">
                      Chưa có dữ liệu xếp hạng
                    </Td>
                  </Tr>
                ) : (
                  rankings.map((team) => (
                    <Tr
                      key={team.teamId}
                      bg={team.rank <= 3 ? `${getRankBadgeColor(team.rank)}.50` : 'white'}
                      _hover={{ bg: team.rank <= 3 ? `${getRankBadgeColor(team.rank)}.100` : 'gray.50' }}
                      transition="background 0.2s"
                    >
                      <Td px={{ base: 1, md: 2 }}>
                        <Flex align="center" gap={{ base: 0.5, md: 2 }} flexWrap="nowrap">
                          {getRankIcon(team.rank) && (
                            <Text fontSize={{ base: 'md', md: 'xl' }}>{getRankIcon(team.rank)}</Text>
                          )}
                          <Badge
                            colorScheme={getRankBadgeColor(team.rank)}
                            variant="solid"
                            fontSize={{ base: '10px', md: 'sm' }}
                            px={{ base: 1, md: 2 }}
                            py={{ base: 0.5, md: 1 }}
                            borderRadius="md"
                          >
                            #{team.rank}
                          </Badge>
                        </Flex>
                      </Td>
                      <Td fontWeight="semibold" color="gray.900" px={{ base: 1, md: 2 }} fontSize={{ base: '11px', md: 'sm' }}>
                        {team.teamName}
                      </Td>
                      <Td color="gray.700" fontFamily="mono" px={{ base: 1, md: 2 }} fontSize={{ base: '10px', md: 'sm' }} display={{ base: 'none', md: 'table-cell' }}>
                        {team.teamCode}
                      </Td>
                      <Td color="gray.700" isNumeric px={{ base: 1, md: 2 }} fontSize={{ base: '11px', md: 'sm' }}>
                        {team.totalMembers || '-'}
                      </Td>
                      <Td color="gray.700" isNumeric px={{ base: 1, md: 2 }} fontSize={{ base: '11px', md: 'sm' }}>
                        {team.donThuan.toLocaleString('vi-VN')}
                      </Td>
                      <Td color="gray.700" isNumeric px={{ base: 1, md: 2 }} fontSize={{ base: '11px', md: 'sm' }}>
                        {team.huuHieu.toLocaleString('vi-VN')}
                      </Td>
                      <Td color="gray.700" isNumeric px={{ base: 1, md: 2 }} fontSize={{ base: '11px', md: 'sm' }}>
                        {team.baptem.toLocaleString('vi-VN')}
                      </Td>
                      <Td color="gray.700" isNumeric px={{ base: 1, md: 2 }} fontSize={{ base: '11px', md: 'sm' }}>
                        {team.thoPhuong.toLocaleString('vi-VN')}
                      </Td>
                      <Td color="gray.700" isNumeric px={{ base: 1, md: 2 }} fontSize={{ base: '11px', md: 'sm' }}>
                        {team.lapCLB.toLocaleString('vi-VN')}
                      </Td>
                      <Td color="gray.700" isNumeric px={{ base: 1, md: 2 }} fontSize={{ base: '11px', md: 'sm' }}>
                        {team.lenGiaiDoan.toLocaleString('vi-VN')}
                      </Td>
                      <Td fontWeight="bold" color="primary.600" fontSize={{ base: '11px', md: 'sm' }} isNumeric px={{ base: 1, md: 2 }}>
                        {team.totalPoints.toLocaleString('vi-VN')}
                      </Td>
                      <Td fontWeight="semibold" color="green.600" fontSize={{ base: '11px', md: 'sm' }} isNumeric px={{ base: 1, md: 2 }}>
                        {team.averagePoints > 0 ? team.averagePoints.toLocaleString('vi-VN', { maximumFractionDigits: 2 }) : '-'}
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Card>
      </VStack>
    </Box>
  );
};

