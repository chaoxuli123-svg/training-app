// 本地存储工具类
const STORAGE_KEYS = {
  USER_PROFILE: 'userProfile',
  BODY_DATA: 'bodyData',
  RUNNING_LOGS: 'runningLogs',
  STRENGTH_LOGS: 'strengthLogs',
  TRAINING_PLAN: 'trainingPlan',
  SETTINGS: 'settings'
};

export const storage = {
  // 获取数据
  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

  // 保存数据
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },

  // 删除数据
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },

  // 清空所有数据
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};

export { STORAGE_KEYS };
