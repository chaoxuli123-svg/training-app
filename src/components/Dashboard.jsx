import { useMemo } from 'react';
import { format } from 'date-fns';
import { calculatePaceZones, formatPace } from '../utils/paceCalculator';
import { calculateFatigueStatus, calculateWeeklyStats, generateTrainingSuggestions, analyzeWeightTrend } from '../utils/dataAnalyzer';

function Dashboard({ userProfile, bodyData, runningLogs, strengthLogs }) {
  // 计算配速区间
  const paceZones = useMemo(() => {
    return calculatePaceZones(userProfile.halfMarathonPB);
  }, [userProfile.halfMarathonPB]);

  // 获取最新的身体数据
  const latestBodyData = useMemo(() => {
    if (!bodyData || bodyData.length === 0) return null;
    return [...bodyData].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  }, [bodyData]);

  // 计算疲劳状态
  const fatigueStatus = useMemo(() => {
    const recentLogs = [...runningLogs, ...strengthLogs]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
    return calculateFatigueStatus(recentLogs, bodyData);
  }, [runningLogs, strengthLogs, bodyData]);

  // 计算本周统计
  const weeklyStats = useMemo(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // 周一
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // 周日

    return calculateWeeklyStats(
      runningLogs,
      strengthLogs,
      format(startOfWeek, 'yyyy-MM-dd'),
      format(endOfWeek, 'yyyy-MM-dd')
    );
  }, [runningLogs, strengthLogs]);

  // 分析体重趋势
  const weightTrend = useMemo(() => {
    return analyzeWeightTrend(bodyData);
  }, [bodyData]);

  // 生成训练建议
  const suggestions = useMemo(() => {
    return generateTrainingSuggestions(weeklyStats, fatigueStatus, weightTrend);
  }, [weeklyStats, fatigueStatus, weightTrend]);

  // 获取疲劳状态的样式
  const getFatigueStatusClass = (level) => {
    switch (level) {
      case 'high':
        return 'badge-danger';
      case 'medium':
        return 'badge-warning';
      default:
        return 'badge-success';
    }
  };

  const getFatigueStatusText = (level) => {
    switch (level) {
      case 'high':
        return '疲劳较高';
      case 'medium':
        return '中等疲劳';
      default:
        return '状态良好';
    }
  };

  return (
    <div>
      {/* 今日概览 */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">今日概览</h2>
          <span className={`badge ${getFatigueStatusClass(fatigueStatus.level)}`}>
            {getFatigueStatusText(fatigueStatus.level)}
          </span>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-value">
              {latestBodyData ? latestBodyData.weight : '--'}
            </span>
            <div className="stat-label">当前体重 (kg)</div>
            {weightTrend.weeklyChange !== 0 && (
              <div className={`stat-change ${weightTrend.weeklyChange < 0 ? 'positive' : 'negative'}`}>
                {weightTrend.weeklyChange > 0 ? '+' : ''}{weightTrend.weeklyChange} kg/周
              </div>
            )}
          </div>

          <div className="stat-card">
            <span className="stat-value">
              {latestBodyData && latestBodyData.bodyFat ? latestBodyData.bodyFat + '%' : '--'}
            </span>
            <div className="stat-label">体脂率</div>
          </div>

          <div className="stat-card">
            <span className="stat-value">{weeklyStats.totalDistance}</span>
            <div className="stat-label">本周跑量 (km)</div>
          </div>

          <div className="stat-card">
            <span className="stat-value">{weeklyStats.strengthCount}</span>
            <div className="stat-label">本周力量</div>
          </div>
        </div>
      </div>

      {/* 训练建议 */}
      {suggestions.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">训练建议</h2>
          </div>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`alert alert-${suggestion.type}`}
              style={{ marginBottom: index < suggestions.length - 1 ? '0.75rem' : 0 }}
            >
              <strong>{suggestion.title}</strong>
              <div style={{ marginTop: '0.25rem' }}>{suggestion.message}</div>
            </div>
          ))}
        </div>
      )}

      {/* 配速区间参考 */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">配速区间参考</h2>
          <div className="card-subtitle">基于半马 PB: {userProfile.halfMarathonPB}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {Object.entries(paceZones).map(([key, zone]) => (
            <div key={key} className="list-item" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div className="list-item-content">
                <div className="list-item-title">{zone.name}</div>
                <div className="list-item-subtitle">{zone.description}</div>
              </div>
              <div style={{ textAlign: 'right', fontWeight: '600', color: 'var(--primary-color)' }}>
                {formatPace(zone.min)} - {formatPace(zone.max)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 最近训练 */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">最近训练</h2>
        </div>

        {[...runningLogs, ...strengthLogs]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5)
          .map((log) => (
            <div key={log.id} className="list-item">
              <div className="list-item-content">
                <div className="list-item-title">
                  {log.type === 'easy' && '轻松跑'}
                  {log.type === 'tempo' && '节奏跑'}
                  {log.type === 'interval' && '间歇跑'}
                  {log.type === 'long' && '长距离跑'}
                  {log.type === 'recovery' && '恢复跑'}
                  {log.type === 'upper_push' && '上肢推'}
                  {log.type === 'upper_pull' && '上肢拉'}
                  {log.type === 'lower' && '下肢力量'}
                  {log.type === 'core' && '核心训练'}
                  {log.type === 'full_body' && '全身力量'}
                  {!log.type && log.name}
                </div>
                <div className="list-item-subtitle">
                  {format(new Date(log.date), 'MM月dd日')}
                  {log.distance && ` · ${log.distance}km`}
                  {log.duration && ` · ${Math.round(log.duration / 60)}分钟`}
                </div>
              </div>
              {log.completed && (
                <span className="badge badge-success">已完成</span>
              )}
            </div>
          ))}

        {[...runningLogs, ...strengthLogs].length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <div className="empty-state-text">暂无训练记录</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
