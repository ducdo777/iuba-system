import api from './api';

export interface Team {
  id: string;
  teamCode: string;
  teamName: string;
  description?: string;
  status: 'active' | 'inactive';
}

export interface CreateTeamDto {
  teamCode: string;
  teamName: string;
  description?: string;
  status: 'active' | 'inactive';
}

export const teamsService = {
  getAll: async (): Promise<Team[]> => {
    const response = await api.get<Team[]>('/teams');
    return response.data;
  },

  getById: async (id: string): Promise<Team> => {
    const response = await api.get<Team>(`/teams/${id}`);
    return response.data;
  },

  create: async (data: CreateTeamDto): Promise<Team> => {
    const response = await api.post<Team>('/teams', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateTeamDto>): Promise<Team> => {
    const response = await api.put<Team>(`/teams/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/teams/${id}`);
  },
};
