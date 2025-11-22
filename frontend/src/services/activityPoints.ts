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

// Cache configuration
const CACHE_KEY = 'activity_points_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 phút

// Helper functions for cache
const getCachedData = (): ActivityPointConfig[] | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }
  } catch (error) {
    console.error('Error reading cache:', error);
  }
  return null;
};

const setCachedData = (data: ActivityPointConfig[]): void => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now(),
    }));
  } catch (error) {
    console.error('Error writing cache:', error);
  }
};

const clearCache = (): void => {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

export const activityPointsService = {
  getAll: async (): Promise<ActivityPointConfig[]> => {
    // Check cache first
    const cached = getCachedData();
    if (cached) {
      return cached;
    }
    
    // Fetch from API
    try {
      const response = await api.get<ActivityPointConfig[]>('/activity-points');
      const data = response.data;
      
      // Update cache
      setCachedData(data);
      
      return data;
    } catch (error) {
      console.error('Error fetching activity points:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<ActivityPointConfig> => {
    const response = await api.get<ActivityPointConfig>(`/activity-points/${id}`);
    return response.data;
  },

  create: async (data: CreateActivityPointConfigDto): Promise<ActivityPointConfig> => {
    const response = await api.post<ActivityPointConfig>('/activity-points', data);
    clearCache(); // Clear cache when creating new config
    return response.data;
  },

  update: async (id: string, data: Partial<CreateActivityPointConfigDto>): Promise<ActivityPointConfig> => {
    const response = await api.put<ActivityPointConfig>(`/activity-points/${id}`, data);
    clearCache(); // Clear cache when updating
    return response.data;
  },

  updateByType: async (type: string, data: Partial<CreateActivityPointConfigDto>): Promise<ActivityPointConfig> => {
    const response = await api.put<ActivityPointConfig>(`/activity-points/type/${type}`, data);
    clearCache(); // Clear cache when updating by type
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/activity-points/${id}`);
    clearCache(); // Clear cache when deleting
  },

  initialize: async (): Promise<void> => {
    await api.post('/activity-points/initialize');
    clearCache(); // Clear cache when initializing
  },

  // Helper method to manually clear cache (useful for testing)
  clearCache,
};

