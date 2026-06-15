import { useMemo } from 'react';
import { format, startOfWeek, endOfWeek, addDays } from 'date-fns';
import { calculateWeeklyStats, analyzeWeightTrend, generateTrainingSuggestions, calculateFatigueStatus } from '../utils/dataAnalyzer';
import { secondsToTime } from '../utils/paceCalculator';

function WeeklySummary({ userProfile, bodyData, runningLogs, strengthLogs }) {
  // 计算本周统计
  const weeklyStats = useMemo(() => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 });
    const end = endOfWeek(today, { weekStartsOn: 1 });

    return calculateWeeklyStats(
      runningLogs,
      strengthLogs,
      format(start, 'yyyy-MM-dd'),
      format(end, 'yyyy-MM-dd')
    );
  }, [runningLogs, strengthLogs]);

  // 计算上周统计
  const lastWeekStats = useMemo(() => {
    const today = new Date();
    const start = addDays(startOfWeek(today, { weekStartsOn: 1 }), -7);
    const end = addDays(endOfWeek(today, { weekStartsOn: 1 }), -7);

    return calculateWeeklyStats(
      runningLogs,
      strengthLogs,
      format(start, 'yyyy-MM-dd'),
      format(end, 'yyyy-MM-dd')
    );
  }, [runningLogs, strengthLogs]);

  // 体重趋势
  const weightTrend = useMemo(() => {
    return analyzeWeightTrend(bodyData);
  }, [bodyData]);

  // 疲劳状态
  const fatigueStatus = useMemo(() => {
    const recentLogs = [...runningLogs, ...strengthLogs]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
    return calculateFatigueStatus(recentLogs, bodyData);
  }, [runningLogs, strengthLogs, bodyData]);

  // 生成建议
  const suggestions = useMemo(() => {
    return generateTrainingSuggestions(weeklyStats, fatigueStatus, weightTrend);
  }, [weeklyStats, fatigueStatus, weightTrend]);

  // 计算本周与上周的对比
  const getComparison = (current, previous) => {
    if (previous === 0) return null;
    const change = current - previous;
    const percent = ((change / previous) * 100).toFixed(1);
    return { change, percent };
  };

  const distanceComparison = getComparison(weeklyStats.totalDistance, lastWeekStats.totalDistance);
  const runCountComparison = getComparison(weeklyStats.runCount, lastWeekStats.runCount);
  const strengthCountComparison = getComparison(weeklyStats.strengthCount, lastWeekStats.strengthCount);

  return (
    <div>
      {/* 本周训练总结 */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">本周训练总结</h2>
          <div className="card-subtitle">
            {format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'MM月dd日')} - {format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'MM月dd日')}
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-value">{weeklyStats.totalDistance}</span>
            <div className="stat-label">跑步距离 (km)</div>
            {distanceComparison && (
              <div className={`stat-change ${distanceComparison.change >= 0 ? 'positive' : 'negative'}`}>
                {distanceComparison.change > 0 ? '+' : ''}{distanceComparison.change.toFixed(1)} km ({distanceComparison.percent > 0 ? '+' : ''}{distanceComparison.percent}%)
              </div>
            )}
          </div>

          <div className="stat-card">
            <span className="stat-value">{weeklyStats.runCount}</span>
            <div className="stat-label">跑步次数</div>
            {runCountComparison && (
              <div className={`stat-change ${runCountComparison.change >= 0 ? 'positive' : 'negative'}`}>
                {runCountComparison.change > 0 ? '+' : ''}{runCountComparison.change} 次
              </div>
            )}
          </div>

          <div className="stat-card">
            <span className="stat-value">{weeklyStats.strengthCount}</span>
            <div className="stat-label">力量训练</div>
            {strengthCountComparison && (
              <div className={`stat-change ${strengthCountComparison.change >= 0 ? 'positive' : 'negative'}`}>
                {strengthCountComparison.change > 0 ? '+' : ''}{strengthCountComparison.change} 次
              </div>
            )}
          </div>

          <div className="stat-card">
            <span className="stat-value">{weeklyStats.totalSessions}</span>
            <div className="stat-label">总训练次数</div>
          </div>
        </div>

        {weeklyStats.totalRunTime > 0 && (
          <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-color)', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              总跑步时间: <strong>{secondsToTime(weeklyStats.totalRunTime, true)}</strong>
            </div>
          </div>
        )}
      </div>

      {/* 体重变化 */}
      {weightTrend.trend !== 'insufficient_data' && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">体重变化</h2>
          </div>

          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <div className="stat-card">
              <span className="stat-value">{weightTrend.weeklyChange}</span>
              <div className="stat-label">周变化 (kg)</div>
            </div>

            <div className="stat-card">
              <span className="stat-value">{weightTrend.weeklyChangePercent}%</span>
              <div className="stat-label">周变化率</div>
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            {weightTrend.status === 'ideal' && (
              <div className="alert alert-success">
                ✅ {weightTrend.suggestion}
              </div>
            )}
            {weightTrend.status === 'too_fast' && (
              <div className="alert alert-danger">
                ⚠️ {weightTrend.suggestion}
              </div>
            )}
            {weightTrend.status === 'plateau' && (
              <div className="alert alert-warning">
                💡 {weightTrend.suggestion}
              </div>
            )}
            {weightTrend.status === 'normal' && (
              <div className="alert alert-info">
                📊 {weightTrend.suggestion}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 下周建议 */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">下周建议</h2>
        </div>

        {suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`alert alert-${suggestion.type}`}
              style={{ marginBottom: index < suggestions.length - 1 ? '0.75rem' : 0 }}
            >
              <strong>{suggestion.title}</strong>
              <div style={{ marginTop: '0.25rem' }}>{suggestion.message}</div>
            </div>
          ))
        ) : (
          <div className="alert alert-info">
            📊 继续保持当前训练计划，注意监测疲劳状态和体重变化。
          </div>
        )}

        {/* 通用建议 */}
        <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-color)', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            <strong style={{ color: 'var(--text-primary)' }}>💡 下周训练要点：</strong>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              {weeklyStats.totalDistance < 30 && (
                <li>跑量较低，可适当增加轻松跑距离</li>
              )}
              {weeklyStats.totalDistance > 60 && (
                <li>跑量较高，注意恢复和营养补充</li>
              )}
              {weeklyStats.strengthCount < 2 && (
                <li>力量训练次数不足，建议至少2-3次/周</li>
              )}
              {fatigueStatus.level === 'high' && (
                <li>疲劳较高，下周可适当降低训练强度</li>
              )}
              {fatigueStatus.level === 'low' && weeklyStats.totalDistance < 40 && (
                <li>状态良好，可以逐步增加训练量</li>
              )}
              <li>保持充足睡眠（7-8小时）</li>
              <li>确保蛋白质摄入达标（{userProfile.currentWeight * 1.6}-{userProfile.currentWeight * 2.2}g/天）</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 训练完成度 */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">训练完成度</h2>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>跑步目标</span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {weeklyStats.runCount} / {userProfile.runningDaysPerWeek} 次
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${Math.min((weeklyStats.runCount / userProfile.runningDaysPerWeek) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>力量训练目标</span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {weeklyStats.strengthCount} / {userProfile.strengthDaysPerWeek} 次
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${Math.min((weeklyStats.strengthCount / userProfile.strengthDaysPerWeek) * 100, 100)}%` }}
            />
          </div>
        </div>

        {weeklyStats.runCount >= userProfile.runningDaysPerWeek && weeklyStats.strengthCount >= userProfile.strengthDaysPerWeek && (
          <div className="alert alert-success" style={{ marginTop: '1rem' }}>
            🎉 恭喜！本周训练目标全部达成！
          </div>
        )}
      </div>
    </div>
  );
}

export default WeeklySummary;
