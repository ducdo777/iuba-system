import React, { useState, useEffect } from 'react';
import { activityDataService, ActivityData, CreateActivityDataDto } from '../../services/activityData';
import './Modal.css';

interface DataModalProps {
  data: ActivityData | null;
  onClose: () => void;
}

export const DataModal: React.FC<DataModalProps> = ({ data, onClose }) => {
  const [formData, setFormData] = useState<CreateActivityDataDto>({
    date: new Date().toISOString().split('T')[0],
    donThuan: 0,
    huuHieu: 0,
    baptem: 0,
    thoPhuong: 0,
    lapCLB: 0,
    lenGiaiDoan: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (data) {
      setFormData({
        date: data.date,
        donThuan: data.donThuan || 0,
        huuHieu: data.huuHieu || 0,
        baptem: data.baptem || 0,
        thoPhuong: data.thoPhuong || 0,
        lapCLB: data.lapCLB || 0,
        lenGiaiDoan: data.lenGiaiDoan || 0,
      });
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (data) {
        await activityDataService.update(data.id, formData);
      } else {
        await activityDataService.create(formData);
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi lưu dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{data ? 'Sửa dữ liệu' : 'Thêm dữ liệu'}</h3>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group form-group-full">
                <label>Ngày *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Đơn thuần *</label>
                <input
                  type="number"
                  min="0"
                  value={formData.donThuan}
                  onChange={(e) => setFormData({ ...formData, donThuan: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Hữu hiệu *</label>
                <input
                  type="number"
                  min="0"
                  value={formData.huuHieu}
                  onChange={(e) => setFormData({ ...formData, huuHieu: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Baptem *</label>
                <input
                  type="number"
                  min="0"
                  value={formData.baptem}
                  onChange={(e) => setFormData({ ...formData, baptem: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Thờ phượng *</label>
                <input
                  type="number"
                  min="0"
                  value={formData.thoPhuong}
                  onChange={(e) => setFormData({ ...formData, thoPhuong: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Lập CLB *</label>
                <input
                  type="number"
                  min="0"
                  value={formData.lapCLB}
                  onChange={(e) => setFormData({ ...formData, lapCLB: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Lên giai đoạn *</label>
                <input
                  type="number"
                  min="0"
                  value={formData.lenGiaiDoan}
                  onChange={(e) => setFormData({ ...formData, lenGiaiDoan: parseInt(e.target.value) || 0 })}
                  required
                />
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
