'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Box,
  Flex,
  Heading,
  Button,
  Text,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerContent,
  VStack,
  HStack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  role: 'admin' | 'user';
}

export const Layout: React.FC<LayoutProps> = ({ children, role }) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const adminMenu = [
    { path: '/admin', icon: 'fas fa-home', label: 'Dashboard' },
    { path: '/admin/users', icon: 'fas fa-users', label: 'Tài khoản' },
    { path: '/admin/teams', icon: 'fas fa-user-friends', label: 'Teams' },
    { path: '/admin/statistics', icon: 'fas fa-chart-bar', label: 'Thống kê' },
    { path: '/admin/points', icon: 'fas fa-cog', label: 'Cấu hình Điểm' },
  ];

  const userMenu = [
    { path: '/user', icon: 'fas fa-plus', label: 'Nhập dữ liệu' },
  ];

  const menu = role === 'admin' ? adminMenu : userMenu;

  const SidebarContent = () => (
    <VStack spacing={1} align="stretch" p={4} h="full" overflowY="auto">
      {menu.map((item) => (
        <Link key={item.path} href={item.path} onClick={onClose}>
          <Button
            leftIcon={<i className={item.icon} />}
            justifyContent="flex-start"
            w="full"
            variant={isActive(item.path) ? 'solid' : 'ghost'}
            colorScheme={isActive(item.path) ? 'primary' : 'gray'}
            bg={isActive(item.path) ? 'primary.600' : 'transparent'}
            color={isActive(item.path) ? 'white' : 'gray.700'}
            _hover={{
              bg: isActive(item.path) ? 'primary.700' : 'gray.100',
            }}
          >
            {item.label}
          </Button>
        </Link>
      ))}
    </VStack>
  );

  return (
    <Flex direction="column" h="100vh" overflow="hidden">
      {/* Header */}
      <Box
        as="header"
        position="sticky"
        top={0}
        zIndex={50}
        bg="primary.600"
        color="white"
        px={{ base: 4, md: 6 }}
        py={4}
        shadow="md"
      >
        <Flex justify="space-between" align="center">
          <HStack spacing={4}>
            <Button
              display={{ base: 'block', md: 'none' }}
              variant="ghost"
              colorScheme="whiteAlpha"
              onClick={onOpen}
              aria-label="Toggle menu"
            >
              <i className="fas fa-bars" />
            </Button>
            <Heading size="md">IUBA System</Heading>
          </HStack>
          <HStack spacing={3}>
            <Text display={{ base: 'none', md: 'flex' }} fontSize="sm">
              <i className="fas fa-user" style={{ marginRight: '8px' }} />
              {user?.fullName || user?.username}
            </Text>
            <Button
              size="sm"
              variant="ghost"
              colorScheme="whiteAlpha"
              leftIcon={<i className="fas fa-sign-out-alt" />}
              onClick={handleLogout}
            >
              <Text display={{ base: 'none', sm: 'inline' }}>Đăng xuất</Text>
            </Button>
          </HStack>
        </Flex>
      </Box>

      <Flex flex={1} overflow="hidden">
        {/* Desktop Sidebar */}
        <Box
          display={{ base: 'none', md: 'block' }}
          w="64"
          bg="white"
          borderRight="1px"
          borderColor="gray.200"
          h="full"
        >
          <SidebarContent />
        </Box>

        {/* Mobile Drawer */}
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerContent>
            <DrawerBody p={0}>
              <SidebarContent />
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Main Content */}
        <Box
          as="main"
          flex={1}
          overflowY="auto"
          bg="gray.50"
          w="full"
          minW={0}
        >
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};
