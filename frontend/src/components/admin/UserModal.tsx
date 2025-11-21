import React, { useState, useEffect } from 'react';
import { usersService, User, CreateUserDto } from '../../services/users';
import { Team } from '../../services/teams';
import './Modal.css';

interface UserModalProps {
  user: User | null;
  teams: Team[];
  onClose: () => void;
}

export const UserModal: React.FC<UserModalProps> = ({ user, teams, onClose }) => {
  const [formData, setFormData] = useState<CreateUserDto>({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'user',
    teamId: '',
    status: 'active',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        fullName: user.fullName,
        email: user.email || '',
        phone: user.phone || '',
        role: user.role,
        teamId: user.teamId || '',
        status: user.status,
        password: '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const submitData = { ...formData };
      if (!submitData.password) {
        delete submitData.password;
      }

      if (user) {
        await usersService.update(user.id, submitData);
      } else {
        if (!submitData.password) {
          setError('Mật khẩu là bắt buộc khi tạo mới');
          setLoading(false);
          return;
        }
        await usersService.create(submitData);
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi lưu tài khoản');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{user ? 'Sửa Tài khoản' : 'Thêm Tài khoản'}</h3>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group form-group-full">
                <label>Username *</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
              <div className="form-group form-group-full">
                <label>Họ và tên *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password {user ? '(để trống nếu không đổi)' : '*'}</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!user}
                />
              </div>
              <div className="form-group">
                <label>Vai trò *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label>Team</label>
                <select
                  value={formData.teamId}
                  onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
                >
                  <option value="">-- Không chọn --</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.teamCode} - {team.teamName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
