import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Grid,
  Alert,
  useToast,
} from '@chakra-ui/react';
import { activityDataService, ActivityData, CreateActivityDataDto } from '../../services/activityData';

interface DataModalProps {
  data: ActivityData | null;
  onClose: () => void;
}

export const DataModal: React.FC<DataModalProps> = ({ data, onClose }) => {
  const [formData, setFormData] = useState<CreateActivityDataDto>({
    date: new Date().toISOString().split('T')[0],
    donThuan: 0,
    huuHieu: 0,
    baptem: 0,
    thoPhuong: 0,
    lapCLB: 0,
    lenGiaiDoan: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  useEffect(() => {
    if (data) {
      setFormData({
        date: data.date,
        donThuan: data.donThuan || 0,
        huuHieu: data.huuHieu || 0,
        baptem: data.baptem || 0,
        thoPhuong: data.thoPhuong || 0,
        lapCLB: data.lapCLB || 0,
        lenGiaiDoan: data.lenGiaiDoan || 0,
      });
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (data) {
        await activityDataService.update(data.id, formData);
        toast({
          title: 'Thành công',
          description: 'Đã cập nhật dữ liệu',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await activityDataService.create(formData);
        toast({
          title: 'Thành công',
          description: 'Đã thêm dữ liệu',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi lưu dữ liệu');
      toast({
        title: 'Lỗi',
        description: err.response?.data?.message || 'Lỗi khi lưu dữ liệu',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{data ? 'Sửa dữ liệu' : 'Thêm dữ liệu'}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack gap={4} align="stretch">
              {error && (
                <Alert status="error" borderRadius="md">
                  {error}
                </Alert>
              )}

              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                <FormControl isRequired gridColumn={{ base: '1', md: 'span 2' }}>
                  <FormLabel>Ngày</FormLabel>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Đơn thuần</FormLabel>
                  <Input
                    type="number"
                    min="0"
                    value={formData.donThuan}
                    onChange={(e) => setFormData({ ...formData, donThuan: parseInt(e.target.value) || 0 })}
                    required
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Hữu hiệu</FormLabel>
                  <Input
                    type="number"
                    min="0"
                    value={formData.huuHieu}
                    onChange={(e) => setFormData({ ...formData, huuHieu: parseInt(e.target.value) || 0 })}
                    required
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Baptem</FormLabel>
                  <Input
                    type="number"
                    min="0"
                    value={formData.baptem}
                    onChange={(e) => setFormData({ ...formData, baptem: parseInt(e.target.value) || 0 })}
                    required
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Thờ phượng</FormLabel>
                  <Input
                    type="number"
                    min="0"
                    value={formData.thoPhuong}
                    onChange={(e) => setFormData({ ...formData, thoPhuong: parseInt(e.target.value) || 0 })}
                    required
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Lập CLB</FormLabel>
                  <Input
                    type="number"
                    min="0"
                    value={formData.lapCLB}
                    onChange={(e) => setFormData({ ...formData, lapCLB: parseInt(e.target.value) || 0 })}
                    required
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Lên giai đoạn</FormLabel>
                  <Input
                    type="number"
                    min="0"
                    value={formData.lenGiaiDoan}
                    onChange={(e) => setFormData({ ...formData, lenGiaiDoan: parseInt(e.target.value) || 0 })}
                    required
                  />
                </FormControl>
              </Grid>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Hủy
            </Button>
            <Button colorScheme="primary" type="submit" isLoading={loading}>
              {loading ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
