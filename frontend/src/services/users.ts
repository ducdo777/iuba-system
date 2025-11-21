import api from './api';

export interface User {
  id: string;
  username: string;
  fullName: string;
  email?: string;
  phone?: string;
  role: 'admin' | 'user';
  teamId?: string;
  status: 'active' | 'inactive';
  team?: {
    id: string;
    teamName: string;
    teamCode: string;
  };
}

export interface CreateUserDto {
  username: string;
  password?: string;
  fullName: string;
  email?: string;
  phone?: string;
  role: 'admin' | 'user';
  teamId?: string;
  status: 'active' | 'inactive';
}

export const usersService = {
  getAll: async (teamId?: string, role?: string): Promise<User[]> => {
    const params = new URLSearchParams();
    if (teamId) params.append('teamId', teamId);
    if (role) params.append('role', role);
    const response = await api.get<User[]>(`/users?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  create: async (data: CreateUserDto): Promise<User> => {
    const response = await api.post<User>('/users', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateUserDto>): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};
