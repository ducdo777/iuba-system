import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Heading,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  VStack,
  Alert,
  AlertIcon,
  Icon,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheckIcon } from '../components/ui/Icons';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/user', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (currentUser.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/user', { replace: true });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu không đúng.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="gray.100"
      px={{ base: 4, md: 0 }}
    >
      <Box
        w="full"
        maxW="md"
        p={8}
        bg="white"
        borderRadius="2xl"
        boxShadow="lg"
      >
        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Flex justify="center" mb={4}>
              <Box color="primary.600" fontSize="4xl">
                <i className="fas fa-shield-alt" />
              </Box>
            </Flex>
            <Heading size="xl" color="gray.900" mb={2}>
              Hệ Thống Thi Đua
            </Heading>
            <Text color="gray.600">Đăng nhập để tiếp tục</Text>
          </Box>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel htmlFor="username" srOnly>
                  Tên đăng nhập
                </FormLabel>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Tên đăng nhập"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  isDisabled={loading}
                  size="lg"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel htmlFor="password" srOnly>
                  Mật khẩu
                </FormLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isDisabled={loading}
                  size="lg"
                />
              </FormControl>

              {error && (
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                colorScheme="primary"
                size="lg"
                w="full"
                isLoading={loading}
                loadingText="Đang đăng nhập..."
                leftIcon={<i className="fas fa-sign-in-alt" />}
              >
                Đăng nhập
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Flex>
  );
}

export default Login;

