interface EngagementData {
  streak: number;
  lastReadDate: string;
  badges: string[];
  challengeProgress: number;
  sharesCount: number;
  bonusStoriesUnlocked: number;
}

const STORAGE_KEY = 'gtu_engagement';

export function getEngagementData(): EngagementData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {
        streak: 0,
        lastReadDate: '',
        badges: [],
        challengeProgress: 0,
        sharesCount: 0,
        bonusStoriesUnlocked: 0,
      };
    }
    return JSON.parse(stored);
  } catch {
    return {
      streak: 0,
      lastReadDate: '',
      badges: [],
      challengeProgress: 0,
      sharesCount: 0,
      bonusStoriesUnlocked: 0,
    };
  }
}

export function saveEngagementData(data: EngagementData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save engagement data', e);
  }
}

export function updateStreak() {
  const data = getEngagementData();
  const today = new Date().toDateString();
  
  if (data.lastReadDate === today) {
    return data;
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();
  
  if (data.lastReadDate === yesterdayStr) {
    data.streak += 1;
  } else if (data.lastReadDate !== today) {
    data.streak = 1;
  }
  
  data.lastReadDate = today;
  saveEngagementData(data);
  checkBadges(data);
  
  return data;
}

export function recordShare() {
  const data = getEngagementData();
  data.sharesCount += 1;
  
  if (data.sharesCount % 3 === 0) {
    data.bonusStoriesUnlocked += 1;
  }
  
  saveEngagementData(data);
  return data;
}

function checkBadges(data: EngagementData) {
  const newBadges: string[] = [];
  
  if (data.streak >= 7 && !data.badges.includes('7-day-streak')) {
    newBadges.push('7-day-streak');
  }
  if (data.streak >= 30 && !data.badges.includes('30-day-streak')) {
    newBadges.push('30-day-streak');
  }
  if (data.challengeProgress >= 5 && !data.badges.includes('5-stories')) {
    newBadges.push('5-stories');
  }
  
  if (newBadges.length > 0) {
    data.badges = [...data.badges, ...newBadges];
    saveEngagementData(data);
  }
}
