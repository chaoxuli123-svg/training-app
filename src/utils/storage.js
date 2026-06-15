const prefix = 'hybrid-training:';
export const keys = { profile: 'profile', body: 'bodyData', runs: 'runningLogs', strength: 'strengthLogs', plan: 'weeklyPlan' };
export function load(key, fallback) {
  try { const value = localStorage.getItem(prefix + key); return value ? JSON.parse(value) : fallback; }
  catch { return fallback; }
}
export function save(key, value) { localStorage.setItem(prefix + key, JSON.stringify(value)); }
export function clearAll() { Object.values(keys).forEach(k => localStorage.removeItem(prefix + k)); }
