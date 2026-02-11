interface ReminderSettings {
  enabled: boolean;
  language: string;
  categories: string[];
}

const REMINDER_KEY = 'gtu_reminders';
const LAST_SHOWN_KEY = 'gtu_last_reminder_shown';

export function getReminderSettings(): ReminderSettings {
  try {
    const stored = localStorage.getItem(REMINDER_KEY);
    return stored ? JSON.parse(stored) : { enabled: false, language: 'en', categories: [] };
  } catch {
    return { enabled: false, language: 'en', categories: [] };
  }
}

export function saveReminderSettings(settings: ReminderSettings) {
  try {
    localStorage.setItem(REMINDER_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save reminder settings', e);
  }
}

export function shouldShowReminder(): boolean {
  const settings = getReminderSettings();
  if (!settings.enabled) return false;
  
  try {
    const lastShown = localStorage.getItem(LAST_SHOWN_KEY);
    if (!lastShown) return true;
    
    const lastDate = new Date(lastShown);
    const now = new Date();
    const hoursSince = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60);
    
    return hoursSince >= 24;
  } catch {
    return true;
  }
}

export function markReminderShown() {
  try {
    localStorage.setItem(LAST_SHOWN_KEY, new Date().toISOString());
  } catch (e) {
    console.warn('Failed to mark reminder shown', e);
  }
}
