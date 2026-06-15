export const paceZones = {
  '轻松跑': '5:10–5:50/km', '长距离跑': '5:00–5:40/km', '节奏跑': '4:05–4:20/km',
  '间歇跑': '3:45–4:00/km', '恢复跑': '5:40–6:20/km'
};

export const exercises = {
  '上肢推': ['卧推','哑铃卧推','肩推','俯卧撑','臂屈伸'],
  '上肢拉': ['引体向上','杠铃划船','坐姿划船','高位下拉','面拉'],
  '下肢': ['深蹲','硬拉','罗马尼亚硬拉','腿举','弓步蹲','臀桥'],
  '核心': ['平板支撑','卷腹','悬垂举腿','死虫','俄罗斯转体'],
  '全身': ['深蹲','卧推','划船','罗马尼亚硬拉','平板支撑']
};

export function generatePlan() {
  const days = ['周一','周二','周三','周四','周五','周六','周日'];
  const rows = [
    ['上肢力量 + 轻松跑','上肢推 45min + 轻松跑 5–8km','中','力量后跑步只做轻松有氧'],
    ['间歇跑','热身2km + 5×1000m + 放松跑','高','目标配速 3:45–4:00/km，组间慢跑恢复'],
    ['下肢力量','深蹲/硬拉二选一 + 单腿动作 + 核心','中','不要练到力竭，避免影响周六长跑'],
    ['轻松跑','8–10km 有氧跑','低','控制心率，能说完整句子'],
    ['上肢拉 + 核心','引体/划船 + 面拉 + 核心','中','保护肩背，改善跑姿稳定'],
    ['长距离慢跑','14–20km 长距离','中','减脂期不冲速度，重视补水'],
    ['休息/主动恢复','散步、拉伸、泡沫轴','低','完全休息也可以']
  ];
  return days.map((day, i) => ({ id: crypto.randomUUID(), day, title: rows[i][0], detail: rows[i][1], intensity: rows[i][2], note: rows[i][3], completed: false, rpe: '', feeling: '' }));
}

export function sortByDate(arr) { return [...arr].sort((a,b) => a.date.localeCompare(b.date)); }
export function latest(arr) { return sortByDate(arr).at(-1); }
export function sumWeek(arr, field) {
  const now = new Date(); const start = new Date(now); start.setDate(now.getDate() - 6);
  return arr.filter(x => new Date(x.date) >= start).reduce((s,x)=> s + Number(x[field] || 0), 0);
}
export function sevenDayAverage(body) {
  const last7 = sortByDate(body).slice(-7);
  if (!last7.length) return null;
  return +(last7.reduce((s,x)=>s+Number(x.weight || 0),0)/last7.length).toFixed(1);
}
export function fatigueStatus(body, runs, strength) {
  const recentBody = sortByDate(body).slice(-3);
  const highFatigue = recentBody.filter(x => Number(x.fatigue) >= 8).length >= 3;
  const lastBody = latest(body);
  const recentRpe = [...runs, ...strength].sort((a,b)=>a.date.localeCompare(b.date)).slice(-3).map(x=>Number(x.rpe||0));
  const avgRpe = recentRpe.length ? recentRpe.reduce((a,b)=>a+b,0)/recentRpe.length : 0;
  if (highFatigue || (lastBody && Number(lastBody.sleep) < 6 && Number(lastBody.fatigue) >= 7)) return { level:'高', cls:'danger', advice:'今天建议休息或恢复跑，不安排高强度跑和大重量下肢。' };
  if (avgRpe >= 7 || (lastBody && Number(lastBody.fatigue) >= 7)) return { level:'中', cls:'warning', advice:'可以训练，但建议减少跑量或力量组数，避免练到力竭。' };
  return { level:'低', cls:'success', advice:'恢复状态可以，按计划训练，注意蛋白质和睡眠。' };
}
export function weightAdvice(body) {
  const sorted = sortByDate(body);
  if (sorted.length < 2) return ['记录至少两次身体数据后，会生成减脂趋势建议。'];
  const msgs = [];
  const last = sorted.at(-1); const firstWeek = sorted[Math.max(0, sorted.length - 7)];
  const delta = Number(last.weight) - Number(firstWeek.weight);
  if (delta <= -0.85) msgs.push('本周减重超过0.85kg，速度偏快，注意跑步表现、力量维持和恢复。');
  if (Math.abs(delta) < 0.2 && sorted.length >= 14) msgs.push('近两周体重变化不明显，优先检查饮食记录和日常活动量。');
  const prev = sorted.at(-2);
  if (prev && Math.abs(Number(last.weight) - Number(prev.weight)) < 0.2 && Number(last.waist) < Number(prev.waist)) msgs.push('体重变化不大但腰围下降，可能正在身体重组，不要只看体重。');
  if (Number(last.sleep) < 6 && Number(last.fatigue) >= 7) msgs.push('睡眠少于6小时且疲劳较高，今天建议恢复跑或休息。');
  if (!last.proteinOk) msgs.push('蛋白质没有达标，减脂期建议每天约136–187g，帮助保留肌肉。');
  return msgs.length ? msgs : ['当前减脂节奏正常，继续关注7日平均体重、腰围和训练表现。'];
}
