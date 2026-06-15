// 数据分析工具

/**
 * 计算平均值
 */
export function calculateAverage(numbers) {
  if (!numbers || numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, val) => acc + val, 0);
  return sum / numbers.length;
}

/**
 * 计算7日移动平均
 */
export function calculate7DayAverage(data, key) {
  if (!data || data.length === 0) return [];

  const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
  const result = [];

  for (let i = 0; i < sorted.length; i++) {
    const start = Math.max(0, i - 6);
    const slice = sorted.slice(start, i + 1);
    const values = slice.map(item => item[key]).filter(v => v != null);
    const avg = calculateAverage(values);

    result.push({
      date: sorted[i].date,
      value: sorted[i][key],
      average: avg
    });
  }

  return result;
}

/**
 * 分析体重变化趋势
 */
export function analyzeWeightTrend(bodyData) {
  if (!bodyData || bodyData.length < 7) {
    return {
      trend: 'insufficient_data',
      weeklyChange: 0,
      weeklyChangePercent: 0,
      status: 'normal',
      suggestion: '数据不足，请至少记录7天数据'
    };
  }

  const sorted = [...bodyData].sort((a, b) => new Date(a.date) - new Date(b.date));
  const recent7Days = sorted.slice(-7);
  const previous7Days = sorted.slice(-14, -7);

  if (previous7Days.length < 7) {
    return {
      trend: 'insufficient_data',
      weeklyChange: 0,
      weeklyChangePercent: 0,
      status: 'normal',
      suggestion: '数据不足，需要至少14天数据来分析趋势'
    };
  }

  const recentAvg = calculateAverage(recent7Days.map(d => d.weight));
  const previousAvg = calculateAverage(previous7Days.map(d => d.weight));

  const weeklyChange = recentAvg - previousAvg;
  const weeklyChangePercent = (weeklyChange / previousAvg) * 100;

  let status = 'normal';
  let suggestion = '';

  if (weeklyChangePercent < -1) {
    status = 'too_fast';
    suggestion = '减重速度过快（超过1%/周），可能影响训练表现和健康。建议适当增加热量摄入。';
  } else if (weeklyChangePercent > 0.2) {
    status = 'gaining';
    suggestion = '体重略有增加，检查饮食摄入是否超标。';
  } else if (Math.abs(weeklyChangePercent) < 0.2 && recentAvg > 80) {
    status = 'plateau';
    suggestion = '体重变化停滞，考虑检查饮食记录或适当增加活动量。';
  } else if (weeklyChangePercent >= -1 && weeklyChangePercent <= -0.3) {
    status = 'ideal';
    suggestion = '减重速度理想（0.3-1%/周），继续保持当前计划。';
  } else {
    suggestion = '体重变化在正常范围内。';
  }

  return {
    trend: weeklyChange < 0 ? 'decreasing' : weeklyChange > 0 ? 'increasing' : 'stable',
    weeklyChange: parseFloat(weeklyChange.toFixed(2)),
    weeklyChangePercent: parseFloat(weeklyChangePercent.toFixed(2)),
    status,
    suggestion
  };
}

/**
 * 计算疲劳状态
 */
export function calculateFatigueStatus(recentLogs, bodyData) {
  if (!recentLogs || recentLogs.length === 0) {
    return {
      level: 'low',
      score: 0,
      suggestion: '暂无训练数据'
    };
  }

  // 获取最近3天的数据
  const recent3Days = recentLogs.slice(0, 3);

  // 计算平均RPE
  const rpeValues = recent3Days
    .filter(log => log.rpe != null)
    .map(log => log.rpe);

  const avgRPE = calculateAverage(rpeValues);

  // 获取最近的身体数据
  const recentBodyData = bodyData && bodyData.length > 0
    ? bodyData.sort((a, b) => new Date(b.date) - new Date(a.date))[0]
    : null;

  let fatigueScore = avgRPE;

  // 考虑睡眠因素
  if (recentBodyData && recentBodyData.sleepHours < 6) {
    fatigueScore += 1;
  }

  // 考虑疲劳感
  if (recentBodyData && recentBodyData.fatigueLevel >= 7) {
    fatigueScore += 1;
  }

  let level = 'low';
  let suggestion = '';

  if (fatigueScore >= 8) {
    level = 'high';
    suggestion = '疲劳度较高，建议今日安排恢复跑或完全休息。';
  } else if (fatigueScore >= 6) {
    level = 'medium';
    suggestion = '中等疲劳，建议降低今日训练强度。';
  } else {
    level = 'low';
    suggestion = '状态良好，可按计划训练。';
  }

  return {
    level,
    score: parseFloat(fatigueScore.toFixed(1)),
    suggestion
  };
}

/**
 * 计算本周训练统计
 */
export function calculateWeeklyStats(runningLogs, strengthLogs, startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // 筛选本周的跑步记录
  const weekRunning = runningLogs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= start && logDate <= end;
  });

  // 筛选本周的力量训练记录
  const weekStrength = strengthLogs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= start && logDate <= end;
  });

  const totalDistance = weekRunning.reduce((sum, log) => sum + (log.distance || 0), 0);
  const totalRunTime = weekRunning.reduce((sum, log) => sum + (log.duration || 0), 0);
  const runCount = weekRunning.length;
  const strengthCount = weekStrength.length;

  return {
    totalDistance: parseFloat(totalDistance.toFixed(1)),
    totalRunTime,
    runCount,
    strengthCount,
    totalSessions: runCount + strengthCount
  };
}

/**
 * 生成训练建议
 */
export function generateTrainingSuggestions(weeklyStats, fatigueStatus, weightTrend) {
  const suggestions = [];

  // 基于疲劳状态的建议
  if (fatigueStatus.level === 'high') {
    suggestions.push({
      type: 'warning',
      title: '注意休息',
      message: fatigueStatus.suggestion
    });
  }

  // 基于训练量的建议
  if (weeklyStats.totalDistance > 60) {
    suggestions.push({
      type: 'info',
      title: '跑量较高',
      message: '本周跑量超过60公里，注意恢复和营养补充。'
    });
  }

  if (weeklyStats.runCount < 3) {
    suggestions.push({
      type: 'tip',
      title: '增加跑步频率',
      message: '本周跑步次数较少，建议至少3-4次跑步以维持有氧能力。'
    });
  }

  // 基于体重趋势的建议
  if (weightTrend.status === 'too_fast') {
    suggestions.push({
      type: 'warning',
      title: '减重过快',
      message: weightTrend.suggestion
    });
  } else if (weightTrend.status === 'ideal') {
    suggestions.push({
      type: 'success',
      title: '进展理想',
      message: weightTrend.suggestion
    });
  }

  return suggestions;
}

/**
 * 计算营养建议
 */
export function calculateNutritionAdvice(weight, activityLevel = 'moderate') {
  const proteinMin = weight * 1.6;
  const proteinMax = weight * 2.2;

  let calorieMultiplier = 1.0;
  if (activityLevel === 'low') calorieMultiplier = 0.9;
  if (activityLevel === 'high') calorieMultiplier = 1.1;

  // 减脂期热量估算：体重(kg) × 28-32 kcal
  const calorieMin = Math.round(weight * 28 * calorieMultiplier);
  const calorieMax = Math.round(weight * 32 * calorieMultiplier);

  return {
    protein: {
      min: Math.round(proteinMin),
      max: Math.round(proteinMax),
      unit: 'g'
    },
    calories: {
      min: calorieMin,
      max: calorieMax,
      unit: 'kcal'
    },
    carbs: '根据训练强度调整，高强度日增加碳水',
    hydration: '每日至少2-3升，训练日增加'
  };
}
