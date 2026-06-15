// 配速计算工具
// 根据半马成绩估算训练配速

/**
 * 将时间字符串转换为秒数
 * @param {string} timeStr - 格式 "HH:MM:SS" 或 "MM:SS"
 * @returns {number} 秒数
 */
export function timeToSeconds(timeStr) {
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return 0;
}

/**
 * 将秒数转换为时间字符串
 * @param {number} seconds - 秒数
 * @param {boolean} includeHours - 是否包含小时
 * @returns {string} 格式 "HH:MM:SS" 或 "MM:SS"
 */
export function secondsToTime(seconds, includeHours = false) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (includeHours || h > 0) {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * 根据半马成绩计算训练配速区间
 * @param {string} halfMarathonTime - 半马完赛时间，格式 "HH:MM:SS"
 * @returns {Object} 各训练类型的配速区间
 */
export function calculatePaceZones(halfMarathonTime) {
  const totalSeconds = timeToSeconds(halfMarathonTime);
  const pacePerKm = totalSeconds / 21.0975; // 半马距离

  // 配速区间计算（单位：秒/公里）
  // 基于 Jack Daniels 的训练配速理论
  return {
    easy: {
      min: Math.round(pacePerKm * 1.25), // 比半马配速慢25%
      max: Math.round(pacePerKm * 1.40), // 比半马配速慢40%
      name: '轻松跑',
      description: '用于恢复和积累跑量'
    },
    marathon: {
      min: Math.round(pacePerKm * 1.08),
      max: Math.round(pacePerKm * 1.15),
      name: '马拉松配速',
      description: '长距离慢跑配速'
    },
    tempo: {
      min: Math.round(pacePerKm * 0.95),
      max: Math.round(pacePerKm * 1.00),
      name: '节奏跑',
      description: '乳酸阈值训练'
    },
    interval: {
      min: Math.round(pacePerKm * 0.85),
      max: Math.round(pacePerKm * 0.92),
      name: '间歇跑',
      description: '5K-10K比赛配速'
    },
    recovery: {
      min: Math.round(pacePerKm * 1.40),
      max: Math.round(pacePerKm * 1.60),
      name: '恢复跑',
      description: '非常轻松的恢复性跑步'
    }
  };
}

/**
 * 格式化配速显示
 * @param {number} paceInSeconds - 配速（秒/公里）
 * @returns {string} 格式化的配速字符串
 */
export function formatPace(paceInSeconds) {
  return secondsToTime(paceInSeconds, false) + '/km';
}

/**
 * 计算平均配速
 * @param {number} distance - 距离（公里）
 * @param {number} timeInSeconds - 时间（秒）
 * @returns {number} 配速（秒/公里）
 */
export function calculateAveragePace(distance, timeInSeconds) {
  if (distance === 0) return 0;
  return Math.round(timeInSeconds / distance);
}

/**
 * 根据配速和距离计算时间
 * @param {number} paceInSeconds - 配速（秒/公里）
 * @param {number} distance - 距离（公里）
 * @returns {number} 时间（秒）
 */
export function calculateTime(paceInSeconds, distance) {
  return Math.round(paceInSeconds * distance);
}
