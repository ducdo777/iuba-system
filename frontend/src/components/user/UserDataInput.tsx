import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
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

// Memoized Data Row Component
interface DataRowProps {
  item: ActivityData;
  onEdit: (item: ActivityData) => void;
  onDelete: (id: string) => void;
  calculateTotalPoints: (item: ActivityData) => number;
  isEditing: (item: ActivityData) => boolean;
  editingRow: EditableRow | null;
  formatDate: (dateString: string) => string;
}

const DataRow = memo<DataRowProps>(({ 
  item, 
  onEdit, 
  onDelete, 
  calculateTotalPoints, 
  isEditing,
  editingRow,
  formatDate,
}) => {
  return (
    <Tr display={isEditing(item) ? 'none' : 'table-row'} _hover={{ bg: 'gray.50' }}>
      <Td px={{ base: 1, md: 2 }} fontSize={{ base: '11px', md: 'sm' }} textAlign="left">
        {formatDate(item.date)}
      </Td>
      <Td px={{ base: 1, md: 2 }} fontSize={{ base: '11px', md: 'sm' }} isNumeric>
        {(item.donThuan || 0).toLocaleString('vi-VN')}
      </Td>
      <Td px={{ base: 1, md: 2 }} fontSize={{ base: '11px', md: 'sm' }} isNumeric>
        {(item.huuHieu || 0).toLocaleString('vi-VN')}
      </Td>
      <Td px={{ base: 1, md: 2 }} fontSize={{ base: '11px', md: 'sm' }} isNumeric>
        {(item.baptem || 0).toLocaleString('vi-VN')}
      </Td>
      <Td px={{ base: 1, md: 2 }} fontSize={{ base: '11px', md: 'sm' }} isNumeric>
        {(item.thoPhuong || 0).toLocaleString('vi-VN')}
      </Td>
      <Td px={{ base: 1, md: 2 }} fontSize={{ base: '11px', md: 'sm' }} isNumeric>
        {(item.lapCLB || 0).toLocaleString('vi-VN')}
      </Td>
      <Td px={{ base: 1, md: 2 }} fontSize={{ base: '11px', md: 'sm' }} isNumeric>
        {(item.lenGiaiDoan || 0).toLocaleString('vi-VN')}
      </Td>
      <Td px={{ base: 1, md: 2 }} fontSize={{ base: '11px', md: 'sm' }} isNumeric>
        {(item.hiepCauNguyenSang || 0).toLocaleString('vi-VN')}
      </Td>
      <Td px={{ base: 1, md: 2 }} isNumeric>
        <Text fontWeight="semibold" color="primary.600" fontSize={{ base: '11px', md: 'sm' }} textAlign="right">
          {calculateTotalPoints(item).toLocaleString('vi-VN')}
        </Text>
      </Td>
      <Td px={{ base: 1, md: 2 }} textAlign="center">
        <HStack spacing={{ base: 1, md: 2 }} justify="center">
          <Button
            size={{ base: 'xs', md: 'sm' }}
            colorScheme="blue"
            onClick={() => onEdit(item)}
            isDisabled={!!editingRow}
            borderRadius="md"
          >
            Sửa
          </Button>
          <Button
            size={{ base: 'xs', md: 'sm' }}
            colorScheme="red"
            onClick={() => onDelete(item.id)}
            isDisabled={!!editingRow}
            borderRadius="md"
          >
            Xóa
          </Button>
        </HStack>
      </Td>
    </Tr>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for better performance
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.item.date === nextProps.item.date &&
    prevProps.item.donThuan === nextProps.item.donThuan &&
    prevProps.item.huuHieu === nextProps.item.huuHieu &&
    prevProps.item.baptem === nextProps.item.baptem &&
    prevProps.item.thoPhuong === nextProps.item.thoPhuong &&
    prevProps.item.lapCLB === nextProps.item.lapCLB &&
    prevProps.item.lenGiaiDoan === nextProps.item.lenGiaiDoan &&
    prevProps.item.hiepCauNguyenSang === nextProps.item.hiepCauNguyenSang &&
    prevProps.calculateTotalPoints(prevProps.item) === nextProps.calculateTotalPoints(nextProps.item) &&
    prevProps.isEditing(prevProps.item) === nextProps.isEditing(nextProps.item) &&
    prevProps.editingRow?.id === nextProps.editingRow?.id
  );
});

DataRow.displayName = 'DataRow';

// Memoized Summary Row Component
interface SummaryRowProps {
  totals: {
    donThuan: number;
    huuHieu: number;
    baptem: number;
    thoPhuong: number;
    lapCLB: number;
    lenGiaiDoan: number;
    hiepCauNguyenSang: number;
    totalPoints: number;
  };
}

const SummaryRow = memo<SummaryRowProps>(({ totals }) => {
  return (
    <Tfoot bg="gray.100">
      <Tr>
        <Th fontSize={{ base: '10px', md: '11px', lg: '12px' }} fontWeight="bold" color="gray.900" px={{ base: 1, md: 2 }} textAlign="left">
          TỔNG KẾT
        </Th>
        <Td fontWeight="bold" color="gray.900" px={{ base: 1, md: 2 }} fontSize={{ base: '11px', md: 'sm' }} isNumeric>
          {totals.donThuan.toLocaleString('vi-VN')}
        </Td>
        <Td fontWeight="bold" color="gray.900" px={{ base: 1, md: 2 }} fontSize={{ base: '11px', md: 'sm' }} isNumeric>
          {totals.huuHieu.toLocaleString('vi-VN')}
        </Td>
        <Td fontWeight="bold" color="gray.900" px={{ base: 1, md: 2 }} fontSize={{ base: '11px', md: 'sm' }} isNumeric>
          {totals.baptem.toLocaleString('vi-VN')}
        </Td>
        <Td fontWeight="bold" color="gray.900" px={{ base: 1, md: 2 }} fontSize={{ base: '11px', md: 'sm' }} isNumeric>
          {totals.thoPhuong.toLocaleString('vi-VN')}
        </Td>
        <Td fontWeight="bold" color="gray.900" px={{ base: 1, md: 2 }} fontSize={{ base: '11px', md: 'sm' }} isNumeric>
          {totals.lapCLB.toLocaleString('vi-VN')}
        </Td>
        <Td fontWeight="bold" color="gray.900" px={{ base: 1, md: 2 }} fontSize={{ base: '11px', md: 'sm' }} isNumeric>
          {totals.lenGiaiDoan.toLocaleString('vi-VN')}
        </Td>
        <Td fontWeight="bold" color="gray.900" px={{ base: 1, md: 2 }} fontSize={{ base: '11px', md: 'sm' }} isNumeric>
          {totals.hiepCauNguyenSang.toLocaleString('vi-VN')}
        </Td>
        <Td fontWeight="bold" color="primary.600" fontSize={{ base: '11px', md: 'sm' }} px={{ base: 1, md: 2 }} isNumeric>
          {totals.totalPoints.toLocaleString('vi-VN')}
        </Td>
        <Td px={{ base: 1, md: 2 }}></Td>
      </Tr>
    </Tfoot>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.totals.donThuan === nextProps.totals.donThuan &&
    prevProps.totals.huuHieu === nextProps.totals.huuHieu &&
    prevProps.totals.baptem === nextProps.totals.baptem &&
    prevProps.totals.thoPhuong === nextProps.totals.thoPhuong &&
    prevProps.totals.lapCLB === nextProps.totals.lapCLB &&
    prevProps.totals.lenGiaiDoan === nextProps.totals.lenGiaiDoan &&
    prevProps.totals.hiepCauNguyenSang === nextProps.totals.hiepCauNguyenSang &&
    prevProps.totals.totalPoints === nextProps.totals.totalPoints
  );
});

SummaryRow.displayName = 'SummaryRow';

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

  const getDefaultConfigs = useCallback((): ActivityPointConfig[] => [
    { activityType: 'donThuan', pointPerUnit: 1 } as ActivityPointConfig,
    { activityType: 'huuHieu', pointPerUnit: 10 } as ActivityPointConfig,
    { activityType: 'baptem', pointPerUnit: 500 } as ActivityPointConfig,
    { activityType: 'thoPhuong', pointPerUnit: 1000 } as ActivityPointConfig,
    { activityType: 'lapCLB', pointPerUnit: 500 } as ActivityPointConfig,
    { activityType: 'lenGiaiDoan', pointPerUnit: 1000 } as ActivityPointConfig,
    { activityType: 'hiepCauNguyenSang', pointPerUnit: 10 } as ActivityPointConfig,
  ], []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      // Load both APIs in parallel for better performance
      const [dataList, configs] = await Promise.all([
        activityDataService.getAll(),
        activityPointsService.getAll().catch(() => []),
      ]);
      setData(dataList);
      setPointConfigs(configs.length > 0 ? configs : getDefaultConfigs());
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      // Set default configs on error
      setPointConfigs(getDefaultConfigs());
    } finally {
      setLoading(false);
    }
  }, [getDefaultConfigs, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getPointPerUnit = useCallback((activityType: string): number => {
    const config = pointConfigs.find(c => c.activityType === activityType);
    return config?.pointPerUnit || 0;
  }, [pointConfigs]);

  const calculateTotalPoints = useCallback((item: ActivityData | EditableRow): number => {
    const donThuan = (item.donThuan || 0) * getPointPerUnit('donThuan');
    const huuHieu = (item.huuHieu || 0) * getPointPerUnit('huuHieu');
    const baptem = (item.baptem || 0) * getPointPerUnit('baptem');
    const thoPhuong = (item.thoPhuong || 0) * getPointPerUnit('thoPhuong');
    const lapCLB = (item.lapCLB || 0) * getPointPerUnit('lapCLB');
    const lenGiaiDoan = (item.lenGiaiDoan || 0) * getPointPerUnit('lenGiaiDoan');
    const hiepCauNguyenSang = (item.hiepCauNguyenSang || 0) * getPointPerUnit('hiepCauNguyenSang');

    return donThuan + huuHieu + baptem + thoPhuong + lapCLB + lenGiaiDoan + hiepCauNguyenSang;
  }, [getPointPerUnit]);

  const calculateTotals = useCallback(() => {
    const totals = {
      donThuan: 0,
      huuHieu: 0,
      baptem: 0,
      thoPhuong: 0,
      lapCLB: 0,
      lenGiaiDoan: 0,
      hiepCauNguyenSang: 0,
      totalPoints: 0,
    };

    data.forEach((item) => {
      totals.donThuan += item.donThuan || 0;
      totals.huuHieu += item.huuHieu || 0;
      totals.baptem += item.baptem || 0;
      totals.thoPhuong += item.thoPhuong || 0;
      totals.lapCLB += item.lapCLB || 0;
      totals.lenGiaiDoan += item.lenGiaiDoan || 0;
      totals.hiepCauNguyenSang += item.hiepCauNguyenSang || 0;
      totals.totalPoints += calculateTotalPoints(item);
    });

    return totals;
  }, [data, calculateTotalPoints]);

  const handleAddNew = () => {
    const newRow: EditableRow = {
      date: new Date().toISOString().split('T')[0],
      donThuan: 0,
      huuHieu: 0,
      baptem: 0,
      thoPhuong: 0,
      lapCLB: 0,
      lenGiaiDoan: 0,
      hiepCauNguyenSang: 0,
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
      hiepCauNguyenSang: item.hiepCauNguyenSang || 0,
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
    
    // Optimistic update: Update UI immediately
    const saveData: CreateActivityDataDto = {
      date: row.date,
      donThuan: row.donThuan || 0,
      huuHieu: row.huuHieu || 0,
      baptem: row.baptem || 0,
      thoPhuong: row.thoPhuong || 0,
      lapCLB: row.lapCLB || 0,
      lenGiaiDoan: row.lenGiaiDoan || 0,
      hiepCauNguyenSang: row.hiepCauNguyenSang || 0,
    };

    // Create optimistic data entry
    const optimisticEntry: ActivityData = {
      id: row.id || `temp-${Date.now()}`,
      ...saveData,
      team: undefined,
      user: undefined,
    };

    try {
      if (row.isNew && !row.id) {
        // Optimistic: Add to list immediately
        setData(prev => [...prev, optimisticEntry]);
        setEditingRow(null);
        
        // Then save to server
        const saved = await activityDataService.create(saveData);
        
        // Replace temp with real data
        setData(prev => prev.map(item => 
          item.id === optimisticEntry.id ? saved : item
        ));
        
        toast({
          title: 'Thành công',
          description: 'Đã thêm dữ liệu',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } else if (row.id) {
        // Optimistic: Update in list immediately
        setData(prev => prev.map(item => 
          item.id === row.id ? { ...item, ...saveData } : item
        ));
        setEditingRow(null);
        
        // Then save to server
        await activityDataService.update(row.id, saveData);
        
        toast({
          title: 'Thành công',
          description: 'Đã cập nhật dữ liệu',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      }
      
      // Reload to ensure consistency (in background)
      loadData().catch(() => {
        // Silent fail - optimistic update already shown
      });
    } catch (error: any) {
      // Rollback optimistic update on error
      loadData();
      
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
    
    // Optimistic update: Remove from UI immediately
    const deletedItem = data.find(item => item.id === deleteId);
    setData(prev => prev.filter(item => item.id !== deleteId));
    onClose();
    setDeleteId(null);
    
    try {
      await activityDataService.delete(deleteId);
      toast({
        title: 'Thành công',
        description: 'Đã xóa dữ liệu',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      
      // Reload to ensure consistency (in background)
      loadData().catch(() => {
        // Silent fail - optimistic update already shown
      });
    } catch (error) {
      // Rollback optimistic update on error
      if (deletedItem) {
        setData(prev => [...prev, deletedItem].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ));
      }
      
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa dữ liệu',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
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

  const handleNumberChange = (field: keyof EditableRow, value: string) => {
    // Parse the value properly
    // If empty string, set to 0
    // Otherwise parse as integer
    const numValue = value === '' ? 0 : parseInt(value, 10);
    // Only update if it's a valid number (or 0 for empty)
    if (!isNaN(numValue) && numValue >= 0) {
      handleFieldChange(field, numValue);
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

  const isEditing = (item: ActivityData | EditableRow): boolean => {
    if ('isEditing' in item && item.isEditing) return true;
    if ('id' in item && editingRow?.id === item.id) return true;
    return !!(editingRow?.isNew && !item.id);
  };

  // Wrapper function for DataRow that only accepts ActivityData
  const isEditingDataRow = useCallback((item: ActivityData): boolean => {
    if ('isEditing' in item && item.isEditing) return true;
    if ('id' in item && editingRow?.id === item.id) return true;
    return !!(editingRow?.isNew && !item.id);
  }, [editingRow]);

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
    <Box w="full" p={{ base: 2, md: 4, lg: 6 }} maxW="100%" overflowX="hidden">
      <VStack spacing={4} align="stretch">
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          justify="space-between"
          align={{ base: 'flex-start', sm: 'center' }}
          gap={4}
        >
          <Heading size={{ base: 'md', md: 'lg' }} color="gray.900">
            Nhập dữ liệu hoạt động
          </Heading>
          <Button
            colorScheme="primary"
            leftIcon={<i className="fas fa-plus" />}
            onClick={handleAddNew}
            isDisabled={!!editingRow}
            size={{ base: 'sm', md: 'md' }}
          >
            Thêm dữ liệu
          </Button>
        </Flex>

        <TableContainer bg="white" borderRadius="xl" boxShadow="sm" overflow="hidden" ref={tableRef} w="full" maxW="100%">
          <Table variant="simple" size="sm" whiteSpace="nowrap" w="full">
            <Thead bg="gray.50">
              <Tr>
                <Th fontSize={{ base: '10px', md: '11px', lg: '12px' }} fontWeight="semibold" color="gray.700" px={{ base: 1, md: 2 }} textAlign="left" width={{ base: '90px', md: '110px' }}>
                  Ngày
                </Th>
                <Th fontSize={{ base: '10px', md: '11px', lg: '12px' }} fontWeight="semibold" color="gray.700" px={{ base: 1, md: 2 }} isNumeric width={{ base: '50px', md: '60px' }}>
                  Đơn
                </Th>
                <Th fontSize={{ base: '10px', md: '11px', lg: '12px' }} fontWeight="semibold" color="gray.700" px={{ base: 1, md: 2 }} isNumeric width={{ base: '50px', md: '60px' }}>
                  Hữu
                </Th>
                <Th fontSize={{ base: '10px', md: '11px', lg: '12px' }} fontWeight="semibold" color="gray.700" px={{ base: 1, md: 2 }} isNumeric width={{ base: '50px', md: '60px' }}>
                  Bap
                </Th>
                <Th fontSize={{ base: '10px', md: '11px', lg: '12px' }} fontWeight="semibold" color="gray.700" px={{ base: 1, md: 2 }} isNumeric width={{ base: '50px', md: '60px' }}>
                  Thờ
                </Th>
                <Th fontSize={{ base: '10px', md: '11px', lg: '12px' }} fontWeight="semibold" color="gray.700" px={{ base: 1, md: 2 }} isNumeric width={{ base: '50px', md: '60px' }}>
                  CLB
                </Th>
                <Th fontSize={{ base: '10px', md: '11px', lg: '12px' }} fontWeight="semibold" color="gray.700" px={{ base: 1, md: 2 }} isNumeric width={{ base: '50px', md: '60px' }}>
                  GĐ
                </Th>
                <Th fontSize={{ base: '10px', md: '11px', lg: '12px' }} fontWeight="semibold" color="gray.700" px={{ base: 1, md: 2 }} isNumeric width={{ base: '50px', md: '60px' }}>
                  NHCN
                </Th>
                <Th fontSize={{ base: '10px', md: '11px', lg: '12px' }} fontWeight="semibold" color="gray.700" px={{ base: 1, md: 2 }} isNumeric width={{ base: '70px', md: '90px' }}>
                  Tổng
                </Th>
                <Th fontSize={{ base: '10px', md: '11px', lg: '12px' }} fontWeight="semibold" color="gray.700" px={{ base: 1, md: 2 }} textAlign="center" width={{ base: '100px', md: '120px' }}>
                  Tác
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {editingRow && (
                <Tr bg={editingRow.isNew ? 'blue.50' : 'yellow.50'}>
                  <Td px={{ base: 1, md: 2 }}>
                    <Input
                      type="date"
                      size="sm"
                      value={editingRow.date}
                      onChange={(e) => handleFieldChange('date', e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, editingRow)}
                      autoFocus
                      required
                      fontSize={{ base: '11px', md: 'sm' }}
                      w="full"
                      maxW="100%"
                      minW="0"
                    />
                  </Td>
                  <Td px={{ base: 1, md: 2 }} isNumeric>
                    <Input
                      type="number"
                      size="sm"
                      min="0"
                      value={editingRow.donThuan ?? 0}
                      onChange={(e) => handleNumberChange('donThuan', e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, editingRow)}
                      fontSize={{ base: '11px', md: 'sm' }}
                      w="full"
                      maxW="100%"
                      minW="0"
                      textAlign="right"
                      px={{ base: 1, md: 2 }}
                    />
                  </Td>
                  <Td px={{ base: 1, md: 2 }} isNumeric>
                    <Input
                      type="number"
                      size="sm"
                      min="0"
                      value={editingRow.huuHieu ?? 0}
                      onChange={(e) => handleNumberChange('huuHieu', e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, editingRow)}
                      fontSize={{ base: '11px', md: 'sm' }}
                      w="full"
                      maxW="100%"
                      minW="0"
                      textAlign="right"
                      px={{ base: 1, md: 2 }}
                    />
                  </Td>
                  <Td px={{ base: 1, md: 2 }} isNumeric>
                    <Input
                      type="number"
                      size="sm"
                      min="0"
                      value={editingRow.baptem ?? 0}
                      onChange={(e) => handleNumberChange('baptem', e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, editingRow)}
                      fontSize={{ base: '11px', md: 'sm' }}
                      w="full"
                      maxW="100%"
                      minW="0"
                      textAlign="right"
                      px={{ base: 1, md: 2 }}
                    />
                  </Td>
                  <Td px={{ base: 1, md: 2 }} isNumeric>
                    <Input
                      type="number"
                      size="sm"
                      min="0"
                      value={editingRow.thoPhuong ?? 0}
                      onChange={(e) => handleNumberChange('thoPhuong', e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, editingRow)}
                      fontSize={{ base: '11px', md: 'sm' }}
                      w="full"
                      maxW="100%"
                      minW="0"
                      textAlign="right"
                      px={{ base: 1, md: 2 }}
                    />
                  </Td>
                  <Td px={{ base: 1, md: 2 }} isNumeric>
                    <Input
                      type="number"
                      size="sm"
                      min="0"
                      value={editingRow.lapCLB ?? 0}
                      onChange={(e) => handleNumberChange('lapCLB', e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, editingRow)}
                      fontSize={{ base: '11px', md: 'sm' }}
                      w="full"
                      maxW="100%"
                      minW="0"
                      textAlign="right"
                      px={{ base: 1, md: 2 }}
                    />
                  </Td>
                  <Td px={{ base: 1, md: 2 }} isNumeric>
                    <Input
                      type="number"
                      size="sm"
                      min="0"
                      value={editingRow.lenGiaiDoan ?? 0}
                      onChange={(e) => handleNumberChange('lenGiaiDoan', e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, editingRow)}
                      fontSize={{ base: '11px', md: 'sm' }}
                      w="full"
                      maxW="100%"
                      minW="0"
                      textAlign="right"
                      px={{ base: 1, md: 2 }}
                    />
                  </Td>
                  <Td px={{ base: 1, md: 2 }} isNumeric>
                    <Input
                      type="number"
                      size="sm"
                      min="0"
                      value={editingRow.hiepCauNguyenSang ?? 0}
                      onChange={(e) => handleNumberChange('hiepCauNguyenSang', e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, editingRow)}
                      fontSize={{ base: '11px', md: 'sm' }}
                      w="full"
                      maxW="100%"
                      minW="0"
                      textAlign="right"
                      px={{ base: 1, md: 2 }}
                    />
                  </Td>
                  <Td px={{ base: 1, md: 2 }} isNumeric>
                    <Text fontWeight="semibold" color="primary.600" fontSize={{ base: '11px', md: 'sm' }} textAlign="right">
                      {calculateTotalPoints(editingRow).toLocaleString('vi-VN')}
                    </Text>
                  </Td>
                  <Td px={{ base: 1, md: 2 }} textAlign="center">
                    <HStack spacing={{ base: 1, md: 2 }} justify="center" flexWrap="nowrap">
                      <Button
                        size={{ base: 'xs', md: 'sm' }}
                        colorScheme="green"
                        onClick={() => handleSave(editingRow)}
                        isDisabled={saving === (editingRow.id || 'new')}
                        isLoading={saving === (editingRow.id || 'new')}
                        borderRadius="md"
                        fontSize={{ base: '10px', md: 'sm' }}
                        px={{ base: 2, md: 3 }}
                      >
                        Lưu
                      </Button>
                      <Button
                        size={{ base: 'xs', md: 'sm' }}
                        variant="outline"
                        onClick={handleCancel}
                        isDisabled={saving === (editingRow.id || 'new')}
                        borderRadius="md"
                        fontSize={{ base: '10px', md: 'sm' }}
                        px={{ base: 2, md: 3 }}
                      >
                        Hủy
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
                  <DataRow
                    key={item.id}
                    item={item}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    calculateTotalPoints={calculateTotalPoints}
                    isEditing={isEditingDataRow}
                    editingRow={editingRow}
                    formatDate={formatDate}
                  />
                ))
              )}
            </Tbody>
            {data.length > 0 && (
              <SummaryRow totals={calculateTotals()} />
            )}
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
