import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculate7DayAverage, analyzeWeightTrend } from '../utils/dataAnalyzer';

function BodyData({ bodyData, setBodyData }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    weight: '',
    bodyFat: '',
    waist: '',
    sleepHours: '',
    fatigueLevel: 5,
    hungerLevel: 5,
    notes: ''
  });

  // 体重7日移动平均
  const weight7DayAvg = useMemo(() => {
    return calculate7DayAverage(bodyData, 'weight');
  }, [bodyData]);

  // 分析体重趋势
  const weightTrend = useMemo(() => {
    return analyzeWeightTrend(bodyData);
  }, [bodyData]);

  // 最新数据
  const latestData = useMemo(() => {
    if (!bodyData || bodyData.length === 0) return null;
    return [...bodyData].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  }, [bodyData]);

  // 排序后的数据
  const sortedData = useMemo(() => {
    return [...bodyData].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [bodyData]);

  // 添加身体数据
  const handleSubmit = (e) => {
    e.preventDefault();

    const newData = {
      id: Date.now().toString(),
      date: formData.date,
      weight: parseFloat(formData.weight),
      bodyFat: formData.bodyFat ? parseFloat(formData.bodyFat) : null,
      waist: formData.waist ? parseFloat(formData.waist) : null,
      sleepHours: formData.sleepHours ? parseFloat(formData.sleepHours) : null,
      fatigueLevel: parseInt(formData.fatigueLevel),
      hungerLevel: parseInt(formData.hungerLevel),
      notes: formData.notes
    };

    setBodyData([...bodyData, newData]);
    setShowAddModal(false);
    resetForm();
  };

  // 删除记录
  const handleDelete = (id) => {
    if (confirm('确定要删除这条身体数据吗？')) {
      setBodyData(bodyData.filter(data => data.id !== id));
    }
  };

  // 重置表单
  const resetForm = () => {
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      weight: '',
      bodyFat: '',
      waist: '',
      sleepHours: '',
      fatigueLevel: 5,
      hungerLevel: 5,
      notes: ''
    });
  };

  // 获取趋势状态样式
  const getTrendClass = (status) => {
    switch (status) {
      case 'ideal':
        return 'alert-success';
      case 'too_fast':
        return 'alert-danger';
      case 'plateau':
        return 'alert-warning';
      default:
        return 'alert-info';
    }
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
          ➕ 添加身体数据
        </button>
      </div>

      {/* 当前数据概览 */}
      {latestData && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">当前数据</h2>
            <div className="card-subtitle">{format(new Date(latestData.date), 'yyyy-MM-dd')}</div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-value">{latestData.weight}</span>
              <div className="stat-label">体重 (kg)</div>
              {weightTrend.weeklyChange !== 0 && (
                <div className={`stat-change ${weightTrend.weeklyChange < 0 ? 'positive' : 'negative'}`}>
                  {weightTrend.weeklyChange > 0 ? '+' : ''}{weightTrend.weeklyChange} kg/周
                </div>
              )}
            </div>

            <div className="stat-card">
              <span className="stat-value">
                {latestData.bodyFat ? latestData.bodyFat + '%' : '--'}
              </span>
              <div className="stat-label">体脂率</div>
            </div>

            <div className="stat-card">
              <span className="stat-value">
                {latestData.waist ? latestData.waist : '--'}
              </span>
              <div className="stat-label">腰围 (cm)</div>
            </div>

            <div className="stat-card">
              <span className="stat-value">
                {latestData.sleepHours ? latestData.sleepHours : '--'}
              </span>
              <div className="stat-label">睡眠 (小时)</div>
            </div>
          </div>
        </div>
      )}

      {/* 体重趋势分析 */}
      {weightTrend.trend !== 'insufficient_data' && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">体重趋势分析</h2>
          </div>

          <div className={`alert ${getTrendClass(weightTrend.status)}`}>
            <strong>
              {weightTrend.status === 'ideal' && '✅ 进展理想'}
              {weightTrend.status === 'too_fast' && '⚠️ 减重过快'}
              {weightTrend.status === 'plateau' && '💡 体重停滞'}
              {weightTrend.status === 'gaining' && '📈 体重增加'}
              {weightTrend.status === 'normal' && '📊 正常范围'}
            </strong>
            <div style={{ marginTop: '0.5rem' }}>{weightTrend.suggestion}</div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
              周变化: {weightTrend.weeklyChange > 0 ? '+' : ''}{weightTrend.weeklyChange} kg ({weightTrend.weeklyChangePercent > 0 ? '+' : ''}{weightTrend.weeklyChangePercent}%)
            </div>
          </div>
        </div>
      )}

      {/* 体重趋势图 */}
      {sortedData.length >= 3 && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">体重变化趋势</h2>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weight7DayAvg}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => format(new Date(date), 'MM/dd')}
                stroke="#64748b"
                style={{ fontSize: '0.75rem' }}
              />
              <YAxis
                stroke="#64748b"
                style={{ fontSize: '0.75rem' }}
                domain={['dataMin - 1', 'dataMax + 1']}
              />
              <Tooltip
                contentStyle={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.875rem'
                }}
                labelFormatter={(date) => format(new Date(date), 'yyyy-MM-dd')}
              />
              <Legend wrapperStyle={{ fontSize: '0.875rem' }} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#94a3b8"
                strokeWidth={1}
                dot={{ r: 2 }}
                name="实际体重"
              />
              <Line
                type="monotone"
                dataKey="average"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="7日平均"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 身体数据记录列表 */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">身体数据记录</h2>
          <div className="card-subtitle">共 {bodyData.length} 条记录</div>
        </div>

        {[...bodyData].sort((a, b) => new Date(b.date) - new Date(a.date)).length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <div className="empty-state-text">还没有身体数据记录</div>
            <button className="btn btn-primary btn-small" onClick={() => setShowAddModal(true)}>
              添加第一条记录
            </button>
          </div>
        ) : (
          [...bodyData].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10).map((data) => (
            <div key={data.id} className="list-item">
              <div className="list-item-content">
                <div className="list-item-title">
                  {format(new Date(data.date), 'yyyy-MM-dd')}
                </div>
                <div className="list-item-subtitle">
                  体重: {data.weight}kg
                  {data.bodyFat && ` | 体脂: ${data.bodyFat}%`}
                  {data.waist && ` | 腰围: ${data.waist}cm`}
                </div>
                <div className="list-item-subtitle">
                  {data.sleepHours && `睡眠: ${data.sleepHours}h`}
                  {data.fatigueLevel && ` | 疲劳: ${data.fatigueLevel}/10`}
                </div>
              </div>

              <button
                className="btn btn-danger btn-small"
                onClick={() => handleDelete(data.id)}
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
              <h3 className="modal-title">添加身体数据</h3>
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
                <label className="form-label">体重 (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  placeholder="例如: 85.5"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">体脂率 (%) - 可选</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  placeholder="例如: 22.5"
                  value={formData.bodyFat}
                  onChange={(e) => setFormData({ ...formData, bodyFat: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">腰围 (cm) - 可选</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  placeholder="例如: 90"
                  value={formData.waist}
                  onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">睡眠时长 (小时) - 可选</label>
                <input
                  type="number"
                  step="0.5"
                  className="form-input"
                  placeholder="例如: 7.5"
                  value={formData.sleepHours}
                  onChange={(e) => setFormData({ ...formData, sleepHours: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">疲劳感 (1-10): {formData.fatigueLevel}</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  className="form-input"
                  value={formData.fatigueLevel}
                  onChange={(e) => setFormData({ ...formData, fatigueLevel: e.target.value })}
                  style={{ height: '40px' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">饥饿感 (1-10): {formData.hungerLevel}</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  className="form-input"
                  value={formData.hungerLevel}
                  onChange={(e) => setFormData({ ...formData, hungerLevel: e.target.value })}
                  style={{ height: '40px' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">备注 (可选)</label>
                <textarea
                  className="form-textarea"
                  placeholder="今日感受、饮食情况等"
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

export default BodyData;
