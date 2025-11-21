import React, { useEffect, useState, useCallback } from 'react';
import { statisticsService, TeamStatistics } from '../../services/statistics';
import { teamsService, Team } from '../../services/teams';


export const AdminStatistics: React.FC = () => {
  const [stats, setStats] = useState<TeamStatistics[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);

  const loadStatistics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await statisticsService.getByTeam(selectedTeam || undefined, startDate || undefined, endDate || undefined);
      setStats(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedTeam, startDate, endDate]);

  useEffect(() => {
    loadTeams();
    loadStatistics();
  }, [loadStatistics]);

  const loadTeams = async () => {
    try {
      const data = await teamsService.getAll();
      setTeams(data);
    } catch (error) {
      console.error('Error loading teams:', error);
    }
  };


  const handleFilter = () => {
    loadStatistics();
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-foreground">Thống kê</h2>

      <div className="bg-card rounded-xl border shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Từ ngày"
            className="px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="Đến ngày"
            className="px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <select 
            value={selectedTeam} 
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Tất cả Teams</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.teamCode} - {team.teamName}
              </option>
            ))}
          </select>
          <button 
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
            onClick={handleFilter}
          >
            <i className="fas fa-search"></i> Xem thống kê
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {stats.map((teamStat) => (
          <div key={teamStat.teamId} className="bg-card rounded-xl border shadow-sm p-6 space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{teamStat.teamName} ({teamStat.teamCode})</h3>
              <p className="text-muted-foreground"><strong className="text-foreground">Số thành viên:</strong> {teamStat.totalMembers}</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Thành viên</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Đơn thuần</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Hữu hiệu</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Baptem</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Thờ phượng</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Lập CLB</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Lên giai đoạn</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Tổng</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Số bản ghi</th>
                  </tr>
                </thead>
                <tbody>
                  {teamStat.byUser.map((user) => (
                    <tr key={user.userId} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 text-sm text-foreground font-medium">{user.fullName}</td>
                      <td className="py-3 px-4 text-sm text-foreground">{user.donThuan}</td>
                      <td className="py-3 px-4 text-sm text-foreground">{user.huuHieu}</td>
                      <td className="py-3 px-4 text-sm text-foreground">{user.baptem}</td>
                      <td className="py-3 px-4 text-sm text-foreground">{user.thoPhuong}</td>
                      <td className="py-3 px-4 text-sm text-foreground">{user.lapCLB}</td>
                      <td className="py-3 px-4 text-sm text-foreground">{user.lenGiaiDoan}</td>
                      <td className="py-3 px-4 text-sm text-foreground font-bold">{user.total}</td>
                      <td className="py-3 px-4 text-sm text-foreground">{user.recordCount}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-primary bg-primary/5">
                    <td className="py-3 px-4 text-sm text-foreground font-bold">TỔNG</td>
                    <td className="py-3 px-4 text-sm text-foreground font-bold">{teamStat.summary.donThuan}</td>
                    <td className="py-3 px-4 text-sm text-foreground font-bold">{teamStat.summary.huuHieu}</td>
                    <td className="py-3 px-4 text-sm text-foreground font-bold">{teamStat.summary.baptem}</td>
                    <td className="py-3 px-4 text-sm text-foreground font-bold">{teamStat.summary.thoPhuong}</td>
                    <td className="py-3 px-4 text-sm text-foreground font-bold">{teamStat.summary.lapCLB}</td>
                    <td className="py-3 px-4 text-sm text-foreground font-bold">{teamStat.summary.lenGiaiDoan}</td>
                    <td className="py-3 px-4 text-sm text-foreground font-bold">{teamStat.summary.total}</td>
                    <td className="py-3 px-4 text-sm text-foreground font-bold">{teamStat.summary.recordCount}</td>
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
