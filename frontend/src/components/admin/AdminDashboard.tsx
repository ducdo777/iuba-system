import React, { useEffect, useState } from 'react';
import { statisticsService, StatisticsOverview } from '../../services/statistics';


export const AdminDashboard: React.FC = () => {
  const [overview, setOverview] = useState<StatisticsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    try {
      setLoading(true);
      const data = await statisticsService.getOverview();
      setOverview(data);
    } catch (error) {
      console.error('Error loading overview:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <i className="fas fa-exclamation-circle text-error text-4xl mb-4"></i>
          <p className="text-error font-medium">Không thể tải dữ liệu</p>
        </div>
      </div>
    );
  }

  const { summary } = overview;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">IUBA System</h1>
        <h2 className="text-2xl font-semibold text-gray-700">Dashboard Tổng quan</h2>
      </div>
      
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <i className="fas fa-user-friends text-2xl"></i>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm font-medium">Teams</p>
            </div>
          </div>
          <h3 className="text-4xl font-bold mb-1">{summary.totalTeams}</h3>
          <p className="text-blue-100 text-sm">Tổng số teams</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <i className="fas fa-users text-2xl"></i>
            </div>
            <div className="text-right">
              <p className="text-green-100 text-sm font-medium">Người dùng</p>
            </div>
          </div>
          <h3 className="text-4xl font-bold mb-1">{summary.totalUsers}</h3>
          <p className="text-green-100 text-sm">Tổng số người dùng</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <i className="fas fa-list text-2xl"></i>
            </div>
            <div className="text-right">
              <p className="text-amber-100 text-sm font-medium">Bản ghi</p>
            </div>
          </div>
          <h3 className="text-4xl font-bold mb-1">{summary.totalRecords}</h3>
          <p className="text-amber-100 text-sm">Tổng số bản ghi</p>
        </div>
      </div>

      {/* Data Summary */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-1 w-12 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full"></div>
          <h3 className="text-2xl font-bold text-gray-800">Tổng kết dữ liệu</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-lg hover:border-primary-300 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600 group-hover:bg-pink-200 transition-colors">
                <i className="fas fa-hand-holding-heart text-xl"></i>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{summary.donThuan}</h3>
            <p className="text-gray-600 text-sm font-medium">Đơn thuần</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-lg hover:border-green-300 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600 group-hover:bg-green-200 transition-colors">
                <i className="fas fa-check-circle text-xl"></i>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{summary.huuHieu}</h3>
            <p className="text-gray-600 text-sm font-medium">Hữu hiệu</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-200 transition-colors">
                <i className="fas fa-water text-xl"></i>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{summary.baptem}</h3>
            <p className="text-gray-600 text-sm font-medium">Baptem</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-lg hover:border-purple-300 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 group-hover:bg-purple-200 transition-colors">
                <i className="fas fa-praying-hands text-xl"></i>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{summary.thoPhuong}</h3>
            <p className="text-gray-600 text-sm font-medium">Thờ phượng</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-lg hover:border-indigo-300 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-200 transition-colors">
                <i className="fas fa-users text-xl"></i>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{summary.lapCLB}</h3>
            <p className="text-gray-600 text-sm font-medium">Lập CLB</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-lg hover:border-orange-300 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-200 transition-colors">
                <i className="fas fa-arrow-up text-xl"></i>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{summary.lenGiaiDoan}</h3>
            <p className="text-gray-600 text-sm font-medium">Lên giai đoạn</p>
          </div>
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl shadow-lg p-5 text-white col-span-1 sm:col-span-2 lg:col-span-2 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <i className="fas fa-chart-line text-2xl"></i>
              </div>
            </div>
            <h3 className="text-4xl font-bold mb-1">{summary.grandTotal}</h3>
            <p className="text-primary-100 text-sm font-medium">Tổng cộng</p>
          </div>
        </div>
      </div>

      {/* Team Stats Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="h-1 w-12 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-800">Thống kê theo Team</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">Team</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">Số thành viên</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">Đơn thuần</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">Hữu hiệu</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">Baptem</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">Thờ phượng</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">Lập CLB</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">Lên giai đoạn</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">Tổng</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {overview.byTeam.map((team, index) => (
                <tr 
                  key={team.teamId} 
                  className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                >
                  <td className="py-4 px-6 text-sm font-semibold text-gray-900">{team.teamName}</td>
                  <td className="py-4 px-6 text-sm text-gray-700">{team.totalMembers || '-'}</td>
                  <td className="py-4 px-6 text-sm text-gray-700">{team.donThuan}</td>
                  <td className="py-4 px-6 text-sm text-gray-700">{team.huuHieu}</td>
                  <td className="py-4 px-6 text-sm text-gray-700">{team.baptem}</td>
                  <td className="py-4 px-6 text-sm text-gray-700">{team.thoPhuong}</td>
                  <td className="py-4 px-6 text-sm text-gray-700">{team.lapCLB}</td>
                  <td className="py-4 px-6 text-sm text-gray-700">{team.lenGiaiDoan}</td>
                  <td className="py-4 px-6 text-sm font-bold text-primary-600">{team.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
