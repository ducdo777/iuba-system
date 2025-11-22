import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Flex,
  Heading,
  Button,
  Spinner,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Input,
  HStack,
  VStack,
  Card,
  CardBody,
  Grid,
  useToast,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { activityDataService, ActivityData, CreateActivityDataDto } from '../../services/activityData';
import { statisticsService, TeamStatistics } from '../../services/statistics';

interface EditableRow extends CreateActivityDataDto {
  id?: string;
  isNew?: boolean;
  isEditing?: boolean;
}

export const UserDataInput: React.FC = () => {
  const [data, setData] = useState<ActivityData[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingRow, setEditingRow] = useState<EditableRow | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const { open, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    loadData();
    loadTeamStats();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const dataList = await activityDataService.getAll();
      setData(dataList);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTeamStats = async () => {
    try {
      const stats = await statisticsService.getMyTeam();
      setTeamStats(stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleAddNew = () => {
    const newRow: EditableRow = {
      date: new Date().toISOString().split('T')[0],
      donThuan: 0,
      huuHieu: 0,
      baptem: 0,
      thoPhuong: 0,
      lapCLB: 0,
      lenGiaiDoan: 0,
      isNew: true,
      isEditing: true,
    };
    setEditingRow(newRow);
    setTimeout(() => {
      tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  };

  const handleEdit = (item: ActivityData) => {
    setEditingRow({
      id: item.id,
      date: item.date,
      donThuan: item.donThuan || 0,
      huuHieu: item.huuHieu || 0,
      baptem: item.baptem || 0,
      thoPhuong: item.thoPhuong || 0,
      lapCLB: item.lapCLB || 0,
      lenGiaiDoan: item.lenGiaiDoan || 0,
      isEditing: true,
    });
  };

  const handleCancel = () => {
    setEditingRow(null);
  };

  const handleSave = async (row: EditableRow) => {
    if (!row.date) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn ngày',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setSaving(row.id || 'new');
    try {
      const saveData: CreateActivityDataDto = {
        date: row.date,
        donThuan: row.donThuan || 0,
        huuHieu: row.huuHieu || 0,
        baptem: row.baptem || 0,
        thoPhuong: row.thoPhuong || 0,
        lapCLB: row.lapCLB || 0,
        lenGiaiDoan: row.lenGiaiDoan || 0,
      };

      if (row.isNew && !row.id) {
        await activityDataService.create(saveData);
        toast({
          title: 'Thành công',
          description: 'Đã thêm dữ liệu',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else if (row.id) {
        await activityDataService.update(row.id, saveData);
        toast({
          title: 'Thành công',
          description: 'Đã cập nhật dữ liệu',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }

      setEditingRow(null);
      loadData();
      loadTeamStats();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Lỗi khi lưu dữ liệu',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSaving(null);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    onOpen();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await activityDataService.delete(deleteId);
      toast({
        title: 'Thành công',
        description: 'Đã xóa dữ liệu',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      loadData();
      loadTeamStats();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa dữ liệu',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onClose();
      setDeleteId(null);
    }
  };

  const handleFieldChange = (field: keyof EditableRow, value: any) => {
    if (editingRow) {
      setEditingRow({
        ...editingRow,
        [field]: value,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, row: EditableRow) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave(row);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const isEditing = (item: ActivityData | EditableRow) => {
    if ('isEditing' in item && item.isEditing) return true;
    if ('id' in item && editingRow?.id === item.id) return true;
    return editingRow?.isNew && !item.id;
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
      <VStack gap={6} align="stretch">
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          justify="space-between"
          align={{ base: 'flex-start', sm: 'center' }}
          gap={4}
        >
          <Heading size="lg" color="gray.900">
            Nhập dữ liệu hoạt động
          </Heading>
          <Button
            colorScheme="primary"
            leftIcon={<i className="fas fa-plus" />}
            onClick={handleAddNew}
            isDisabled={!!editingRow}
          >
            Thêm dữ liệu
          </Button>
        </Flex>

        <TableContainer bg="white" borderRadius="xl" boxShadow="sm" overflow="hidden" ref={tableRef}>
          <Table variant="simple" size="sm">
            <Thead bg="gray.50">
              <Tr>
                <Th fontSize="xs" fontWeight="semibold" color="gray.700">
                  Ngày
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
                  Thao tác
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {editingRow && (
                <Tr bg={editingRow.isNew ? 'blue.50' : 'yellow.50'}>
                  <Td>
                    <Input
                      type="date"
                      size="sm"
                      value={editingRow.date}
                      onChange={(e) => handleFieldChange('date', e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, editingRow)}
                      autoFocus
                      required
                    />
                  </Td>
                  <Td>
                    <Input
                      type="number"
                      size="sm"
                      min="0"
                      value={editingRow.donThuan}
                      onChange={(e) => handleFieldChange('donThuan', parseInt(e.target.value) || 0)}
                      onKeyDown={(e) => handleKeyDown(e, editingRow)}
                    />
                  </Td>
                  <Td>
                    <Input
                      type="number"
                      size="sm"
                      min="0"
                      value={editingRow.huuHieu}
                      onChange={(e) => handleFieldChange('huuHieu', parseInt(e.target.value) || 0)}
                      onKeyDown={(e) => handleKeyDown(e, editingRow)}
                    />
                  </Td>
                  <Td>
                    <Input
                      type="number"
                      size="sm"
                      min="0"
                      value={editingRow.baptem}
                      onChange={(e) => handleFieldChange('baptem', parseInt(e.target.value) || 0)}
                      onKeyDown={(e) => handleKeyDown(e, editingRow)}
                    />
                  </Td>
                  <Td>
                    <Input
                      type="number"
                      size="sm"
                      min="0"
                      value={editingRow.thoPhuong}
                      onChange={(e) => handleFieldChange('thoPhuong', parseInt(e.target.value) || 0)}
                      onKeyDown={(e) => handleKeyDown(e, editingRow)}
                    />
                  </Td>
                  <Td>
                    <Input
                      type="number"
                      size="sm"
                      min="0"
                      value={editingRow.lapCLB}
                      onChange={(e) => handleFieldChange('lapCLB', parseInt(e.target.value) || 0)}
                      onKeyDown={(e) => handleKeyDown(e, editingRow)}
                    />
                  </Td>
                  <Td>
                    <Input
                      type="number"
                      size="sm"
                      min="0"
                      value={editingRow.lenGiaiDoan}
                      onChange={(e) => handleFieldChange('lenGiaiDoan', parseInt(e.target.value) || 0)}
                      onKeyDown={(e) => handleKeyDown(e, editingRow)}
                    />
                  </Td>
                  <Td>
                    <HStack gap={2}>
                      <Button
                        size="sm"
                        colorScheme="green"
                        onClick={() => handleSave(editingRow)}
                        isDisabled={saving === (editingRow.id || 'new')}
                        isLoading={saving === (editingRow.id || 'new')}
                        title="Lưu (Enter)"
                      >
                        <i className="fas fa-check" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancel}
                        isDisabled={saving === (editingRow.id || 'new')}
                        title="Hủy (Esc)"
                      >
                        <i className="fas fa-times" />
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              )}

              {data.length === 0 && !editingRow ? (
                <Tr>
                  <Td colSpan={8} textAlign="center" py={8} color="gray.500">
                    Chưa có dữ liệu. Click &quot;Thêm dữ liệu&quot; để bắt đầu nhập.
                  </Td>
                </Tr>
              ) : (
                data.map((item) => (
                  <Tr key={item.id} display={isEditing(item) ? 'none' : 'table-row'} _hover={{ bg: 'gray.50' }}>
                    <Td>{formatDate(item.date)}</Td>
                    <Td>{item.donThuan || 0}</Td>
                    <Td>{item.huuHieu || 0}</Td>
                    <Td>{item.baptem || 0}</Td>
                    <Td>{item.thoPhuong || 0}</Td>
                    <Td>{item.lapCLB || 0}</Td>
                    <Td>{item.lenGiaiDoan || 0}</Td>
                    <Td>
                      <HStack gap={2}>
                        <Button
                          size="sm"
                          colorScheme="primary"
                          onClick={() => handleEdit(item)}
                          isDisabled={!!editingRow}
                          title="Sửa"
                        >
                          <i className="fas fa-edit" />
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDeleteClick(item.id)}
                          isDisabled={!!editingRow}
                          title="Xóa"
                        >
                          <i className="fas fa-trash" />
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </TableContainer>

        {teamStats && (
          <Box>
            <Heading size="md" color="gray.900" mb={4}>
              Thống kê của Team {teamStats.teamName}
            </Heading>
            <Grid
              templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
              gap={4}
            >
              {[
                { value: teamStats.summary.donThuan, label: 'Đơn thuần', icon: 'fas fa-hand-holding-heart', color: 'pink' },
                { value: teamStats.summary.huuHieu, label: 'Hữu hiệu', icon: 'fas fa-check-circle', color: 'green' },
                { value: teamStats.summary.baptem, label: 'Baptem', icon: 'fas fa-water', color: 'blue' },
                { value: teamStats.summary.thoPhuong, label: 'Thờ phượng', icon: 'fas fa-praying-hands', color: 'purple' },
                { value: teamStats.summary.lapCLB, label: 'Lập CLB', icon: 'fas fa-users', color: 'indigo' },
                { value: teamStats.summary.lenGiaiDoan, label: 'Lên giai đoạn', icon: 'fas fa-arrow-up', color: 'orange' },
                { value: teamStats.summary.total, label: 'Tổng cộng', icon: 'fas fa-list', color: 'primary', colSpan: { base: 1, sm: 2, lg: 2 } },
              ].map((stat) => (
                <Card
                  key={stat.label}
                  gridColumn={stat.colSpan}
                  bgGradient={
                    stat.color === 'primary'
                      ? 'linear(to-br, primary.500, primary.600)'
                      : undefined
                  }
                  color={stat.color === 'primary' ? 'white' : undefined}
                >
                  <CardBody>
                    <Flex align="center" gap={4}>
                      <Box
                        w={12}
                        h={12}
                        borderRadius="lg"
                        bg={stat.color === 'primary' ? 'whiteAlpha.200' : `${stat.color}.100`}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        color={stat.color === 'primary' ? 'white' : `${stat.color}.600`}
                      >
                        <i className={stat.icon} style={{ fontSize: '1.5rem' }} />
                      </Box>
                      <Box>
                        <Heading size="lg" color={stat.color === 'primary' ? 'white' : 'gray.900'}>
                          {stat.value}
                        </Heading>
                        <Text fontSize="sm" color={stat.color === 'primary' ? 'primary.100' : 'gray.600'}>
                          {stat.label}
                        </Text>
                      </Box>
                    </Flex>
                  </CardBody>
                </Card>
              ))}
            </Grid>
          </Box>
        )}

        <AlertDialog isOpen={open} leastDestructiveRef={cancelRef} onClose={onClose}>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Xóa dữ liệu
              </AlertDialogHeader>
              <AlertDialogBody>Bạn có chắc chắn muốn xóa dữ liệu này? Hành động này không thể hoàn tác.</AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Hủy
                </Button>
                <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
                  Xóa
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </VStack>
    </Box>
  );
};
