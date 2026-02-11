import { useState, useEffect } from 'react';
import { Story } from '../backend';

// Simple localStorage-based offline storage (fallback for idb)
const OFFLINE_STORAGE_KEY = 'gtu_offline_stories';

interface OfflineStore {
  [key: string]: Story;
}

function getOfflineStore(): OfflineStore {
  try {
    const stored = localStorage.getItem(OFFLINE_STORAGE_KEY);
    if (!stored) return {};
    const parsed = JSON.parse(stored);
    // Convert string IDs back to bigints
    const result: OfflineStore = {};
    for (const [key, value] of Object.entries(parsed)) {
      const story = value as any;
      result[key] = {
        ...story,
        id: BigInt(story.id),
        likes: BigInt(story.likes),
        rating: BigInt(story.rating),
        readTimeMinutes: BigInt(story.readTimeMinutes),
        timestamp: BigInt(story.timestamp),
      };
    }
    return result;
  } catch {
    return {};
  }
}

function saveOfflineStore(store: OfflineStore) {
  try {
    // Serialize bigints to strings
    const serialized: any = {};
    for (const [key, value] of Object.entries(store)) {
      serialized[key] = {
        ...value,
        id: value.id.toString(),
        likes: value.likes.toString(),
        rating: value.rating.toString(),
        readTimeMinutes: value.readTimeMinutes.toString(),
        timestamp: value.timestamp.toString(),
      };
    }
    localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(serialized));
  } catch (e) {
    console.warn('Failed to save offline store', e);
  }
}

export function useOfflineDownloads() {
  const [downloadedIds, setDownloadedIds] = useState<Set<string>>(() => {
    const store = getOfflineStore();
    return new Set(Object.keys(store));
  });

  const downloadStory = async (story: Story) => {
    try {
      const store = getOfflineStore();
      store[story.id.toString()] = story;
      saveOfflineStore(store);
      setDownloadedIds(prev => new Set(prev).add(story.id.toString()));
    } catch (e) {
      console.error('Failed to download story', e);
      throw e;
    }
  };

  const removeDownload = async (storyId: bigint) => {
    try {
      const store = getOfflineStore();
      delete store[storyId.toString()];
      saveOfflineStore(store);
      setDownloadedIds(prev => {
        const next = new Set(prev);
        next.delete(storyId.toString());
        return next;
      });
    } catch (e) {
      console.error('Failed to remove download', e);
      throw e;
    }
  };

  const getOfflineStory = async (storyId: bigint): Promise<Story | null> => {
    try {
      const store = getOfflineStore();
      return store[storyId.toString()] || null;
    } catch (e) {
      console.warn('Failed to get offline story', e);
      return null;
    }
  };

  const isDownloaded = (storyId: bigint) => downloadedIds.has(storyId.toString());

  return {
    downloadStory,
    removeDownload,
    getOfflineStory,
    isDownloaded,
  };
}
