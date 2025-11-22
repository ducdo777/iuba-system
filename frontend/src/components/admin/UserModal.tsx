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
  VStack,
  Grid,
  Alert,
  AlertIcon,
  useToast,
} from '@chakra-ui/react';
import { usersService, User, CreateUserDto } from '../../services/users';
import { Team } from '../../services/teams';

interface UserModalProps {
  user: User | null;
  teams: Team[];
  onClose: () => void;
}

export const UserModal: React.FC<UserModalProps> = ({ user, teams, onClose }) => {
  const [formData, setFormData] = useState<CreateUserDto>({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'user',
    teamId: '',
    status: 'active',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        fullName: user.fullName,
        email: user.email || '',
        phone: user.phone || '',
        role: user.role,
        teamId: user.teamId || '',
        status: user.status,
        password: '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const submitData = { ...formData };
      if (!submitData.password) {
        delete submitData.password;
      }

      if (user) {
        await usersService.update(user.id, submitData);
        toast({
          title: 'Thành công',
          description: 'Đã cập nhật tài khoản',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        if (!submitData.password) {
          setError('Mật khẩu là bắt buộc khi tạo mới');
          setLoading(false);
          return;
        }
        await usersService.create(submitData);
        toast({
          title: 'Thành công',
          description: 'Đã tạo tài khoản',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi lưu tài khoản');
      toast({
        title: 'Lỗi',
        description: err.response?.data?.message || 'Lỗi khi lưu tài khoản',
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
        <ModalHeader>{user ? 'Sửa Tài khoản' : 'Thêm Tài khoản'}</ModalHeader>
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
                <FormControl isRequired gridColumn={{ base: '1', md: 'span 2' }}>
                  <FormLabel>Username</FormLabel>
                  <Input
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </FormControl>

                <FormControl isRequired gridColumn={{ base: '1', md: 'span 2' }}>
                  <FormLabel>Họ và tên</FormLabel>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </FormControl>

                <FormControl isRequired={!user}>
                  <FormLabel>Password {user && '(để trống nếu không đổi)'}</FormLabel>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!user}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Vai trò</FormLabel>
                  <Select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
                    required
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Team</FormLabel>
                  <Select
                    value={formData.teamId}
                    onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
                  >
                    <option value="">-- Không chọn --</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.teamCode} - {team.teamName}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Số điện thoại</FormLabel>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
