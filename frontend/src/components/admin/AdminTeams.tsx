import React, { useEffect, useState } from 'react';
import { teamsService, Team } from '../../services/teams';
import { TeamModal } from '../../components/admin/TeamModal';


export const AdminTeams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const data = await teamsService.getAll();
      setTeams(data);
    } catch (error) {
      console.error('Error loading teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTeam(null);
    setModalOpen(true);
  };

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa team này?')) {
      try {
        await teamsService.delete(id);
        loadTeams();
      } catch (error) {
        alert('Lỗi khi xóa team');
      }
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingTeam(null);
    loadTeams();
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
    <div className="space-y-6 w-full p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-3xl font-bold text-foreground">Quản lý Team</h2>
        <button 
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
          onClick={handleCreate}
        >
          <i className="fas fa-plus"></i> Thêm Team
        </button>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-muted">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Mã Team</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Tên Team</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Mô tả</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Trạng thái</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {teams.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-muted-foreground">
                    Không có team nào
                  </td>
                </tr>
              ) : (
                teams.map((team) => (
                  <tr key={team.id} className="border-b border-gray-200 hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-sm text-foreground font-medium">{team.teamCode}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{team.teamName}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{team.description || '-'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        team.status === 'active' 
                          ? 'bg-success/10 text-success' 
                          : 'bg-error/10 text-error'
                      }`}>
                        {team.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button 
                          className="px-3 py-1 text-sm bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                          onClick={() => handleEdit(team)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="px-3 py-1 text-sm bg-error text-white rounded-md hover:bg-error-dark transition-colors"
                          onClick={() => handleDelete(team.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && <TeamModal team={editingTeam} onClose={handleModalClose} />}
    </div>
  );
};

