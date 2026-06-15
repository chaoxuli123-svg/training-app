export const defaultProfile = {
  gender: '男', height: 173, weight: 85, bodyFat: '', targetWeight: 75,
  targetBodyFat: '', targetWeeks: 16, halfMarathonPB: '1:29:30', runningGoal: '减脂为主，保持半马能力',
  strengthGoal: '减脂期保留力量和肌肉', weeklyTrainingDays: 6, weeklyRuns: 4, weeklyStrength: 3,
  proteinMin: 136, proteinMax: 187
};

const today = new Date();
const iso = (offset) => { const d = new Date(today); d.setDate(today.getDate() + offset); return d.toISOString().slice(0,10); };

export const sampleBodyData = [
  { id: crypto.randomUUID(), date: iso(-6), weight: 85.4, bodyFat: 26, waist: 94, sleep: 7, fatigue: 5, hunger: 4, dietOk: true, proteinOk: true },
  { id: crypto.randomUUID(), date: iso(-5), weight: 85.1, bodyFat: 25.8, waist: 94, sleep: 6.5, fatigue: 6, hunger: 5, dietOk: true, proteinOk: true },
  { id: crypto.randomUUID(), date: iso(-4), weight: 84.9, bodyFat: 25.7, waist: 93.5, sleep: 6, fatigue: 7, hunger: 6, dietOk: false, proteinOk: true },
  { id: crypto.randomUUID(), date: iso(-3), weight: 84.8, bodyFat: 25.5, waist: 93.5, sleep: 7.5, fatigue: 5, hunger: 4, dietOk: true, proteinOk: true },
  { id: crypto.randomUUID(), date: iso(-2), weight: 84.6, bodyFat: 25.4, waist: 93, sleep: 7, fatigue: 5, hunger: 5, dietOk: true, proteinOk: false },
  { id: crypto.randomUUID(), date: iso(-1), weight: 84.7, bodyFat: 25.3, waist: 93, sleep: 5.5, fatigue: 8, hunger: 7, dietOk: true, proteinOk: true }
];

export const sampleRunningLogs = [
  { id: crypto.randomUUID(), date: iso(-6), type: '轻松跑', distance: 8, time: '43:20', pace: '5:25', avgHr: 142, maxHr: 158, rpe: 5, completed: true, notes: '减脂期轻松跑，状态正常' },
  { id: crypto.randomUUID(), date: iso(-4), type: '间歇跑', distance: 8.5, time: '38:40', pace: '4:33', avgHr: 166, maxHr: 184, rpe: 8, completed: true, notes: '5×1000m，后两组吃力' },
  { id: crypto.randomUUID(), date: iso(-1), type: '长距离跑', distance: 16, time: '1:26:40', pace: '5:25', avgHr: 148, maxHr: 166, rpe: 6, completed: true, notes: '控制强度，不冲配速' }
];

export const sampleStrengthLogs = [
  { id: crypto.randomUUID(), date: iso(-5), part: '上肢推', exercise: '卧推', sets: 4, reps: 6, weight: 70, rpe: 7, rest: 120, completed: true, notes: '保留力量，不练到力竭' },
  { id: crypto.randomUUID(), date: iso(-3), part: '下肢', exercise: '深蹲', sets: 4, reps: 5, weight: 90, rpe: 7, rest: 150, completed: true, notes: '中等强度，避免影响长跑' },
  { id: crypto.randomUUID(), date: iso(-2), part: '上肢拉', exercise: '引体向上', sets: 5, reps: 6, weight: 0, rpe: 7, rest: 120, completed: true, notes: '配合核心训练' }
];
