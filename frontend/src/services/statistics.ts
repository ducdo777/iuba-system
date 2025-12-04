import api from './api';

export interface StatisticsOverview {
  summary: {
    totalTeams: number;
    totalUsers: number;
    totalRecords: number;
    donThuan: number;
    huuHieu: number;
    baptem: number;
    thoPhuong: number;
    lapCLB: number;
    lenGiaiDoan: number;
    grandTotal: number;
  };
  byTeam: Array<{
    teamId: string;
    teamCode: string;
    teamName: string;
    totalMembers: number;
    donThuan: number;
    huuHieu: number;
    baptem: number;
    thoPhuong: number;
    lapCLB: number;
    lenGiaiDoan: number;
    total: number;
  }>;
}

export interface TeamStatistics {
  teamId: string;
  teamCode: string;
  teamName: string;
  totalMembers: number;
  byUser: Array<{
    userId: string;
    username: string;
    fullName: string;
    donThuan: number;
    huuHieu: number;
    baptem: number;
    thoPhuong: number;
    lapCLB: number;
    lenGiaiDoan: number;
    total: number;
    recordCount: number;
  }>;
  summary: {
    donThuan: number;
    huuHieu: number;
    baptem: number;
    thoPhuong: number;
    lapCLB: number;
    lenGiaiDoan: number;
    total: number;
    recordCount: number;
  };
}

export const statisticsService = {
  getOverview: async (startDate?: string, endDate?: string): Promise<StatisticsOverview> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const response = await api.get<StatisticsOverview>(`/statistics/overview?${params.toString()}`);
    return response.data;
  },

  getByTeam: async (teamId?: string, startDate?: string, endDate?: string): Promise<TeamStatistics | TeamStatistics[]> => {
    const params = new URLSearchParams();
    if (teamId) params.append('teamId', teamId);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const response = await api.get<TeamStatistics | TeamStatistics[]>(`/statistics/by-team?${params.toString()}`);
    return response.data;
  },

  getMyTeam: async (startDate?: string, endDate?: string): Promise<TeamStatistics> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const response = await api.get<TeamStatistics>(`/statistics/my-team?${params.toString()}`);
    return response.data;
  },
};
