const STORAGE_KEYS = {
  USER_PROFILE: 'userProfile',
  BODY_DATA: 'bodyData',
  RUNNING_LOGS: 'runningLogs',
  STRENGTH_LOGS: 'strengthLogs',
  TRAINING_PLAN: 'trainingPlan',
  SETTINGS: 'settings'
};

export const storage = {
  get(key) { return null; },
  set(key, value) { return true; },
  remove(key) { return true; },
  clear() { return true; }
};

export { STORAGE_KEYS };
