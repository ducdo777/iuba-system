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
  Select,
  Textarea,
  VStack,
  Grid,
  Alert,
  AlertIcon,
  useToast,
} from '@chakra-ui/react';
import { teamsService, Team, CreateTeamDto } from '../../services/teams';

interface TeamModalProps {
  team: Team | null;
  onClose: () => void;
}

export const TeamModal: React.FC<TeamModalProps> = ({ team, onClose }) => {
  const [formData, setFormData] = useState<CreateTeamDto>({
    teamCode: '',
    teamName: '',
    description: '',
    status: 'active',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  useEffect(() => {
    if (team) {
      setFormData({
        teamCode: team.teamCode,
        teamName: team.teamName,
        description: team.description || '',
        status: team.status,
      });
    }
  }, [team]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (team) {
        await teamsService.update(team.id, formData);
        toast({
          title: 'Thành công',
          description: 'Đã cập nhật team',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await teamsService.create(formData);
        toast({
          title: 'Thành công',
          description: 'Đã tạo team',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi lưu team');
      toast({
        title: 'Lỗi',
        description: err.response?.data?.message || 'Lỗi khi lưu team',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{team ? 'Sửa Team' : 'Thêm Team'}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack gap={4} align="stretch">
              {error && (
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  {error}
                </Alert>
              )}

              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                <FormControl isRequired>
                  <FormLabel>Mã Team</FormLabel>
                  <Input
                    value={formData.teamCode}
                    onChange={(e) => setFormData({ ...formData, teamCode: e.target.value })}
                    required
                  />
                </FormControl>

                <FormControl isRequired gridColumn={{ base: '1', md: 'span 2' }}>
                  <FormLabel>Tên Team</FormLabel>
                  <Input
                    value={formData.teamName}
                    onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                    required
                  />
                </FormControl>

                <FormControl gridColumn={{ base: '1', md: 'span 2' }}>
                  <FormLabel>Mô tả</FormLabel>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                    required
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                  </Select>
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
