import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { generateStrengthWorkout, STRENGTH_TYPES } from '../utils/trainingPlanGenerator';

function StrengthLog({ strengthLogs, setStrengthLogs }) {
  // 调试信息
  console.log('StrengthLog - strengthLogs:', strengthLogs);
  console.log('StrengthLog - strengthLogs length:', strengthLogs?.length);
  console.log('StrengthLog - strengthLogs type:', typeof strengthLogs);

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    type: 'upper_push',
    name: '',
    duration: '',
    notes: ''
  });

  // 排序后的力量训练记录
  const sortedLogs = useMemo(() => {
    console.log('Computing sortedLogs, input:', strengthLogs);
    if (!Array.isArray(strengthLogs)) {
      console.error('strengthLogs is not an array!', strengthLogs);
      return [];
    }
    const sorted = [...strengthLogs].sort((a, b) => new Date(b.date) - new Date(a.date));
    console.log('Sorted logs:', sorted);
    return sorted;
  }, [strengthLogs]);

  // 添加力量训练记录
  const handleSubmit = (e) => {
    e.preventDefault();

    // 生成训练动作
    const exercises = generateStrengthWorkout(formData.type, false);

    const newLog = {
      id: Date.now().toString(),
      date: formData.date,
      type: formData.type,
      name: formData.name || getTypeName(formData.type),
      duration: parseInt(formData.duration),
      exercises: exercises,
      notes: formData.notes,
      completed: true
    };

    setStrengthLogs([...strengthLogs, newLog]);
    setShowAddModal(false);
    resetForm();
  };

  // 删除记录
  const handleDelete = (id) => {
    if (confirm('确定要删除这条力量训练记录吗？')) {
      setStrengthLogs(strengthLogs.filter(log => log.id !== id));
    }
  };

  // 重置表单
  const resetForm = () => {
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      type: 'upper_push',
      name: '',
      duration: '',
      notes: ''
    });
  };

  // 获取训练类型名称
  const getTypeName = (type) => {
    const types = {
      upper_push: '上肢推',
      upper_pull: '上肢拉',
      lower: '下肢力量',
      core: '核心训练',
      full_body: '全身力量'
    };
    return types[type] || type;
  };

  // 获取训练类型徽章
  const getTypeBadge = (type) => {
    const badges = {
      upper_push: 'badge-primary',
      upper_pull: 'badge-primary',
      lower: 'badge-warning',
      core: 'badge-success',
      full_body: 'badge-danger'
    };
    return badges[type] || 'badge-primary';
  };

  console.log('Rendering StrengthLog, sortedLogs:', sortedLogs);

  return (
    <div>
      {/* 调试信息显示 */}
      <div className="card" style={{ background: '#fff3cd', borderColor: '#ffc107' }}>
        <div style={{ fontSize: '0.875rem', fontFamily: 'monospace' }}>
          <strong>🐛 调试信息：</strong><br/>
          strengthLogs存在: {strengthLogs ? '✅' : '❌'}<br/>
          strengthLogs类型: {typeof strengthLogs}<br/>
          strengthLogs是数组: {Array.isArray(strengthLogs) ? '✅' : '❌'}<br/>
          strengthLogs长度: {strengthLogs?.length || 0}<br/>
          sortedLogs长度: {sortedLogs?.length || 0}<br/>
          <small style={{ color: '#666' }}>打开浏览器控制台(F12)查看详细日志</small>
        </div>
      </div>

      {/* 添加按钮 */}
      <div className="card">
        <button
          className="btn btn-primary"
          style={{ width: '100%' }}
          onClick={() => setShowAddModal(true)}
        >
          ➕ 添加力量训练记录
        </button>
      </div>

      {/* 力量训练记录列表 */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">力量训练记录</h2>
          <div className="card-subtitle">共 {strengthLogs.length} 条记录</div>
        </div>

        {sortedLogs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏋️</div>
            <div className="empty-state-text">还没有力量训练记录</div>
            <button className="btn btn-primary btn-small" onClick={() => setShowAddModal(true)}>
              添加第一条记录
            </button>
          </div>
        ) : (
          sortedLogs.map((log) => (
            <div key={log.id} className="list-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div className="list-item-content">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span className={`badge ${getTypeBadge(log.type)}`}>
                      {log.name}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {format(new Date(log.date), 'yyyy-MM-dd')}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    ⏱️ 时长: {log.duration} 分钟
                    {log.exercises && ` | 💪 ${log.exercises.length} 个动作`}
                  </div>

                  {log.notes && (
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem', fontStyle: 'italic' }}>
                      💭 {log.notes}
                    </div>
                  )}
                </div>

                <button
                  className="btn btn-danger btn-small"
                  onClick={() => handleDelete(log.id)}
                >
                  删除
                </button>
              </div>

              {/* 显示训练动作 */}
              {log.exercises && log.exercises.length > 0 && (
                <div style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                    训练动作:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {log.exercises.slice(0, 3).map((exercise, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '0.5rem',
                          background: 'var(--bg-color)',
                          borderRadius: '6px',
                          fontSize: '0.8125rem'
                        }}
                      >
                        <strong>{exercise.name}</strong>
                        <span style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
                          {exercise.sets}组 × {exercise.reps}次
                        </span>
                      </div>
                    ))}
                    {log.exercises.length > 3 && (
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                        还有 {log.exercises.length - 3} 个动作...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 添加记录模态框 */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">添加力量训练记录</h3>
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
                <label className="form-label">训练类型</label>
                <select
                  className="form-select"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  <option value={STRENGTH_TYPES.UPPER_PUSH}>上肢推</option>
                  <option value={STRENGTH_TYPES.UPPER_PULL}>上肢拉</option>
                  <option value={STRENGTH_TYPES.LOWER}>下肢力量</option>
                  <option value={STRENGTH_TYPES.CORE}>核心训练</option>
                  <option value={STRENGTH_TYPES.FULL_BODY}>全身力量</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">训练名称 (可选)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="留空使用默认名称"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">时长 (分钟)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="例如: 60"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">备注 (可选)</label>
                <textarea
                  className="form-textarea"
                  placeholder="训练感受、完成情况等"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="alert alert-info" style={{ fontSize: '0.875rem' }}>
                💡 系统会根据选择的训练类型自动生成推荐的训练动作和组数。
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

export default StrengthLog;
