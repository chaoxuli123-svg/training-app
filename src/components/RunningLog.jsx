import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { calculateAveragePace, formatPace, secondsToTime, calculatePaceZones } from '../utils/paceCalculator';

function RunningLog({ userProfile, runningLogs, setRunningLogs }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    type: 'easy',
    distance: '',
    duration: '',
    avgHeartRate: '',
    maxHeartRate: '',
    rpe: 5,
    notes: ''
  });

  // 计算配速区间
  const paceZones = useMemo(() => {
    return calculatePaceZones(userProfile.halfMarathonPB);
  }, [userProfile.halfMarathonPB]);

  // 排序后的跑步记录
  const sortedLogs = useMemo(() => {
    return [...runningLogs].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [runningLogs]);

  // 添加跑步记录
  const handleSubmit = (e) => {
    e.preventDefault();

    const durationInSeconds = parseInt(formData.duration) * 60;
    const distance = parseFloat(formData.distance);
    const avgPace = calculateAveragePace(distance, durationInSeconds);

    const newLog = {
      id: Date.now().toString(),
      date: formData.date,
      type: formData.type,
      distance: distance,
      duration: durationInSeconds,
      avgPace: avgPace,
      avgHeartRate: formData.avgHeartRate ? parseInt(formData.avgHeartRate) : null,
      maxHeartRate: formData.maxHeartRate ? parseInt(formData.maxHeartRate) : null,
      rpe: parseInt(formData.rpe),
      notes: formData.notes,
      completed: true
    };

    setRunningLogs([...runningLogs, newLog]);
    setShowAddModal(false);
    resetForm();
  };

  // 删除记录
  const handleDelete = (id) => {
    if (confirm('确定要删除这条跑步记录吗？')) {
      setRunningLogs(runningLogs.filter(log => log.id !== id));
    }
  };

  // 重置表单
  const resetForm = () => {
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      type: 'easy',
      distance: '',
      duration: '',
      avgHeartRate: '',
      maxHeartRate: '',
      rpe: 5,
      notes: ''
    });
  };

  // 获取跑步类型名称
  const getRunTypeName = (type) => {
    const types = {
      easy: '轻松跑',
      tempo: '节奏跑',
      interval: '间歇跑',
      long: '长距离跑',
      recovery: '恢复跑'
    };
    return types[type] || type;
  };

  // 获取跑步类型徽章样式
  const getRunTypeBadge = (type) => {
    const badges = {
      easy: 'badge-success',
      tempo: 'badge-warning',
      interval: 'badge-danger',
      long: 'badge-primary',
      recovery: 'badge-success'
    };
    return badges[type] || 'badge-primary';
  };

  return (
    <div>
      {/* 添加按钮 */}
      <div className="card">
        <button
          className="btn btn-primary"
          style={{ width: '100%' }}
          onClick={() => setShowAddModal(true)}
        >
          ➕ 添加跑步记录
        </button>
      </div>

      {/* 跑步记录列表 */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">跑步记录</h2>
          <div className="card-subtitle">共 {runningLogs.length} 条记录</div>
        </div>

        {sortedLogs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏃</div>
            <div className="empty-state-text">还没有跑步记录</div>
            <button className="btn btn-primary btn-small" onClick={() => setShowAddModal(true)}>
              添加第一条记录
            </button>
          </div>
        ) : (
          sortedLogs.map((log) => (
            <div key={log.id} className="list-item">
              <div className="list-item-content" style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span className={`badge ${getRunTypeBadge(log.type)}`}>
                    {getRunTypeName(log.type)}
                  </span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {format(new Date(log.date), 'yyyy-MM-dd')}
                  </span>
                </div>

                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  <div>
                    🏃 距离: {log.distance} km | ⏱️ 时间: {secondsToTime(log.duration, true)}
                  </div>
                  <div style={{ marginTop: '0.25rem' }}>
                    📊 配速: {formatPace(log.avgPace)} |
                    {log.avgHeartRate && ` ❤️ 心率: ${log.avgHeartRate}`} |
                    💪 RPE: {log.rpe}/10
                  </div>
                  {log.notes && (
                    <div style={{ marginTop: '0.25rem', fontStyle: 'italic' }}>
                      💭 {log.notes}
                    </div>
                  )}
                </div>
              </div>

              <button
                className="btn btn-danger btn-small"
                onClick={() => handleDelete(log.id)}
              >
                删除
              </button>
            </div>
          ))
        )}
      </div>

      {/* 添加记录模态框 */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">添加跑步记录</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">日期</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">跑步类型</label>
                <select
                  className="form-select"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  <option value="easy">轻松跑</option>
                  <option value="tempo">节奏跑</option>
                  <option value="interval">间歇跑</option>
                  <option value="long">长距离跑</option>
                  <option value="recovery">恢复跑</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">距离 (公里)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  placeholder="例如: 10"
                  value={formData.distance}
                  onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">时间 (分钟)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="例如: 50"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">平均心率 (可选)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="例如: 150"
                  value={formData.avgHeartRate}
                  onChange={(e) => setFormData({ ...formData, avgHeartRate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">最大心率 (可选)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="例如: 175"
                  value={formData.maxHeartRate}
                  onChange={(e) => setFormData({ ...formData, maxHeartRate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">主观疲劳 RPE (1-10): {formData.rpe}</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  className="form-input"
                  value={formData.rpe}
                  onChange={(e) => setFormData({ ...formData, rpe: e.target.value })}
                  style={{ height: '40px' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">备注 (可选)</label>
                <textarea
                  className="form-textarea"
                  placeholder="训练感受、天气状况等"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  取消
                </button>
                <button type="submit" className="btn btn-primary">
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RunningLog;
