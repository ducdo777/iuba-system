import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Spinner,
  Card,
  CardBody,
  Grid,
  Input,
  Select,
  Badge,
  HStack,
  VStack,
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
  useToast,
} from '@chakra-ui/react';
import { activityPointsService, ActivityPointConfig, CreateActivityPointConfigDto } from '../../services/activityPoints';

const ACTIVITY_TYPES = [
  { type: 'donThuan', name: 'Đơn thuần', icon: '📋' },
  { type: 'huuHieu', name: 'Hữu hiệu', icon: '✅' },
  { type: 'baptem', name: 'Baptem', icon: '💧' },
  { type: 'thoPhuong', name: 'Thờ phượng', icon: '🙏' },
  { type: 'lapCLB', name: 'Lập CLB', icon: '👥' },
  { type: 'lenGiaiDoan', name: 'Lên giai đoạn', icon: '📈' },
];

export const AdminPoints: React.FC = () => {
  const [configs, setConfigs] = useState<ActivityPointConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateActivityPointConfigDto>({
    activityType: 'donThuan',
    activityName: '',
    pointPerUnit: 0,
    status: 'active',
  });
  const toast = useToast();

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      setLoading(true);
      const data = await activityPointsService.getAll();
      setConfigs(data);

      if (data.length === 0) {
        await activityPointsService.initialize();
        const newData = await activityPointsService.getAll();
        setConfigs(newData);
      }
    } catch (error) {
      console.error('Error loading point configs:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải cấu hình điểm',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (config: ActivityPointConfig) => {
    setEditingId(config.id);
    setFormData({
      activityType: config.activityType,
      activityName: config.activityName,
      pointPerUnit: config.pointPerUnit,
      status: config.status,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      activityType: 'donThuan',
      activityName: '',
      pointPerUnit: 0,
      status: 'active',
    });
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await activityPointsService.update(editingId, formData);
        toast({
          title: 'Thành công',
          description: 'Cập nhật điểm thành công!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await activityPointsService.create(formData);
        toast({
          title: 'Thành công',
          description: 'Tạo cấu hình điểm thành công!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      await loadConfigs();
      handleCancel();
    } catch (error: any) {
      console.error('Error saving point config:', error);
      toast({
        title: 'Lỗi',
        description: error.response?.data?.message || 'Không thể lưu cấu hình điểm',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleQuickUpdate = async (type: string, pointPerUnit: number) => {
    try {
      const config = configs.find((c) => c.activityType === type);
      if (config) {
        await activityPointsService.updateByType(type, { pointPerUnit });
        toast({
          title: 'Thành công',
          description: 'Cập nhật điểm thành công!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await loadConfigs();
      }
    } catch (error: any) {
      console.error('Error updating point:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật điểm',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
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

  return (
    <Box w="full" p={{ base: 4, md: 6, lg: 8 }}>
      <VStack gap={6} align="stretch">
        <Box>
          <Heading size="lg" color="gray.900" mb={2}>
            ⚙️ Cấu hình Điểm Hoạt động
          </Heading>
          <Text color="gray.600">Thiết lập điểm số cho từng loại hoạt động</Text>
        </Box>

        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
          gap={4}
        >
          {ACTIVITY_TYPES.map((activity) => {
            const config = configs.find((c) => c.activityType === activity.type);
            const isEditing = editingId === config?.id;

            return (
              <Card key={activity.type} _hover={{ boxShadow: 'md' }} transition="all 0.3s">
                <CardBody>
                  <VStack gap={4} align="stretch">
                    <Flex justify="space-between" align="center" pb={4} borderBottom="1px" borderColor="gray.200">
                      <HStack gap={3}>
                        <Text fontSize="2xl">{activity.icon}</Text>
                        <Text fontWeight="semibold" color="gray.900">
                          {activity.name}
                        </Text>
                      </HStack>
                      {config && (
                        <Badge
                          colorScheme={config.status === 'active' ? 'green' : 'red'}
                          variant="subtle"
                        >
                          {config.status === 'active' ? '✓ Hoạt động' : '✗ Tạm dừng'}
                        </Badge>
                      )}
                    </Flex>

                    {isEditing ? (
                      <VStack gap={4} align="stretch">
                        <Box>
                          <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                            Tên hoạt động:
                          </Text>
                          <Input
                            value={formData.activityName}
                            onChange={(e) => setFormData({ ...formData, activityName: e.target.value })}
                            placeholder="Nhập tên hoạt động"
                          />
                        </Box>
                        <Box>
                          <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                            Điểm mỗi đơn vị:
                          </Text>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.pointPerUnit}
                            onChange={(e) =>
                              setFormData({ ...formData, pointPerUnit: parseFloat(e.target.value) || 0 })
                            }
                            placeholder="0.00"
                          />
                        </Box>
                        <Box>
                          <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                            Trạng thái:
                          </Text>
                          <Select
                            value={formData.status}
                            onChange={(e) =>
                              setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })
                            }
                          >
                            <option value="active">Hoạt động</option>
                            <option value="inactive">Tạm dừng</option>
                          </Select>
                        </Box>
                        <HStack gap={2}>
                          <Button flex={1} colorScheme="primary" onClick={handleSave}>
                            💾 Lưu
                          </Button>
                          <Button flex={1} variant="outline" onClick={handleCancel}>
                            ✗ Hủy
                          </Button>
                        </HStack>
                      </VStack>
                    ) : config ? (
                      <VStack gap={4} align="stretch">
                        <Box
                          textAlign="center"
                          py={6}
                          bgGradient="linear(to-br, primary.50, primary.100)"
                          borderRadius="lg"
                        >
                          <VStack gap={1}>
                            <Text fontSize="4xl" fontWeight="bold" color="primary.600">
                              {config.pointPerUnit}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                              điểm/đơn vị
                            </Text>
                          </VStack>
                        </Box>
                        <Button
                          colorScheme="primary"
                          onClick={() => handleEdit(config)}
                        >
                          <HStack gap={2}>
                            <i className="fas fa-edit" />
                            <Text>✏️ Chỉnh sửa</Text>
                          </HStack>
                        </Button>
                        <HStack gap={2}>
                          <Button
                            flex={1}
                            variant="outline"
                            colorScheme="primary"
                            onClick={() => handleQuickUpdate(config.activityType, config.pointPerUnit + 1)}
                            title="Tăng 1 điểm"
                          >
                            +1
                          </Button>
                          <Button
                            flex={1}
                            variant="outline"
                            colorScheme="primary"
                            onClick={() =>
                              handleQuickUpdate(config.activityType, Math.max(0, config.pointPerUnit - 1))
                            }
                            title="Giảm 1 điểm"
                          >
                            -1
                          </Button>
                        </HStack>
                      </VStack>
                    ) : (
                      <VStack gap={4} py={8}>
                        <Text color="gray.500">Chưa có cấu hình</Text>
                        <Button
                          colorScheme="primary"
                          onClick={() => {
                            setFormData({
                              activityType: activity.type as any,
                              activityName: activity.name,
                              pointPerUnit: 0,
                              status: 'active',
                            });
                            setEditingId('new');
                          }}
                        >
                          ➕ Tạo cấu hình
                        </Button>
                      </VStack>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            );
          })}
        </Grid>

        <Card bg="gray.50" border="1px" borderColor="gray.200">
          <CardBody>
            <VStack gap={3} align="stretch">
              <Heading size="sm" color="gray.900">
                ℹ️ Hướng dẫn
              </Heading>
              <VStack gap={2} align="stretch" fontSize="sm" color="gray.600">
                <HStack align="start" gap={2}>
                  <Text color="primary.600" fontWeight="bold">
                    •
                  </Text>
                  <Text>
                    Điểm số sẽ được tính: <strong color="gray.900">Số lượng × Điểm mỗi đơn vị</strong>
                  </Text>
                </HStack>
                <HStack align="start" gap={2}>
                  <Text color="primary.600" fontWeight="bold">
                    •
                  </Text>
                  <Text>
                    Ví dụ: Nếu &quot;Đơn thuần&quot; = 1 điểm/đơn vị, và có 10 đơn vị → Tổng điểm = 10 điểm
                  </Text>
                </HStack>
                <HStack align="start" gap={2}>
                  <Text color="primary.600" fontWeight="bold">
                    •
                  </Text>
                  <Text>
                    Bạn có thể tạm dừng một loại hoạt động bằng cách đặt trạng thái &quot;Tạm dừng&quot;
                  </Text>
                </HStack>
                <HStack align="start" gap={2}>
                  <Text color="primary.600" fontWeight="bold">
                    •
                  </Text>
                  <Text>Dùng nút +1/-1 để điều chỉnh nhanh điểm số</Text>
                </HStack>
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};
