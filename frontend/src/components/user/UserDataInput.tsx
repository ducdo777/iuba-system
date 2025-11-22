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
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  Input,
  HStack,
  VStack,
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
import { activityPointsService, ActivityPointConfig } from '../../services/activityPoints';

interface EditableRow extends CreateActivityDataDto {
  id?: string;
  isNew?: boolean;
  isEditing?: boolean;
}

export const UserDataInput: React.FC = () => {
  const [data, setData] = useState<ActivityData[]>([]);
  const [pointConfigs, setPointConfigs] = useState<ActivityPointConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRow, setEditingRow] = useState<EditableRow | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    loadData();
    loadPointConfigs();
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

  const loadPointConfigs = async () => {
    try {
      const configs = await activityPointsService.getAll();
      setPointConfigs(configs);
    } catch (error) {
      console.error('Error loading point configs:', error);
      // Use default values if API fails
      setPointConfigs([
        { activityType: 'donThuan', pointPerUnit: 1 } as ActivityPointConfig,
        { activityType: 'huuHieu', pointPerUnit: 10 } as ActivityPointConfig,
        { activityType: 'baptem', pointPerUnit: 500 } as ActivityPointConfig,
        { activityType: 'thoPhuong', pointPerUnit: 1000 } as ActivityPointConfig,
        { activityType: 'lapCLB', pointPerUnit: 500 } as ActivityPointConfig,
        { activityType: 'lenGiaiDoan', pointPerUnit: 1000 } as ActivityPointConfig,
      ]);
    }
  };

  const calculateTotalPoints = (item: ActivityData | EditableRow): number => {
    const getPointPerUnit = (activityType: string): number => {
      const config = pointConfigs.find(c => c.activityType === activityType);
      return config?.pointPerUnit || 0;
    };

    const donThuan = (item.donThuan || 0) * getPointPerUnit('donThuan');
    const huuHieu = (item.huuHieu || 0) * getPointPerUnit('huuHieu');
    const baptem = (item.baptem || 0) * getPointPerUnit('baptem');
    const thoPhuong = (item.thoPhuong || 0) * getPointPerUnit('thoPhuong');
    const lapCLB = (item.lapCLB || 0) * getPointPerUnit('lapCLB');
    const lenGiaiDoan = (item.lenGiaiDoan || 0) * getPointPerUnit('lenGiaiDoan');

    return donThuan + huuHieu + baptem + thoPhuong + lapCLB + lenGiaiDoan;
  };

  const calculateTotals = () => {
    const totals = {
      donThuan: 0,
      huuHieu: 0,
      baptem: 0,
      thoPhuong: 0,
      lapCLB: 0,
      lenGiaiDoan: 0,
      totalPoints: 0,
    };

    data.forEach((item) => {
      totals.donThuan += item.donThuan || 0;
      totals.huuHieu += item.huuHieu || 0;
      totals.baptem += item.baptem || 0;
      totals.thoPhuong += item.thoPhuong || 0;
      totals.lapCLB += item.lapCLB || 0;
      totals.lenGiaiDoan += item.lenGiaiDoan || 0;
      totals.totalPoints += calculateTotalPoints(item);
    });

    return totals;
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
          <Spinner size="xl" color="primary.600"  mb={4} />
          <Text color="gray.600">Đang tải...</Text>
        </Box>
      </Flex>
    );
  }

  return (
    <Box w="full" p={{ base: 4, md: 6, lg: 8 }}>
      <VStack spacing={6} align="stretch">
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
                  Tổng điểm
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
                    <Text fontWeight="semibold" color="primary.600">
                      {calculateTotalPoints(editingRow).toLocaleString('vi-VN')}
                    </Text>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
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
                  <Td colSpan={9} textAlign="center" py={8} color="gray.500">
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
                      <Text fontWeight="semibold" color="primary.600">
                        {calculateTotalPoints(item).toLocaleString('vi-VN')}
                      </Text>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          onClick={() => handleEdit(item)}
                          isDisabled={!!editingRow}
                          borderRadius="md"
                        >
                          Sửa
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDeleteClick(item.id)}
                          isDisabled={!!editingRow}
                          borderRadius="md"
                        >
                          Xóa
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
            {data.length > 0 && (() => {
              const totals = calculateTotals();
              return (
                <Tfoot bg="gray.100">
                  <Tr>
                    <Th fontSize="xs" fontWeight="bold" color="gray.900">
                      TỔNG KẾT
                    </Th>
                    <Td fontWeight="bold" color="gray.900">
                      {totals.donThuan.toLocaleString('vi-VN')}
                    </Td>
                    <Td fontWeight="bold" color="gray.900">
                      {totals.huuHieu.toLocaleString('vi-VN')}
                    </Td>
                    <Td fontWeight="bold" color="gray.900">
                      {totals.baptem.toLocaleString('vi-VN')}
                    </Td>
                    <Td fontWeight="bold" color="gray.900">
                      {totals.thoPhuong.toLocaleString('vi-VN')}
                    </Td>
                    <Td fontWeight="bold" color="gray.900">
                      {totals.lapCLB.toLocaleString('vi-VN')}
                    </Td>
                    <Td fontWeight="bold" color="gray.900">
                      {totals.lenGiaiDoan.toLocaleString('vi-VN')}
                    </Td>
                    <Td fontWeight="bold" color="primary.600" fontSize="md">
                      {totals.totalPoints.toLocaleString('vi-VN')}
                    </Td>
                    <Td></Td>
                  </Tr>
                </Tfoot>
              );
            })()}
          </Table>
        </TableContainer>

        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
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
