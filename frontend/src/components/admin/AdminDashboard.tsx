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
    return <div className="loading">Đang tải...</div>;
  }

  if (!overview) {
    return <div className="error">Không thể tải dữ liệu</div>;
  }

  const { summary } = overview;

  return (
    <div className="admin-dashboard">
      <h2>Dashboard Tổng quan</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <i className="fas fa-user-friends"></i>
          </div>
          <div className="stat-info">
            <h3>{summary.totalTeams}</h3>
            <p>Teams</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-info">
            <h3>{summary.totalUsers}</h3>
            <p>Người dùng</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">
            <i className="fas fa-list"></i>
          </div>
          <div className="stat-info">
            <h3>{summary.totalRecords}</h3>
            <p>Bản ghi</p>
          </div>
        </div>
      </div>

      <div className="stats-summary">
        <h3>Tổng kết dữ liệu</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <i className="fas fa-hand-holding-heart"></i>
            </div>
            <div className="stat-info">
              <h3>{summary.donThuan}</h3>
              <p>Đơn thuần</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-info">
              <h3>{summary.huuHieu}</h3>
              <p>Hữu hiệu</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">
              <i className="fas fa-water"></i>
            </div>
            <div className="stat-info">
              <h3>{summary.baptem}</h3>
              <p>Baptem</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon purple">
              <i className="fas fa-praying-hands"></i>
            </div>
            <div className="stat-info">
              <h3>{summary.thoPhuong}</h3>
              <p>Thờ phượng</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon teal">
              <i className="fas fa-users"></i>
            </div>
            <div className="stat-info">
              <h3>{summary.lapCLB}</h3>
              <p>Lập CLB</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon red">
              <i className="fas fa-arrow-up"></i>
            </div>
            <div className="stat-info">
              <h3>{summary.lenGiaiDoan}</h3>
              <p>Lên giai đoạn</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon red">
              <i className="fas fa-list"></i>
            </div>
            <div className="stat-info">
              <h3>{summary.grandTotal}</h3>
              <p>Tổng cộng</p>
            </div>
          </div>
        </div>
      </div>

      <div className="team-stats-table">
        <h3>Thống kê theo Team</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Team</th>
                <th>Số thành viên</th>
                <th>Đơn thuần</th>
                <th>Hữu hiệu</th>
                <th>Baptem</th>
                <th>Thờ phượng</th>
                <th>Lập CLB</th>
                <th>Lên giai đoạn</th>
                <th>Tổng</th>
              </tr>
            </thead>
            <tbody>
              {overview.byTeam.map((team) => (
                <tr key={team.teamId}>
                  <td>{team.teamName}</td>
                  <td>{team.totalMembers}</td>
                    <td>{team.donThuan}</td>
                    <td>{team.huuHieu}</td>
                    <td>{team.baptem}</td>
                    <td>{team.thoPhuong}</td>
                    <td>{team.lapCLB}</td>
                    <td>{team.lenGiaiDoan}</td>
                    <td><strong>{team.total}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
