import api from './api';

export interface ActivityPointConfig {
  id: string;
  activityType: 'donThuan' | 'huuHieu' | 'baptem' | 'thoPhuong' | 'lapCLB' | 'lenGiaiDoan';
  activityName: string;
  pointPerUnit: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateActivityPointConfigDto {
  activityType: 'donThuan' | 'huuHieu' | 'baptem' | 'thoPhuong' | 'lapCLB' | 'lenGiaiDoan';
  activityName: string;
  pointPerUnit: number;
  status?: 'active' | 'inactive';
}

export const activityPointsService = {
  getAll: async (): Promise<ActivityPointConfig[]> => {
    const response = await api.get<ActivityPointConfig[]>('/activity-points');
    return response.data;
  },

  getById: async (id: string): Promise<ActivityPointConfig> => {
    const response = await api.get<ActivityPointConfig>(`/activity-points/${id}`);
    return response.data;
  },

  create: async (data: CreateActivityPointConfigDto): Promise<ActivityPointConfig> => {
    const response = await api.post<ActivityPointConfig>('/activity-points', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateActivityPointConfigDto>): Promise<ActivityPointConfig> => {
    const response = await api.put<ActivityPointConfig>(`/activity-points/${id}`, data);
    return response.data;
  },

  updateByType: async (type: string, data: Partial<CreateActivityPointConfigDto>): Promise<ActivityPointConfig> => {
    const response = await api.put<ActivityPointConfig>(`/activity-points/type/${type}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/activity-points/${id}`);
  },

  initialize: async (): Promise<void> => {
    await api.post('/activity-points/initialize');
  },
};

