import React, { useEffect, useState } from 'react';
import { activityPointsService, ActivityPointConfig, CreateActivityPointConfigDto } from '../../services/activityPoints';

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
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">⚙️ Cấu hình Điểm Hoạt động</h2>
        <p className="text-muted-foreground">Thiết lập điểm số cho từng loại hoạt động</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg flex items-center justify-between ${
          message.type === 'success' 
            ? 'bg-success/10 border border-success/20 text-success' 
            : 'bg-error/10 border border-error/20 text-error'
        }`}>
          <span>{message.text}</span>
          <button 
            onClick={() => setMessage(null)}
            className="ml-4 hover:opacity-70 transition-opacity"
          >
            ×
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACTIVITY_TYPES.map((activity) => {
          const config = configs.find(c => c.activityType === activity.type);
          const isEditing = editingId === config?.id;

          return (
            <div key={activity.type} className="bg-card rounded-xl border shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{activity.icon}</span>
                  <h3 className="font-semibold text-foreground">{activity.name}</h3>
                </div>
                {config && (
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                    config.status === 'active' 
                      ? 'bg-success/10 text-success' 
                      : 'bg-error/10 text-error'
                  }`}>
                    {config.status === 'active' ? '✓ Hoạt động' : '✗ Tạm dừng'}
                  </span>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Tên hoạt động:</label>
                    <input
                      type="text"
                      value={formData.activityName}
                      onChange={(e) => setFormData({ ...formData, activityName: e.target.value })}
                      placeholder="Nhập tên hoạt động"
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Điểm mỗi đơn vị:</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.pointPerUnit}
                      onChange={(e) => setFormData({ ...formData, pointPerUnit: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Trạng thái:</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Tạm dừng</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                      onClick={handleSave}
                    >
                      💾 Lưu
                    </button>
                    <button 
                      className="flex-1 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
                      onClick={handleCancel}
                    >
                      ✗ Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {config ? (
                    <>
                      <div className="text-center py-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                        <div className="space-y-1">
                          <span className="text-4xl font-bold text-primary">{config.pointPerUnit}</span>
                          <p className="text-sm text-muted-foreground">điểm/đơn vị</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <button
                          className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                          onClick={() => handleEdit(config)}
                        >
                          ✏️ Chỉnh sửa
                        </button>
                        <div className="flex gap-2">
                          <button
                            className="flex-1 px-3 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-bold"
                            onClick={() => handleQuickUpdate(config.activityType, config.pointPerUnit + 1)}
                            title="Tăng 1 điểm"
                          >
                            +1
                          </button>
                          <button
                            className="flex-1 px-3 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-bold"
                            onClick={() => handleQuickUpdate(config.activityType, Math.max(0, config.pointPerUnit - 1))}
                            title="Giảm 1 điểm"
                          >
                            -1
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 space-y-4">
                      <p className="text-muted-foreground">Chưa có cấu hình</p>
                      <button
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
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

      <div className="bg-muted/50 rounded-xl border p-6 space-y-3">
        <h3 className="text-lg font-semibold text-foreground">ℹ️ Hướng dẫn</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span>Điểm số sẽ được tính: <strong className="text-foreground">Số lượng × Điểm mỗi đơn vị</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span>Ví dụ: Nếu &quot;Đơn thuần&quot; = 1 điểm/đơn vị, và có 10 đơn vị → Tổng điểm = 10 điểm</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span>Bạn có thể tạm dừng một loại hoạt động bằng cách đặt trạng thái &quot;Tạm dừng&quot;</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span>Dùng nút +1/-1 để điều chỉnh nhanh điểm số</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

