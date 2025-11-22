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
    <div className="space-y-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-foreground">Dashboard Tổng quan</h2>
      
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white text-xl">
            <i className="fas fa-user-friends"></i>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-foreground">{summary.totalTeams}</h3>
            <p className="text-muted-foreground text-sm">Teams</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-full bg-success flex items-center justify-center text-white text-xl">
            <i className="fas fa-users"></i>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-foreground">{summary.totalUsers}</h3>
            <p className="text-muted-foreground text-sm">Người dùng</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-full bg-warning flex items-center justify-center text-white text-xl">
            <i className="fas fa-list"></i>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-foreground">{summary.totalRecords}</h3>
            <p className="text-muted-foreground text-sm">Bản ghi</p>
          </div>
        </div>
      </div>

      {/* Data Summary */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-foreground">Tổng kết dữ liệu</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-lg">
              <i className="fas fa-hand-holding-heart"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">{summary.donThuan}</h3>
              <p className="text-muted-foreground text-sm">Đơn thuần</p>
            </div>
          </div>
          <div className="bg-card rounded-xl border shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center text-success text-lg">
              <i className="fas fa-check-circle"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">{summary.huuHieu}</h3>
              <p className="text-muted-foreground text-sm">Hữu hiệu</p>
            </div>
          </div>
          <div className="bg-card rounded-xl border shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-info/10 flex items-center justify-center text-info text-lg">
              <i className="fas fa-water"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">{summary.baptem}</h3>
              <p className="text-muted-foreground text-sm">Baptem</p>
            </div>
          </div>
          <div className="bg-card rounded-xl border shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center text-warning text-lg">
              <i className="fas fa-praying-hands"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">{summary.thoPhuong}</h3>
              <p className="text-muted-foreground text-sm">Thờ phượng</p>
            </div>
          </div>
          <div className="bg-card rounded-xl border shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-lg">
              <i className="fas fa-users"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">{summary.lapCLB}</h3>
              <p className="text-muted-foreground text-sm">Lập CLB</p>
            </div>
          </div>
          <div className="bg-card rounded-xl border shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-error/10 flex items-center justify-center text-error text-lg">
              <i className="fas fa-arrow-up"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">{summary.lenGiaiDoan}</h3>
              <p className="text-muted-foreground text-sm">Lên giai đoạn</p>
            </div>
          </div>
          <div className="bg-card rounded-xl border shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-white text-lg">
              <i className="fas fa-list"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">{summary.grandTotal}</h3>
              <p className="text-muted-foreground text-sm">Tổng cộng</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Stats Table */}
      <div className="bg-card rounded-xl border shadow-sm p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">Thống kê theo Team</h3>
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Team</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Số thành viên</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Đơn thuần</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Hữu hiệu</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Baptem</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Thờ phượng</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Lập CLB</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Lên giai đoạn</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Tổng</th>
              </tr>
            </thead>
            <tbody>
              {overview.byTeam.map((team) => (
                <tr key={team.teamId} className="border-b border-gray-200 hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-foreground font-medium">{team.teamName}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{team.totalMembers}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{team.donThuan}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{team.huuHieu}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{team.baptem}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{team.thoPhuong}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{team.lapCLB}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{team.lenGiaiDoan}</td>
                  <td className="py-3 px-4 text-sm text-foreground font-bold">{team.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
