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
import { teamsService, Team } from '../../services/teams';
import { TeamModal } from '../../components/admin/TeamModal';

export const AdminTeams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [deleteTeamId, setDeleteTeamId] = useState<string | null>(null);
  const { open, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const toast = useToast();

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const data = await teamsService.getAll();
      setTeams(data);
    } catch (error) {
      console.error('Error loading teams:', error);
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
    setEditingTeam(null);
    setModalOpen(true);
  };

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    setModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteTeamId(id);
    onOpen();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTeamId) return;
    try {
      await teamsService.delete(deleteTeamId);
      toast({
        title: 'Thành công',
        description: 'Đã xóa team',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      loadTeams();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa team',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onClose();
      setDeleteTeamId(null);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingTeam(null);
    loadTeams();
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
          Quản lý Team
        </Heading>
        <Button
          colorScheme="primary"
          onClick={handleCreate}
        >
          <HStack gap={2}>
            <i className="fas fa-plus" />
            <Text>Thêm Team</Text>
          </HStack>
        </Button>
      </Flex>

      <TableContainer bg="white" borderRadius="xl" boxShadow="sm" overflow="hidden">
        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th fontSize="sm" fontWeight="semibold" color="gray.700">
                Mã Team
              </Th>
              <Th fontSize="sm" fontWeight="semibold" color="gray.700">
                Tên Team
              </Th>
              <Th fontSize="sm" fontWeight="semibold" color="gray.700">
                Mô tả
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
            {teams.length === 0 ? (
              <Tr>
                <Td colSpan={5} textAlign="center" py={8} color="gray.500">
                  Không có team nào
                </Td>
              </Tr>
            ) : (
              teams.map((team) => (
                <Tr key={team.id} _hover={{ bg: 'gray.50' }} transition="background 0.2s">
                  <Td fontWeight="medium" color="gray.900">
                    {team.teamCode}
                  </Td>
                  <Td color="gray.700">{team.teamName}</Td>
                  <Td color="gray.700">{team.description || '-'}</Td>
                  <Td>
                    <Badge
                      colorScheme={team.status === 'active' ? 'green' : 'red'}
                      variant="subtle"
                    >
                      {team.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack gap={2}>
                      <Button
                        size="sm"
                        colorScheme="primary"
                        onClick={() => handleEdit(team)}
                      >
                        <HStack gap={1}>
                          <i className="fas fa-edit" />
                          <Text>Sửa</Text>
                        </HStack>
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDeleteClick(team.id)}
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

      {modalOpen && <TeamModal team={editingTeam} onClose={handleModalClose} />}

      <AlertDialog
        isOpen={open}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Xóa team
            </AlertDialogHeader>
            <AlertDialogBody>
              Bạn có chắc chắn muốn xóa team này? Hành động này không thể hoàn tác.
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
