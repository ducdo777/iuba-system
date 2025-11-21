import React, { useEffect, useState } from 'react';
import { activityPointsService, ActivityPointConfig, CreateActivityPointConfigDto } from '../../services/activityPoints';
import './AdminPoints.css';

const ACTIVITY_TYPES = [
  { type: 'donThuan', name: 'Đơn thuần', icon: '📋' },
  { type: 'huuHieu', name: 'Hữu hiệu', icon: '✅' },
  { type: 'baptem', name: 'Baptem', icon: '💧' },
  { type: 'thoPhuong', name: 'Thờ phượng', icon: '🙏' },
  { type: 'lapCLB', name: 'Lập CLB', icon: '👥' },
  { type: 'lenGiaiDoan', name: 'Lên giai đoạn', icon: '📈' },
];

export const AdminPoints: React.FC = () => {
  const [configs, setConfigs] = useState<ActivityPointConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateActivityPointConfigDto>({
    activityType: 'donThuan',
    activityName: '',
    pointPerUnit: 0,
    status: 'active',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      setLoading(true);
      const data = await activityPointsService.getAll();
      setConfigs(data);
      
      // If no configs exist, initialize defaults
      if (data.length === 0) {
        await activityPointsService.initialize();
        const newData = await activityPointsService.getAll();
        setConfigs(newData);
      }
    } catch (error) {
      console.error('Error loading point configs:', error);
      setMessage({ type: 'error', text: 'Không thể tải cấu hình điểm' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (config: ActivityPointConfig) => {
    setEditingId(config.id);
    setFormData({
      activityType: config.activityType,
      activityName: config.activityName,
      pointPerUnit: config.pointPerUnit,
      status: config.status,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      activityType: 'donThuan',
      activityName: '',
      pointPerUnit: 0,
      status: 'active',
    });
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await activityPointsService.update(editingId, formData);
        setMessage({ type: 'success', text: 'Cập nhật điểm thành công!' });
      } else {
        await activityPointsService.create(formData);
        setMessage({ type: 'success', text: 'Tạo cấu hình điểm thành công!' });
      }
      await loadConfigs();
      handleCancel();
    } catch (error: any) {
      console.error('Error saving point config:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Không thể lưu cấu hình điểm' });
    }
  };

  const handleQuickUpdate = async (type: string, pointPerUnit: number) => {
    try {
      const config = configs.find(c => c.activityType === type);
      if (config) {
        await activityPointsService.updateByType(type, { pointPerUnit });
        setMessage({ type: 'success', text: 'Cập nhật điểm thành công!' });
        await loadConfigs();
      }
    } catch (error: any) {
      console.error('Error updating point:', error);
      setMessage({ type: 'error', text: 'Không thể cập nhật điểm' });
    }
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="admin-points">
      <div className="admin-points-header">
        <h2>⚙️ Cấu hình Điểm Hoạt động</h2>
        <p className="subtitle">Thiết lập điểm số cho từng loại hoạt động</p>
      </div>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
          <button onClick={() => setMessage(null)}>×</button>
        </div>
      )}

      <div className="points-grid">
        {ACTIVITY_TYPES.map((activity) => {
          const config = configs.find(c => c.activityType === activity.type);
          const isEditing = editingId === config?.id;

          return (
            <div key={activity.type} className="point-card">
              <div className="point-card-header">
                <span className="point-icon">{activity.icon}</span>
                <h3>{activity.name}</h3>
                {config && (
                  <span className={`status-badge ${config.status}`}>
                    {config.status === 'active' ? '✓ Hoạt động' : '✗ Tạm dừng'}
                  </span>
                )}
              </div>

              {isEditing ? (
                <div className="point-edit-form">
                  <div className="form-group">
                    <label>Tên hoạt động:</label>
                    <input
                      type="text"
                      value={formData.activityName}
                      onChange={(e) => setFormData({ ...formData, activityName: e.target.value })}
                      placeholder="Nhập tên hoạt động"
                    />
                  </div>
                  <div className="form-group">
                    <label>Điểm mỗi đơn vị:</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.pointPerUnit}
                      onChange={(e) => setFormData({ ...formData, pointPerUnit: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="form-group">
                    <label>Trạng thái:</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                    >
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Tạm dừng</option>
                    </select>
                  </div>
                  <div className="form-actions">
                    <button className="btn-save" onClick={handleSave}>
                      💾 Lưu
                    </button>
                    <button className="btn-cancel" onClick={handleCancel}>
                      ✗ Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <div className="point-card-content">
                  {config ? (
                    <>
                      <div className="point-display">
                        <div className="point-value">
                          <span className="point-number">{config.pointPerUnit}</span>
                          <span className="point-unit">điểm/đơn vị</span>
                        </div>
                      </div>
                      <div className="point-actions">
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(config)}
                        >
                          ✏️ Chỉnh sửa
                        </button>
                        <div className="quick-update">
                          <button
                            className="btn-quick"
                            onClick={() => handleQuickUpdate(config.activityType, config.pointPerUnit + 1)}
                            title="Tăng 1 điểm"
                          >
                            +1
                          </button>
                          <button
                            className="btn-quick"
                            onClick={() => handleQuickUpdate(config.activityType, Math.max(0, config.pointPerUnit - 1))}
                            title="Giảm 1 điểm"
                          >
                            -1
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="point-empty">
                      <p>Chưa có cấu hình</p>
                      <button
                        className="btn-create"
                        onClick={() => {
                          setFormData({
                            activityType: activity.type as any,
                            activityName: activity.name,
                            pointPerUnit: 0,
                            status: 'active',
                          });
                          setEditingId('new');
                        }}
                      >
                        ➕ Tạo cấu hình
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="points-info">
        <h3>ℹ️ Hướng dẫn</h3>
        <ul>
          <li>Điểm số sẽ được tính: <strong>Số lượng × Điểm mỗi đơn vị</strong></li>
          <li>Ví dụ: Nếu "Đơn thuần" = 1 điểm/đơn vị, và có 10 đơn vị → Tổng điểm = 10 điểm</li>
          <li>Bạn có thể tạm dừng một loại hoạt động bằng cách đặt trạng thái "Tạm dừng"</li>
          <li>Dùng nút +1/-1 để điều chỉnh nhanh điểm số</li>
        </ul>
      </div>
    </div>
  );
};

