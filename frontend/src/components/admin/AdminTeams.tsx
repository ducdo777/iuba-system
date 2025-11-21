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
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="admin-teams">
      <div className="page-header">
        <h2>Quản lý Team</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          <i className="fas fa-plus"></i> Thêm Team
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Mã Team</th>
              <th>Tên Team</th>
              <th>Mô tả</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {teams.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center' }}>
                  Không có team nào
                </td>
              </tr>
            ) : (
              teams.map((team) => (
                <tr key={team.id}>
                  <td>{team.teamCode}</td>
                  <td>{team.teamName}</td>
                  <td>{team.description || '-'}</td>
                  <td>
                    <span className={`badge ${team.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                      {team.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group">
                      <button className="btn btn-sm btn-primary" onClick={() => handleEdit(team)}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(team.id)}>
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

      {modalOpen && <TeamModal team={editingTeam} onClose={handleModalClose} />}
    </div>
  );
};

