import React, { useEffect, useState } from 'react';
import { usersService, User } from '../../services/users';
import { teamsService, Team } from '../../services/teams';
import { UserModal } from '../../components/admin/UserModal';


export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, teamsData] = await Promise.all([
        usersService.getAll(),
        teamsService.getAll(),
      ]);
      setUsers(usersData);
      setTeams(teamsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
      try {
        await usersService.delete(id);
        loadData();
      } catch (error) {
        alert('Lỗi khi xóa tài khoản');
      }
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingUser(null);
    loadData();
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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-3xl font-bold text-foreground">Quản lý Tài khoản</h2>
        <button 
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
          onClick={handleCreate}
        >
          <i className="fas fa-plus"></i> Thêm tài khoản
        </button>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
          <thead>
            <tr>
              <th>Username</th>
              <th>Họ tên</th>
              <th>Team</th>
              <th>Vai trò</th>
              <th>Email</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center' }}>
                  Không có tài khoản nào
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.fullName}</td>
                  <td>{user.team?.teamName || '-'}</td>
                  <td>
                    <span className={`badge ${user.role === 'admin' ? 'badge-info' : 'badge-success'}`}>
                      {user.role === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td>{user.email || '-'}</td>
                  <td>
                    <span className={`badge ${user.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                      {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group">
                      <button className="btn btn-sm btn-primary" onClick={() => handleEdit(user)}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(user.id)}>
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

      {modalOpen && (
        <UserModal
          user={editingUser}
          teams={teams}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

