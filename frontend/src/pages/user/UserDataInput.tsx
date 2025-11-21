import React, { useEffect, useState, useRef } from 'react';
import { activityDataService, ActivityData, CreateActivityDataDto } from '../../services/activityData';
import { statisticsService, TeamStatistics } from '../../services/statistics';
import './UserDataInput.css';

interface EditableRow extends CreateActivityDataDto {
  id?: string;
  isNew?: boolean;
  isEditing?: boolean;
}

export const UserDataInput: React.FC = () => {
  const [data, setData] = useState<ActivityData[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingRow, setEditingRow] = useState<EditableRow | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    loadData();
    loadTeamStats();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const dataList = await activityDataService.getAll();
      setData(dataList);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTeamStats = async () => {
    try {
      const stats = await statisticsService.getMyTeam();
      setTeamStats(stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleAddNew = () => {
    const newRow: EditableRow = {
      date: new Date().toISOString().split('T')[0],
      donThuan: 0,
      huuHieu: 0,
      baptem: 0,
      thoPhuong: 0,
      lapCLB: 0,
      lenGiaiDoan: 0,
      isNew: true,
      isEditing: true,
    };
    setEditingRow(newRow);
    // Scroll to bottom to show new row
    setTimeout(() => {
      tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  };

  const handleEdit = (item: ActivityData) => {
    setEditingRow({
      id: item.id,
      date: item.date,
      donThuan: item.donThuan || 0,
      huuHieu: item.huuHieu || 0,
      baptem: item.baptem || 0,
      thoPhuong: item.thoPhuong || 0,
      lapCLB: item.lapCLB || 0,
      lenGiaiDoan: item.lenGiaiDoan || 0,
      isEditing: true,
    });
  };

  const handleCancel = () => {
    setEditingRow(null);
  };

  const handleSave = async (row: EditableRow) => {
    if (!row.date) {
      alert('Vui lòng chọn ngày');
      return;
    }

    setSaving(row.id || 'new');
    try {
      const saveData: CreateActivityDataDto = {
        date: row.date,
        donThuan: row.donThuan || 0,
        huuHieu: row.huuHieu || 0,
        baptem: row.baptem || 0,
        thoPhuong: row.thoPhuong || 0,
        lapCLB: row.lapCLB || 0,
        lenGiaiDoan: row.lenGiaiDoan || 0,
      };

      if (row.isNew && !row.id) {
        // Create new
        await activityDataService.create(saveData);
      } else if (row.id) {
        // Update existing
        await activityDataService.update(row.id, saveData);
      }

      setEditingRow(null);
      loadData();
      loadTeamStats();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Lỗi khi lưu dữ liệu');
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dữ liệu này?')) {
      try {
        await activityDataService.delete(id);
        loadData();
        loadTeamStats();
      } catch (error) {
        alert('Lỗi khi xóa dữ liệu');
      }
    }
  };

  const handleFieldChange = (field: keyof EditableRow, value: any) => {
    if (editingRow) {
      setEditingRow({
        ...editingRow,
        [field]: value,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, row: EditableRow) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave(row);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const isEditing = (item: ActivityData | EditableRow) => {
    if ('isEditing' in item && item.isEditing) return true;
    if ('id' in item && editingRow?.id === item.id) return true;
    return editingRow?.isNew && !item.id;
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="user-data-input">
      <div className="page-header">
        <h2>Nhập dữ liệu hoạt động</h2>
        <button 
          className="btn btn-primary" 
          onClick={handleAddNew}
          disabled={!!editingRow}
        >
          <i className="fas fa-plus"></i> Thêm dữ liệu
        </button>
      </div>

      <div className="table-container" ref={tableRef}>
        <table className="inline-edit-table">
          <thead>
            <tr>
              <th>Ngày</th>
              <th>Đơn thuần</th>
              <th>Hữu hiệu</th>
              <th>Baptem</th>
              <th>Thờ phượng</th>
              <th>Lập CLB</th>
              <th>Lên giai đoạn</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {/* New/Editing Row */}
            {editingRow && (
              <tr className={`editing-row ${editingRow.isNew ? 'new-row' : ''}`}>
                <td>
                  <input
                    type="date"
                    value={editingRow.date}
                    onChange={(e) => handleFieldChange('date', e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, editingRow)}
                    className="inline-input"
                    autoFocus
                    required
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={editingRow.donThuan}
                    onChange={(e) => handleFieldChange('donThuan', parseInt(e.target.value) || 0)}
                    onKeyDown={(e) => handleKeyDown(e, editingRow)}
                    className="inline-input"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={editingRow.huuHieu}
                    onChange={(e) => handleFieldChange('huuHieu', parseInt(e.target.value) || 0)}
                    onKeyDown={(e) => handleKeyDown(e, editingRow)}
                    className="inline-input"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={editingRow.baptem}
                    onChange={(e) => handleFieldChange('baptem', parseInt(e.target.value) || 0)}
                    onKeyDown={(e) => handleKeyDown(e, editingRow)}
                    className="inline-input"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={editingRow.thoPhuong}
                    onChange={(e) => handleFieldChange('thoPhuong', parseInt(e.target.value) || 0)}
                    onKeyDown={(e) => handleKeyDown(e, editingRow)}
                    className="inline-input"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={editingRow.lapCLB}
                    onChange={(e) => handleFieldChange('lapCLB', parseInt(e.target.value) || 0)}
                    onKeyDown={(e) => handleKeyDown(e, editingRow)}
                    className="inline-input"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={editingRow.lenGiaiDoan}
                    onChange={(e) => handleFieldChange('lenGiaiDoan', parseInt(e.target.value) || 0)}
                    onKeyDown={(e) => handleKeyDown(e, editingRow)}
                    className="inline-input"
                  />
                </td>
                <td>
                  <div className="btn-group">
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleSave(editingRow)}
                      disabled={saving === (editingRow.id || 'new')}
                      title="Lưu (Enter)"
                    >
                      {saving === (editingRow.id || 'new') ? (
                        <i className="fas fa-spinner fa-spin"></i>
                      ) : (
                        <i className="fas fa-check"></i>
                      )}
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={handleCancel}
                      disabled={saving === (editingRow.id || 'new')}
                      title="Hủy (Esc)"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {/* Existing Rows */}
            {data.length === 0 && !editingRow ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>
                  <p style={{ color: '#64748b', margin: 0 }}>
                    Chưa có dữ liệu. Click "Thêm dữ liệu" để bắt đầu nhập.
                  </p>
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className={isEditing(item) ? 'hidden' : ''}>
                  <td>{formatDate(item.date)}</td>
                  <td>{item.donThuan || 0}</td>
                  <td>{item.huuHieu || 0}</td>
                  <td>{item.baptem || 0}</td>
                  <td>{item.thoPhuong || 0}</td>
                  <td>{item.lapCLB || 0}</td>
                  <td>{item.lenGiaiDoan || 0}</td>
                  <td>
                    <div className="btn-group">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleEdit(item)}
                        disabled={!!editingRow}
                        title="Sửa"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(item.id)}
                        disabled={!!editingRow}
                        title="Xóa"
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

      {teamStats && (
        <div className="team-stats-section">
          <h3>Thống kê của Team {teamStats.teamName}</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon blue">
                <i className="fas fa-hand-holding-heart"></i>
              </div>
              <div className="stat-info">
                <h3>{teamStats.summary.donThuan}</h3>
                <p>Đơn thuần</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-info">
                <h3>{teamStats.summary.huuHieu}</h3>
                <p>Hữu hiệu</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon orange">
                <i className="fas fa-water"></i>
              </div>
              <div className="stat-info">
                <h3>{teamStats.summary.baptem}</h3>
                <p>Baptem</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon purple">
                <i className="fas fa-praying-hands"></i>
              </div>
              <div className="stat-info">
                <h3>{teamStats.summary.thoPhuong}</h3>
                <p>Thờ phượng</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon teal">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-info">
                <h3>{teamStats.summary.lapCLB}</h3>
                <p>Lập CLB</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon red">
                <i className="fas fa-arrow-up"></i>
              </div>
              <div className="stat-info">
                <h3>{teamStats.summary.lenGiaiDoan}</h3>
                <p>Lên giai đoạn</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon orange">
                <i className="fas fa-list"></i>
              </div>
              <div className="stat-info">
                <h3>{teamStats.summary.total}</h3>
                <p>Tổng cộng</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};