const PROGRESS_STORAGE_KEY = 'gtu_reading_progress';

interface ProgressData {
  storyId: string;
  scrollPercentage: number;
  scrollPosition: number;
  timestamp: number;
}

export function saveReadingProgress(storyId: string, scrollPercentage: number, scrollPosition: number): void {
  try {
    const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
    const allProgress: Record<string, ProgressData> = stored ? JSON.parse(stored) : {};
    
    allProgress[storyId] = {
      storyId,
      scrollPercentage,
      scrollPosition,
      timestamp: Date.now(),
    };
    
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(allProgress));
  } catch (e) {
    console.warn('Failed to save reading progress', e);
  }
}

export function loadReadingProgress(storyId: string): ProgressData | null {
  try {
    const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!stored) return null;
    
    const allProgress: Record<string, ProgressData> = JSON.parse(stored);
    return allProgress[storyId] || null;
  } catch (e) {
    console.warn('Failed to load reading progress', e);
    return null;
  }
}

export function clearReadingProgress(storyId: string): void {
  try {
    const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!stored) return;
    
    const allProgress: Record<string, ProgressData> = JSON.parse(stored);
    delete allProgress[storyId];
    
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(allProgress));
  } catch (e) {
    console.warn('Failed to clear reading progress', e);
  }
}

export function calculateScrollPercentage(scrollTop: number, scrollHeight: number, clientHeight: number): number {
  if (scrollHeight <= clientHeight) return 100;
  
  const maxScroll = scrollHeight - clientHeight;
  const percentage = (scrollTop / maxScroll) * 100;
  
  return Math.min(100, Math.max(0, percentage));
}
