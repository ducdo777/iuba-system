import api from './api';

export interface ActivityData {
  id: string;
  teamId?: string;
  userId?: string;
  date: string;
  donThuan: number;
  huuHieu: number;
  baptem: number;
  thoPhuong: number;
  lapCLB: number;
  lenGiaiDoan: number;
  hiepCauNguyenSang: number;
  team?: {
    id: string;
    teamName: string;
    teamCode: string;
  };
  user?: {
    id: string;
    fullName: string;
    username: string;
  };
}

export interface CreateActivityDataDto {
  date: string;
  donThuan: number;
  huuHieu: number;
  baptem: number;
  thoPhuong: number;
  lapCLB: number;
  lenGiaiDoan: number;
  hiepCauNguyenSang: number;
}

export const activityDataService = {
  getAll: async (teamId?: string, userId?: string, startDate?: string, endDate?: string): Promise<ActivityData[]> => {
    const params = new URLSearchParams();
    if (teamId) params.append('teamId', teamId);
    if (userId) params.append('userId', userId);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const response = await api.get<ActivityData[]>(`/activity-data?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<ActivityData> => {
    const response = await api.get<ActivityData>(`/activity-data/${id}`);
    return response.data;
  },

  create: async (data: CreateActivityDataDto): Promise<ActivityData> => {
    const response = await api.post<ActivityData>('/activity-data', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateActivityDataDto>): Promise<ActivityData> => {
    const response = await api.put<ActivityData>(`/activity-data/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/activity-data/${id}`);
  },
};
