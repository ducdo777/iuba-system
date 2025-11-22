import React, { useEffect, useState } from 'react';
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
  Badge,
  HStack,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
} from '@chakra-ui/react';
import { usersService, User } from '../../services/users';
import { teamsService, Team } from '../../services/teams';
import { UserModal } from '../../components/admin/UserModal';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const { open, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const toast = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, teamsData] = await Promise.all([
        usersService.getAll(),
        teamsService.getAll(),
      ]);
      setUsers(usersData);
      setTeams(teamsData);
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

  const handleCreate = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteUserId(id);
    onOpen();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteUserId) return;
    try {
      await usersService.delete(deleteUserId);
      toast({
        title: 'Thành công',
        description: 'Đã xóa tài khoản',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa tài khoản',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onClose();
      setDeleteUserId(null);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingUser(null);
    loadData();
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
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        justify="space-between"
        align={{ base: 'flex-start', sm: 'center' }}
        mb={6}
        gap={4}
      >
        <Heading size="lg" color="gray.900">
          Quản lý Tài khoản
        </Heading>
        <Button
          colorScheme="primary"
          onClick={handleCreate}
        >
          <HStack gap={2}>
            <i className="fas fa-plus" />
            <Text>Thêm tài khoản</Text>
          </HStack>
        </Button>
      </Flex>

      <TableContainer bg="white" borderRadius="xl" boxShadow="sm" overflow="hidden">
        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th fontSize="sm" fontWeight="semibold" color="gray.700">
                Username
              </Th>
              <Th fontSize="sm" fontWeight="semibold" color="gray.700">
                Họ tên
              </Th>
              <Th fontSize="sm" fontWeight="semibold" color="gray.700">
                Team
              </Th>
              <Th fontSize="sm" fontWeight="semibold" color="gray.700">
                Vai trò
              </Th>
              <Th fontSize="sm" fontWeight="semibold" color="gray.700">
                Email
              </Th>
              <Th fontSize="sm" fontWeight="semibold" color="gray.700">
                Trạng thái
              </Th>
              <Th fontSize="sm" fontWeight="semibold" color="gray.700">
                Thao tác
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.length === 0 ? (
              <Tr>
                <Td colSpan={7} textAlign="center" py={8} color="gray.500">
                  Không có tài khoản nào
                </Td>
              </Tr>
            ) : (
              users.map((user) => (
                <Tr key={user.id} _hover={{ bg: 'gray.50' }} transition="background 0.2s">
                  <Td fontWeight="medium" color="gray.900">
                    {user.username}
                  </Td>
                  <Td color="gray.700">{user.fullName}</Td>
                  <Td color="gray.700">{user.team?.teamName || '-'}</Td>
                  <Td>
                    <Badge
                      colorScheme={user.role === 'admin' ? 'blue' : 'green'}
                      variant="subtle"
                    >
                      {user.role === 'admin' ? 'Admin' : 'User'}
                    </Badge>
                  </Td>
                  <Td color="gray.700">{user.email || '-'}</Td>
                  <Td>
                    <Badge
                      colorScheme={user.status === 'active' ? 'green' : 'red'}
                      variant="subtle"
                    >
                      {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack gap={2}>
                      <Button
                        size="sm"
                        colorScheme="primary"
                        onClick={() => handleEdit(user)}
                      >
                        <HStack gap={1}>
                          <i className="fas fa-edit" />
                          <Text>Sửa</Text>
                        </HStack>
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDeleteClick(user.id)}
                      >
                        <HStack gap={1}>
                          <i className="fas fa-trash" />
                          <Text>Xóa</Text>
                        </HStack>
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {modalOpen && (
        <UserModal user={editingUser} teams={teams} onClose={handleModalClose} />
      )}

      <AlertDialog
        isOpen={open}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Xóa tài khoản
            </AlertDialogHeader>
            <AlertDialogBody>
              Bạn có chắc chắn muốn xóa tài khoản này? Hành động này không thể hoàn tác.
            </AlertDialogBody>
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
    </Box>
  );
};
