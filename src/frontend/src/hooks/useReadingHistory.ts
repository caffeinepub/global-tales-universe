import { useState, useEffect } from 'react';
import { useAppUser } from './useAppUser';

interface HistoryEntry {
  storyId: bigint;
  timestamp: number;
  progress: number;
}

const GUEST_HISTORY_KEY = 'gtu_reading_history';

export function useReadingHistory() {
  const { userState, updateUserState, isAuthenticated } = useAppUser();
  const [guestHistory, setGuestHistory] = useState<HistoryEntry[]>(() => {
    try {
      const stored = localStorage.getItem(GUEST_HISTORY_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return parsed.map((entry: any) => ({
        ...entry,
        storyId: BigInt(entry.storyId),
      }));
    } catch {
      return [];
    }
  });

  // Type guard to check if userState has readingHistory
  const hasReadingHistory = (state: any): state is { readingHistory: HistoryEntry[] } => {
    return state && 'readingHistory' in state && Array.isArray(state.readingHistory);
  };

  const history = isAuthenticated && hasReadingHistory(userState)
    ? userState.readingHistory
    : guestHistory;

  const addToHistory = (storyId: bigint, progress: number = 0) => {
    const entry: HistoryEntry = {
      storyId,
      timestamp: Date.now(),
      progress,
    };

    if (isAuthenticated && hasReadingHistory(userState)) {
      const existing = userState.readingHistory || [];
      const filtered = existing.filter(e => e.storyId !== storyId);
      const updated = [entry, ...filtered].slice(0, 50);
      updateUserState({ readingHistory: updated } as any);
    } else {
      const filtered = guestHistory.filter(e => e.storyId !== storyId);
      const updated = [entry, ...filtered].slice(0, 50);
      setGuestHistory(updated);
      try {
        localStorage.setItem(
          GUEST_HISTORY_KEY,
          JSON.stringify(updated.map(e => ({ ...e, storyId: e.storyId.toString() })))
        );
      } catch (e) {
        console.warn('Failed to save history', e);
      }
    }
  };

  const updateProgress = (storyId: bigint, progress: number) => {
    addToHistory(storyId, progress);
  };

  const getProgress = (storyId: bigint): number => {
    const entry = history.find((e: any) => e.storyId === storyId);
    return entry ? (entry as HistoryEntry).progress : 0;
  };

  const getLastRead = (): HistoryEntry | null => {
    return history.length > 0 ? (history[0] as HistoryEntry) : null;
  };

  return {
    history: history as HistoryEntry[],
    addToHistory,
    updateProgress,
    getProgress,
    getLastRead,
  };
}
