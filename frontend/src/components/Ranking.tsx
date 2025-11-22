import React, { useEffect, useState } from 'react';
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
  rank: number;
}

export const Ranking: React.FC = () => {
  const [overview, setOverview] = useState<StatisticsOverview | null>(null);
  const [pointConfigs, setPointConfigs] = useState<ActivityPointConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [rankings, setRankings] = useState<TeamRanking[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
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
  };

  const getDefaultConfigs = (): ActivityPointConfig[] => [
    { activityType: 'donThuan', pointPerUnit: 1 } as ActivityPointConfig,
    { activityType: 'huuHieu', pointPerUnit: 10 } as ActivityPointConfig,
    { activityType: 'baptem', pointPerUnit: 500 } as ActivityPointConfig,
    { activityType: 'thoPhuong', pointPerUnit: 1000 } as ActivityPointConfig,
    { activityType: 'lapCLB', pointPerUnit: 500 } as ActivityPointConfig,
    { activityType: 'lenGiaiDoan', pointPerUnit: 1000 } as ActivityPointConfig,
  ];

  const getPointPerUnit = (activityType: string): number => {
    const config = pointConfigs.find(c => c.activityType === activityType);
    return config?.pointPerUnit || 0;
  };

  const calculateTeamPoints = (team: StatisticsOverview['byTeam'][0]): number => {
    const donThuan = team.donThuan * getPointPerUnit('donThuan');
    const huuHieu = team.huuHieu * getPointPerUnit('huuHieu');
    const baptem = team.baptem * getPointPerUnit('baptem');
    const thoPhuong = team.thoPhuong * getPointPerUnit('thoPhuong');
    const lapCLB = team.lapCLB * getPointPerUnit('lapCLB');
    const lenGiaiDoan = team.lenGiaiDoan * getPointPerUnit('lenGiaiDoan');

    return donThuan + huuHieu + baptem + thoPhuong + lapCLB + lenGiaiDoan;
  };

  useEffect(() => {
    if (overview && pointConfigs.length > 0) {
      const teamRankings: TeamRanking[] = overview.byTeam
        .map((team) => ({
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
          totalPoints: calculateTeamPoints(team),
          rank: 0,
        }))
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .slice(0, 10)
        .map((team, index) => ({
          ...team,
          rank: index + 1,
        }));

      setRankings(teamRankings);
    }
  }, [overview, pointConfigs]);

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
    <Box w="full" p={{ base: 4, md: 6, lg: 8 }}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="xl" color="gray.900" mb={2}>
            Bảng xếp hạng
          </Heading>
          <Text color="gray.600" fontSize="md">
            Top 10 Teams có tổng điểm cao nhất
          </Text>
        </Box>

        <Card borderRadius="2xl" boxShadow="lg" overflow="hidden">
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
          <TableContainer>
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th textTransform="uppercase" fontSize="xs" fontWeight="bold" color="gray.700" width="80px">
                    Hạng
                  </Th>
                  <Th textTransform="uppercase" fontSize="xs" fontWeight="bold" color="gray.700">
                    Team
                  </Th>
                  <Th textTransform="uppercase" fontSize="xs" fontWeight="bold" color="gray.700">
                    Mã Team
                  </Th>
                  <Th textTransform="uppercase" fontSize="xs" fontWeight="bold" color="gray.700" isNumeric>
                    Thành viên
                  </Th>
                  <Th textTransform="uppercase" fontSize="xs" fontWeight="bold" color="gray.700" isNumeric>
                    Đơn thuần
                  </Th>
                  <Th textTransform="uppercase" fontSize="xs" fontWeight="bold" color="gray.700" isNumeric>
                    Hữu hiệu
                  </Th>
                  <Th textTransform="uppercase" fontSize="xs" fontWeight="bold" color="gray.700" isNumeric>
                    Baptem
                  </Th>
                  <Th textTransform="uppercase" fontSize="xs" fontWeight="bold" color="gray.700" isNumeric>
                    Thờ phượng
                  </Th>
                  <Th textTransform="uppercase" fontSize="xs" fontWeight="bold" color="gray.700" isNumeric>
                    Lập CLB
                  </Th>
                  <Th textTransform="uppercase" fontSize="xs" fontWeight="bold" color="gray.700" isNumeric>
                    Lên giai đoạn
                  </Th>
                  <Th textTransform="uppercase" fontSize="xs" fontWeight="bold" color="gray.700" isNumeric>
                    Tổng điểm
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {rankings.length === 0 ? (
                  <Tr>
                    <Td colSpan={11} textAlign="center" py={8} color="gray.500">
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
                      <Td>
                        <Flex align="center" gap={2}>
                          {getRankIcon(team.rank) && (
                            <Text fontSize="xl">{getRankIcon(team.rank)}</Text>
                          )}
                          <Badge
                            colorScheme={getRankBadgeColor(team.rank)}
                            variant="solid"
                            fontSize="sm"
                            px={2}
                            py={1}
                            borderRadius="md"
                          >
                            #{team.rank}
                          </Badge>
                        </Flex>
                      </Td>
                      <Td fontWeight="semibold" color="gray.900">
                        {team.teamName}
                      </Td>
                      <Td color="gray.700" fontFamily="mono">
                        {team.teamCode}
                      </Td>
                      <Td color="gray.700" isNumeric>
                        {team.totalMembers || '-'}
                      </Td>
                      <Td color="gray.700" isNumeric>
                        {team.donThuan.toLocaleString('vi-VN')}
                      </Td>
                      <Td color="gray.700" isNumeric>
                        {team.huuHieu.toLocaleString('vi-VN')}
                      </Td>
                      <Td color="gray.700" isNumeric>
                        {team.baptem.toLocaleString('vi-VN')}
                      </Td>
                      <Td color="gray.700" isNumeric>
                        {team.thoPhuong.toLocaleString('vi-VN')}
                      </Td>
                      <Td color="gray.700" isNumeric>
                        {team.lapCLB.toLocaleString('vi-VN')}
                      </Td>
                      <Td color="gray.700" isNumeric>
                        {team.lenGiaiDoan.toLocaleString('vi-VN')}
                      </Td>
                      <Td fontWeight="bold" color="primary.600" fontSize="md" isNumeric>
                        {team.totalPoints.toLocaleString('vi-VN')}
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

