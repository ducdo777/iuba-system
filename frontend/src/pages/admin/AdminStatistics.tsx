import React, { useEffect, useState } from 'react';
import { statisticsService, TeamStatistics } from '../../services/statistics';
import { teamsService, Team } from '../../services/teams';
import './AdminStatistics.css';

export const AdminStatistics: React.FC = () => {
  const [stats, setStats] = useState<TeamStatistics[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeams();
    loadStatistics();
  }, []);

  const loadTeams = async () => {
    try {
      const data = await teamsService.getAll();
      setTeams(data);
    } catch (error) {
      console.error('Error loading teams:', error);
    }
  };

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const data = await statisticsService.getByTeam(selectedTeam || undefined, startDate || undefined, endDate || undefined);
      setStats(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    loadStatistics();
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="admin-statistics">
      <h2>Thống kê</h2>

      <div className="filter-bar">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Từ ngày"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="Đến ngày"
        />
        <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
          <option value="">Tất cả Teams</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.teamCode} - {team.teamName}
            </option>
          ))}
        </select>
        <button className="btn btn-primary" onClick={handleFilter}>
          Xem thống kê
        </button>
      </div>

      <div className="statistics-content">
        {stats.map((teamStat) => (
          <div key={teamStat.teamId} className="team-stat-card">
            <h3>{teamStat.teamName} ({teamStat.teamCode})</h3>
            <p><strong>Số thành viên:</strong> {teamStat.totalMembers}</p>
            
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Thành viên</th>
                    <th>Đơn thuần</th>
                    <th>Hữu hiệu</th>
                    <th>Baptem</th>
                    <th>Thờ phượng</th>
                    <th>Lập CLB</th>
                    <th>Lên giai đoạn</th>
                    <th>Tổng</th>
                    <th>Số bản ghi</th>
                  </tr>
                </thead>
                <tbody>
                  {teamStat.byUser.map((user) => (
                    <tr key={user.userId}>
                      <td>{user.fullName}</td>
                      <td>{user.donThuan}</td>
                      <td>{user.huuHieu}</td>
                      <td>{user.baptem}</td>
                      <td>{user.thoPhuong}</td>
                      <td>{user.lapCLB}</td>
                      <td>{user.lenGiaiDoan}</td>
                      <td><strong>{user.total}</strong></td>
                      <td>{user.recordCount}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td><strong>TỔNG</strong></td>
                    <td><strong>{teamStat.summary.donThuan}</strong></td>
                    <td><strong>{teamStat.summary.huuHieu}</strong></td>
                    <td><strong>{teamStat.summary.baptem}</strong></td>
                    <td><strong>{teamStat.summary.thoPhuong}</strong></td>
                    <td><strong>{teamStat.summary.lapCLB}</strong></td>
                    <td><strong>{teamStat.summary.lenGiaiDoan}</strong></td>
                    <td><strong>{teamStat.summary.total}</strong></td>
                    <td><strong>{teamStat.summary.recordCount}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
