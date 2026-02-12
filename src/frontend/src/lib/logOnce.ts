// Utility to log warnings/errors only once per unique key per session
const loggedKeys = new Set<string>();

export function logOnce(key: string, message: string, level: 'warn' | 'error' = 'warn') {
  if (loggedKeys.has(key)) return;
  loggedKeys.add(key);
  
  if (level === 'error') {
    console.error(message);
  } else {
    console.warn(message);
  }
}

export function clearLogOnceCache() {
  loggedKeys.clear();
}
