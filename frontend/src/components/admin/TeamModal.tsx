import React, { useState, useEffect } from 'react';
import { teamsService, Team, CreateTeamDto } from '../../services/teams';
import './Modal.css';

interface TeamModalProps {
  team: Team | null;
  onClose: () => void;
}

export const TeamModal: React.FC<TeamModalProps> = ({ team, onClose }) => {
  const [formData, setFormData] = useState<CreateTeamDto>({
    teamCode: '',
    teamName: '',
    description: '',
    status: 'active',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (team) {
      setFormData({
        teamCode: team.teamCode,
        teamName: team.teamName,
        description: team.description || '',
        status: team.status,
      });
    }
  }, [team]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (team) {
        await teamsService.update(team.id, formData);
      } else {
        await teamsService.create(formData);
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi lưu team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{team ? 'Sửa Team' : 'Thêm Team'}</h3>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label>Mã Team *</label>
                <input
                  type="text"
                  value={formData.teamCode}
                  onChange={(e) => setFormData({ ...formData, teamCode: e.target.value })}
                  required
                />
              </div>
              <div className="form-group form-group-full">
                <label>Tên Team *</label>
                <input
                  type="text"
                  value={formData.teamName}
                  onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group form-group-full">
                <label>Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>Trạng thái *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  required
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>
            </div>
            {error && <div className="error-message">{error}</div>}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
