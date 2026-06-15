// 初始化默认数据

export const DEFAULT_USER_PROFILE = {
  name: '运动员',
  height: 173,
  currentWeight: 85,
  targetWeight: 75,
  currentBodyFat: null,
  targetBodyFat: 15,
  halfMarathonPB: '01:29:30',
  trainingDaysPerWeek: 6,
  runningDaysPerWeek: 4,
  strengthDaysPerWeek: 3,
  trainingGoal: 'weight_loss', // weight_loss, maintain_half, improve_10k, strength_gain
  strengthLevel: 'intermediate', // beginner, intermediate, advanced
  targetWeeks: 12
};

export const SAMPLE_BODY_DATA = [
  {
    id: '1',
    date: '2026-06-07',
    weight: 85.5,
    bodyFat: 22,
    waist: 90,
    sleepHours: 7,
    fatigueLevel: 4,
    hungerLevel: 5,
    notes: ''
  },
  {
    id: '2',
    date: '2026-06-08',
    weight: 85.3,
    bodyFat: 21.8,
    waist: 90,
    sleepHours: 7.5,
    fatigueLevel: 3,
    hungerLevel: 4,
    notes: ''
  },
  {
    id: '3',
    date: '2026-06-09',
    weight: 85.0,
    bodyFat: 21.5,
    waist: 89.5,
    sleepHours: 8,
    fatigueLevel: 4,
    hungerLevel: 5,
    notes: ''
  },
  {
    id: '4',
    date: '2026-06-10',
    weight: 84.8,
    bodyFat: 21.5,
    waist: 89.5,
    sleepHours: 6.5,
    fatigueLevel: 5,
    hungerLevel: 6,
    notes: ''
  },
  {
    id: '5',
    date: '2026-06-11',
    weight: 84.9,
    bodyFat: 21.6,
    waist: 89.5,
    sleepHours: 7,
    fatigueLevel: 4,
    hungerLevel: 5,
    notes: ''
  },
  {
    id: '6',
    date: '2026-06-12',
    weight: 84.6,
    bodyFat: 21.3,
    waist: 89,
    sleepHours: 8,
    fatigueLevel: 3,
    hungerLevel: 4,
    notes: ''
  },
  {
    id: '7',
    date: '2026-06-13',
    weight: 84.5,
    bodyFat: 21.2,
    waist: 89,
    sleepHours: 7.5,
    fatigueLevel: 3,
    hungerLevel: 4,
    notes: '状态不错'
  }
];

export const SAMPLE_RUNNING_LOGS = [
  {
    id: '1',
    date: '2026-06-10',
    type: 'easy',
    distance: 8,
    duration: 2640, // 44分钟
    avgPace: 330, // 5:30/km
    avgHeartRate: 145,
    maxHeartRate: 160,
    rpe: 5,
    notes: '感觉轻松',
    completed: true
  },
  {
    id: '2',
    date: '2026-06-11',
    type: 'interval',
    distance: 8,
    duration: 2280, // 38分钟
    avgPace: 285, // 4:45/km
    avgHeartRate: 170,
    maxHeartRate: 185,
    rpe: 8,
    notes: '5×1000m间歇，最后一组有点累',
    completed: true
  },
  {
    id: '3',
    date: '2026-06-13',
    type: 'easy',
    distance: 6,
    duration: 2040, // 34分钟
    avgPace: 340, // 5:40/km
    avgHeartRate: 140,
    maxHeartRate: 155,
    rpe: 4,
    notes: '恢复性跑步',
    completed: true
  }
];

export const SAMPLE_STRENGTH_LOGS = [
  {
    id: '1',
    date: '2026-06-10',
    type: 'upper_push',
    name: '上肢推',
    duration: 50,
    exercises: [
      {
        name: '杠铃卧推',
        sets: [
          { weight: 80, reps: 8, rpe: 7, completed: true },
          { weight: 80, reps: 7, rpe: 8, completed: true },
          { weight: 80, reps: 6, rpe: 8, completed: true },
          { weight: 75, reps: 8, rpe: 7, completed: true }
        ]
      },
      {
        name: '哑铃肩推',
        sets: [
          { weight: 22, reps: 10, rpe: 7, completed: true },
          { weight: 22, reps: 9, rpe: 7, completed: true },
          { weight: 22, reps: 8, rpe: 8, completed: true }
        ]
      }
    ],
    notes: '状态良好',
    completed: true
  },
  {
    id: '2',
    date: '2026-06-12',
    type: 'lower',
    name: '下肢',
    duration: 55,
    exercises: [
      {
        name: '杠铃深蹲',
        sets: [
          { weight: 100, reps: 8, rpe: 7, completed: true },
          { weight: 100, reps: 7, rpe: 8, completed: true },
          { weight: 100, reps: 6, rpe: 8, completed: true },
          { weight: 95, reps: 8, rpe: 7, completed: true }
        ]
      },
      {
        name: '罗马尼亚硬拉',
        sets: [
          { weight: 90, reps: 10, rpe: 7, completed: true },
          { weight: 90, reps: 9, rpe: 7, completed: true },
          { weight: 90, reps: 8, rpe: 8, completed: true }
        ]
      }
    ],
    notes: '深蹲深度还可以',
    completed: true
  }
];
