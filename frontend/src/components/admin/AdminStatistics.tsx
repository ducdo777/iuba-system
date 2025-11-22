import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Flex,
  Heading,
  Button,
  Spinner,
  Text,
  Input,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Card,
  CardBody,
  VStack,
  HStack,
  Grid,
} from '@chakra-ui/react';
import { statisticsService, TeamStatistics } from '../../services/statistics';
import { teamsService, Team } from '../../services/teams';

export const AdminStatistics: React.FC = () => {
  const [stats, setStats] = useState<TeamStatistics[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);

  const loadStatistics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await statisticsService.getByTeam(
        selectedTeam || undefined,
        startDate || undefined,
        endDate || undefined
      );
      setStats(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedTeam, startDate, endDate]);

  useEffect(() => {
    loadTeams();
    loadStatistics();
  }, [loadStatistics]);

  const loadTeams = async () => {
    try {
      const data = await teamsService.getAll();
      setTeams(data);
    } catch (error) {
      console.error('Error loading teams:', error);
    }
  };

  const handleFilter = () => {
    loadStatistics();
  };

  if (loading) {
    return (
      <Flex minH="400px" align="center" justify="center">
        <Box textAlign="center">
          <Spinner size="xl" color="primary.600"  mb={4} />
          <Text color="gray.600">Đang tải...</Text>
        </Box>
      </Flex>
    );
  }

  return (
    <Box w="full" p={{ base: 4, md: 6, lg: 8 }}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg" color="gray.900">
          Thống kê
        </Heading>

        <Card>
          <CardBody>
            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }}
              gap={4}
            >
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Từ ngày"
              />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="Đến ngày"
              />
              <Select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                placeholder="Tất cả Teams"
              >
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.teamCode} - {team.teamName}
                  </option>
                ))}
              </Select>
              <Button
                colorScheme="primary"
                leftIcon={<i className="fas fa-search" />}
                onClick={handleFilter}
              >
                Xem thống kê
              </Button>
            </Grid>
          </CardBody>
        </Card>

        <VStack spacing={6} align="stretch">
          {stats.map((teamStat) => (
            <Card key={teamStat.teamId}>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Heading size="md" color="gray.900" mb={2}>
                      {teamStat.teamName} ({teamStat.teamCode})
                    </Heading>
                    <Text color="gray.600">
                      <strong>Số thành viên:</strong> {teamStat.totalMembers}
                    </Text>
                  </Box>

                  <TableContainer>
                    <Table variant="simple" size="sm">
                      <Thead bg="gray.50">
                        <Tr>
                          <Th fontSize="xs" fontWeight="semibold" color="gray.700">
                            Thành viên
                          </Th>
                          <Th fontSize="xs" fontWeight="semibold" color="gray.700">
                            Đơn thuần
                          </Th>
                          <Th fontSize="xs" fontWeight="semibold" color="gray.700">
                            Hữu hiệu
                          </Th>
                          <Th fontSize="xs" fontWeight="semibold" color="gray.700">
                            Baptem
                          </Th>
                          <Th fontSize="xs" fontWeight="semibold" color="gray.700">
                            Thờ phượng
                          </Th>
                          <Th fontSize="xs" fontWeight="semibold" color="gray.700">
                            Lập CLB
                          </Th>
                          <Th fontSize="xs" fontWeight="semibold" color="gray.700">
                            Lên giai đoạn
                          </Th>
                          <Th fontSize="xs" fontWeight="semibold" color="gray.700">
                            Tổng
                          </Th>
                          <Th fontSize="xs" fontWeight="semibold" color="gray.700">
                            Số bản ghi
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {teamStat.byUser.map((user) => (
                          <Tr key={user.userId} _hover={{ bg: 'gray.50' }}>
                            <Td fontWeight="medium" color="gray.900">
                              {user.fullName}
                            </Td>
                            <Td color="gray.700">{user.donThuan}</Td>
                            <Td color="gray.700">{user.huuHieu}</Td>
                            <Td color="gray.700">{user.baptem}</Td>
                            <Td color="gray.700">{user.thoPhuong}</Td>
                            <Td color="gray.700">{user.lapCLB}</Td>
                            <Td color="gray.700">{user.lenGiaiDoan}</Td>
                            <Td fontWeight="bold" color="gray.900">
                              {user.total}
                            </Td>
                            <Td color="gray.700">{user.recordCount}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                      <Tbody bg="primary.50" borderTop="2px" borderColor="primary.600">
                        <Tr>
                          <Td fontWeight="bold" color="gray.900">
                            TỔNG
                          </Td>
                          <Td fontWeight="bold" color="gray.900">
                            {teamStat.summary.donThuan}
                          </Td>
                          <Td fontWeight="bold" color="gray.900">
                            {teamStat.summary.huuHieu}
                          </Td>
                          <Td fontWeight="bold" color="gray.900">
                            {teamStat.summary.baptem}
                          </Td>
                          <Td fontWeight="bold" color="gray.900">
                            {teamStat.summary.thoPhuong}
                          </Td>
                          <Td fontWeight="bold" color="gray.900">
                            {teamStat.summary.lapCLB}
                          </Td>
                          <Td fontWeight="bold" color="gray.900">
                            {teamStat.summary.lenGiaiDoan}
                          </Td>
                          <Td fontWeight="bold" color="primary.600">
                            {teamStat.summary.total}
                          </Td>
                          <Td fontWeight="bold" color="gray.900">
                            {teamStat.summary.recordCount}
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </TableContainer>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </VStack>
      </VStack>
    </Box>
  );
};
