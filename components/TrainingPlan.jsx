import { useMemo } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { generateWeeklyPlan } from '../utils/trainingPlanGenerator';
import { calculateFatigueStatus } from '../utils/dataAnalyzer';

function TrainingPlan({ userProfile, bodyData, runningLogs, strengthLogs }) {
  // 计算疲劳状态
  const fatigueStatus = useMemo(() => {
    const recentLogs = [...runningLogs, ...strengthLogs]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
    return calculateFatigueStatus(recentLogs, bodyData);
  }, [runningLogs, strengthLogs, bodyData]);

  // 生成本周训练计划
  const weeklyPlan = useMemo(() => {
    return generateWeeklyPlan(userProfile, fatigueStatus);
  }, [userProfile, fatigueStatus]);

  // 获取活动类型的图标
  const getActivityIcon = (type) => {
    switch (type) {
      case 'running':
        return '🏃';
      case 'strength':
        return '🏋️';
      case 'rest':
        return '🛌';
      default:
        return '📝';
    }
  };

  // 获取强度样式
  const getIntensityBadge = (intensity) => {
    switch (intensity) {
      case 'high':
        return 'badge-danger';
      case 'medium':
        return 'badge-warning';
      case 'low':
        return 'badge-success';
      default:
        return 'badge-primary';
    }
  };

  const getIntensityText = (intensity) => {
    switch (intensity) {
      case 'high':
        return '高强度';
      case 'medium':
        return '中等';
      case 'low':
        return '低强度';
      default:
        return '';
    }
  };

  // 检查是否是今天
  const isToday = (dateStr) => {
    return format(new Date(), 'yyyy-MM-dd') === dateStr;
  };

  return (
    <div>
      {/* 本周训练计划 */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">本周训练计划</h2>
          <div className="card-subtitle">
            {format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'MM月dd日')} - {' '}
            {format(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 6), 'MM月dd日')}
          </div>
        </div>

        {fatigueStatus.level === 'high' && (
          <div className="alert alert-warning" style={{ marginBottom: '1rem' }}>
            <strong>已根据疲劳状态调整</strong>
            <div style={{ marginTop: '0.25rem' }}>
              检测到疲劳较高，已自动降低训练强度。请充分休息恢复。
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {weeklyPlan.map((dayPlan, index) => (
            <div
              key={index}
              className="card"
              style={{
                border: isToday(dayPlan.date) ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                marginBottom: 0,
                position: 'relative'
              }}
            >
              {isToday(dayPlan.date) && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '10px',
                    background: 'var(--primary-color)',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}
                >
                  今天
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {dayPlan.dayName}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    {format(new Date(dayPlan.date), 'MM月dd日')}
                  </div>
                </div>
              </div>

              {dayPlan.activities.map((activity, actIndex) => (
                <div
                  key={actIndex}
                  style={{
                    padding: '0.75rem',
                    background: 'var(--bg-color)',
                    borderRadius: '8px',
                    marginBottom: actIndex < dayPlan.activities.length - 1 ? '0.5rem' : 0
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{getActivityIcon(activity.type)}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                        {activity.name}
                      </div>
                      {activity.intensity && (
                        <span className={`badge ${getIntensityBadge(activity.intensity)}`} style={{ marginTop: '0.25rem' }}>
                          {getIntensityText(activity.intensity)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginLeft: '2rem' }}>
                    {activity.distance && <div>距离: {activity.distance} km</div>}
                    {activity.duration && <div>时长: {activity.duration} 分钟</div>}
                    {activity.workout && <div>训练内容: {activity.workout}</div>}
                    {activity.note && (
                      <div style={{ marginTop: '0.25rem', fontStyle: 'italic' }}>
                        💡 {activity.note}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 训练说明 */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">训练说明</h2>
        </div>

        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
          <p style={{ marginBottom: '0.75rem' }}>
            <strong>📝 计划说明：</strong>
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
            <li>本计划基于你的半马成绩（{userProfile.halfMarathonPB}）和当前状态自动生成</li>
            <li>每周包含 {userProfile.runningDaysPerWeek} 次跑步和 {userProfile.strengthDaysPerWeek} 次力量训练</li>
            <li>系统会根据你的疲劳状态自动调整训练强度</li>
            <li>高强度跑步和下肢力量训练会合理间隔，避免过度疲劳</li>
          </ul>

          <p style={{ marginBottom: '0.75rem' }}>
            <strong>⚠️ 注意事项：</strong>
          </p>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>如果感到过度疲劳，请主动调整为恢复跑或休息</li>
            <li>每周至少保证1天完全休息</li>
            <li>跑前热身、跑后拉伸不可省略</li>
            <li>充足睡眠（7-8小时）对恢复至关重要</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TrainingPlan;
