// Local storage helpers for per-story social interactions (likes overlay, comments)

export interface StorySocialData {
  likeOverlay: number; // Additional likes beyond story.likes
  comments: Comment[];
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: number;
}

const SOCIAL_STORAGE_KEY = 'gtu_story_social';

function getAllSocialData(): Record<string, StorySocialData> {
  try {
    const stored = localStorage.getItem(SOCIAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveSocialData(data: Record<string, StorySocialData>): void {
  try {
    localStorage.setItem(SOCIAL_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save social data', e);
  }
}

export function getStorySocialData(storyId: string): StorySocialData {
  const all = getAllSocialData();
  return all[storyId] || { likeOverlay: 0, comments: [] };
}

export function updateStorySocialData(storyId: string, data: Partial<StorySocialData>): void {
  const all = getAllSocialData();
  all[storyId] = { ...getStorySocialData(storyId), ...data };
  saveSocialData(all);
}

export function addComment(storyId: string, author: string, text: string): void {
  const current = getStorySocialData(storyId);
  const newComment: Comment = {
    id: `${Date.now()}-${Math.random()}`,
    author,
    text,
    timestamp: Date.now(),
  };
  current.comments.push(newComment);
  updateStorySocialData(storyId, current);
}

export function toggleLikeOverlay(storyId: string): number {
  const current = getStorySocialData(storyId);
  const newOverlay = current.likeOverlay === 0 ? 1 : 0;
  updateStorySocialData(storyId, { likeOverlay: newOverlay });
  return newOverlay;
}
