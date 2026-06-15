// 训练计划生成器

import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';

// 跑步训练类型
export const RUN_TYPES = {
  EASY: 'easy',
  TEMPO: 'tempo',
  INTERVAL: 'interval',
  LONG: 'long',
  RECOVERY: 'recovery'
};

// 力量训练类型
export const STRENGTH_TYPES = {
  UPPER_PUSH: 'upper_push',
  UPPER_PULL: 'upper_pull',
  LOWER: 'lower',
  FULL_BODY: 'full_body',
  CORE: 'core'
};

// 力量训练动作库
export const EXERCISE_LIBRARY = {
  upper_push: [
    { name: '杠铃卧推', muscle: '胸/肱三头', sets: 4, reps: '6-8', rest: 120 },
    { name: '哑铃卧推', muscle: '胸', sets: 3, reps: '8-10', rest: 90 },
    { name: '杠铃肩推', muscle: '肩', sets: 4, reps: '6-8', rest: 90 },
    { name: '哑铃肩推', muscle: '肩', sets: 3, reps: '8-12', rest: 90 },
    { name: '俯卧撑', muscle: '胸/肱三头', sets: 3, reps: '12-15', rest: 60 },
    { name: '双杠臂屈伸', muscle: '胸/肱三头', sets: 3, reps: '8-12', rest: 90 }
  ],
  upper_pull: [
    { name: '引体向上', muscle: '背/肱二头', sets: 4, reps: '6-10', rest: 120 },
    { name: '杠铃划船', muscle: '背', sets: 4, reps: '6-8', rest: 90 },
    { name: '坐姿划船', muscle: '背', sets: 3, reps: '10-12', rest: 90 },
    { name: '高位下拉', muscle: '背', sets: 3, reps: '10-12', rest: 90 },
    { name: '面拉', muscle: '后肩/背', sets: 3, reps: '12-15', rest: 60 },
    { name: '哑铃弯举', muscle: '肱二头', sets: 3, reps: '10-12', rest: 60 }
  ],
  lower: [
    { name: '杠铃深蹲', muscle: '股四头/臀', sets: 4, reps: '6-8', rest: 150 },
    { name: '罗马尼亚硬拉', muscle: '腘绳肌/臀', sets: 4, reps: '8-10', rest: 120 },
    { name: '腿举', muscle: '股四头', sets: 3, reps: '10-12', rest: 90 },
    { name: '保加利亚分腿蹲', muscle: '股四头/臀', sets: 3, reps: '10-12/腿', rest: 90 },
    { name: '臀桥', muscle: '臀/腘绳肌', sets: 3, reps: '12-15', rest: 60 },
    { name: '腿弯举', muscle: '腘绳肌', sets: 3, reps: '10-12', rest: 60 }
  ],
  core: [
    { name: '平板支撑', muscle: '核心', sets: 3, reps: '45-60秒', rest: 60 },
    { name: '卷腹', muscle: '腹直肌', sets: 3, reps: '15-20', rest: 45 },
    { name: '悬垂举腿', muscle: '腹直肌', sets: 3, reps: '10-15', rest: 60 },
    { name: '死虫', muscle: '核心稳定', sets: 3, reps: '12-15/侧', rest: 45 },
    { name: '俄罗斯转体', muscle: '腹斜肌', sets: 3, reps: '20-30', rest: 45 },
    { name: '鸟狗式', muscle: '核心稳定', sets: 3, reps: '10-12/侧', rest: 45 }
  ]
};

/**
 * 生成一周训练计划
 * @param {Object} userProfile - 用户配置
 * @param {Object} fatigueStatus - 疲劳状态
 * @returns {Array} 7天的训练计划
 */
export function generateWeeklyPlan(userProfile, fatigueStatus = { level: 'low' }) {
  const {
    trainingDaysPerWeek = 6,
    runningDaysPerWeek = 4,
    strengthDaysPerWeek = 3,
    trainingGoal = 'weight_loss'
  } = userProfile;

  // 基础6天训练模板（适合用户的半马水平）
  const baseTemplate = [
    {
      day: 0, // 周一
      activities: [
        {
          type: 'strength',
          category: STRENGTH_TYPES.UPPER_PUSH,
          name: '上肢推力量训练',
          duration: 45,
          intensity: 'medium'
        },
        {
          type: 'running',
          category: RUN_TYPES.EASY,
          name: '轻松跑',
          distance: 6,
          intensity: 'low'
        }
      ]
    },
    {
      day: 1, // 周二
      activities: [
        {
          type: 'running',
          category: RUN_TYPES.INTERVAL,
          name: '间歇跑训练',
          workout: '5 × 1000m',
          distance: 8,
          intensity: 'high'
        }
      ]
    },
    {
      day: 2, // 周三
      activities: [
        {
          type: 'strength',
          category: STRENGTH_TYPES.LOWER,
          name: '下肢力量训练',
          duration: 50,
          intensity: 'medium',
          note: '中等强度，避免影响周四跑步'
        }
      ]
    },
    {
      day: 3, // 周四
      activities: [
        {
          type: 'running',
          category: RUN_TYPES.EASY,
          name: '轻松跑',
          distance: 8,
          intensity: 'low'
        }
      ]
    },
    {
      day: 4, // 周五
      activities: [
        {
          type: 'strength',
          category: STRENGTH_TYPES.UPPER_PULL,
          name: '上肢拉力量训练',
          duration: 45,
          intensity: 'medium'
        },
        {
          type: 'strength',
          category: STRENGTH_TYPES.CORE,
          name: '核心训练',
          duration: 20,
          intensity: 'low'
        }
      ]
    },
    {
      day: 5, // 周六
      activities: [
        {
          type: 'running',
          category: RUN_TYPES.LONG,
          name: '长距离慢跑',
          distance: 16,
          intensity: 'low',
          note: '用于维持半马能力'
        }
      ]
    },
    {
      day: 6, // 周日
      activities: [
        {
          type: 'rest',
          name: '休息日或主动恢复',
          note: '轻度拉伸或散步'
        }
      ]
    }
  ];

  // 根据疲劳状态调整计划
  let adjustedPlan = baseTemplate.map(dayPlan => {
    const adjusted = { ...dayPlan };

    if (fatigueStatus.level === 'high') {
      // 疲劳高：降低强度或改为恢复
      adjusted.activities = adjusted.activities.map(activity => {
        if (activity.type === 'running' && activity.intensity !== 'low') {
          return {
            ...activity,
            category: RUN_TYPES.RECOVERY,
            name: '恢复跑（根据疲劳调整）',
            distance: activity.distance ? activity.distance * 0.6 : 5,
            intensity: 'low',
            note: '疲劳较高，已调整为恢复跑'
          };
        }
        if (activity.type === 'strength') {
          return {
            ...activity,
            note: (activity.note || '') + ' | 减少1-2组或降低重量',
            setsReduction: true
          };
        }
        return activity;
      });
    } else if (fatigueStatus.level === 'medium') {
      // 疲劳中等：适当降低强度
      adjusted.activities = adjusted.activities.map(activity => {
        if (activity.intensity === 'high') {
          return {
            ...activity,
            distance: activity.distance ? activity.distance * 0.8 : activity.distance,
            note: (activity.note || '') + ' | 适当降低强度'
          };
        }
        return activity;
      });
    }

    return adjusted;
  });

  // 转换为日期格式
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // 周一开始

  return adjustedPlan.map((dayPlan, index) => ({
    ...dayPlan,
    date: format(addDays(weekStart, index), 'yyyy-MM-dd'),
    dayName: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][index]
  }));
}

/**
 * 生成具体的力量训练计划
 * @param {string} category - 训练类型
 * @param {boolean} reduceVolume - 是否减量
 * @returns {Array} 训练动作列表
 */
export function generateStrengthWorkout(category, reduceVolume = false) {
  let exercises = [];

  switch (category) {
    case STRENGTH_TYPES.UPPER_PUSH:
      exercises = [
        EXERCISE_LIBRARY.upper_push[0], // 杠铃卧推
        EXERCISE_LIBRARY.upper_push[3], // 哑铃肩推
        EXERCISE_LIBRARY.upper_push[4], // 俯卧撑
        EXERCISE_LIBRARY.upper_push[5]  // 臂屈伸
      ];
      break;

    case STRENGTH_TYPES.UPPER_PULL:
      exercises = [
        EXERCISE_LIBRARY.upper_pull[0], // 引体向上
        EXERCISE_LIBRARY.upper_pull[1], // 杠铃划船
        EXERCISE_LIBRARY.upper_pull[4], // 面拉
        EXERCISE_LIBRARY.upper_pull[5]  // 弯举
      ];
      break;

    case STRENGTH_TYPES.LOWER:
      exercises = [
        EXERCISE_LIBRARY.lower[0], // 深蹲
        EXERCISE_LIBRARY.lower[1], // 罗马尼亚硬拉
        EXERCISE_LIBRARY.lower[3], // 保加利亚分腿蹲
        EXERCISE_LIBRARY.lower[4]  // 臀桥
      ];
      break;

    case STRENGTH_TYPES.CORE:
      exercises = [
        EXERCISE_LIBRARY.core[0], // 平板支撑
        EXERCISE_LIBRARY.core[2], // 悬垂举腿
        EXERCISE_LIBRARY.core[4], // 俄罗斯转体
        EXERCISE_LIBRARY.core[5]  // 鸟狗式
      ];
      break;

    case STRENGTH_TYPES.FULL_BODY:
      exercises = [
        EXERCISE_LIBRARY.lower[0],      // 深蹲
        EXERCISE_LIBRARY.upper_push[0], // 卧推
        EXERCISE_LIBRARY.upper_pull[0], // 引体向上
        EXERCISE_LIBRARY.core[0]        // 平板支撑
      ];
      break;

    default:
      exercises = [];
  }

  // 如果需要减量，减少组数
  if (reduceVolume) {
    exercises = exercises.map(ex => ({
      ...ex,
      sets: Math.max(2, ex.sets - 1),
      note: '已减量'
    }));
  }

  return exercises.map((ex, index) => ({
    ...ex,
    id: `${category}_${index}`,
    completed: false,
    actualSets: [],
    weight: 0
  }));
}

/**
 * 根据配速区间生成跑步训练描述
 * @param {string} runType - 跑步类型
 * @param {Object} paceZones - 配速区间
 * @returns {string} 训练描述
 */
export function getRunningDescription(runType, paceZones) {
  if (!paceZones) return '';

  const zone = paceZones[runType];
  if (!zone) return '';

  return `${zone.description}`;
}
