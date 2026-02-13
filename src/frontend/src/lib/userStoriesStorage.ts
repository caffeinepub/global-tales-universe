// Guest-mode local-only persistence for Stories drafts in localStorage

export interface GuestStoryDraft {
  id: string;
  text: string;
  imageDataUrl?: string;
  createdAt: number;
  expiresAt: number;
}

const GUEST_STORIES_KEY = 'gtu_guest_stories';
const EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours

function pruneExpired(drafts: GuestStoryDraft[]): GuestStoryDraft[] {
  const now = Date.now();
  return drafts.filter(draft => draft.expiresAt > now);
}

export function getGuestStories(): GuestStoryDraft[] {
  try {
    const stored = localStorage.getItem(GUEST_STORIES_KEY);
    if (!stored) return [];
    const parsed: GuestStoryDraft[] = JSON.parse(stored);
    const active = pruneExpired(parsed);
    // Save back pruned list
    if (active.length !== parsed.length) {
      saveGuestStories(active);
    }
    return active;
  } catch (error) {
    console.warn('Failed to load guest stories:', error);
    return [];
  }
}

function saveGuestStories(drafts: GuestStoryDraft[]): void {
  try {
    localStorage.setItem(GUEST_STORIES_KEY, JSON.stringify(drafts));
  } catch (error) {
    console.warn('Failed to save guest stories:', error);
  }
}

export function addGuestStory(text: string, imageDataUrl?: string): string {
  const now = Date.now();
  const newDraft: GuestStoryDraft = {
    id: `guest-${now}`,
    text,
    imageDataUrl,
    createdAt: now,
    expiresAt: now + EXPIRATION_MS,
  };
  
  const current = getGuestStories();
  const updated = [newDraft, ...current];
  saveGuestStories(updated);
  
  return newDraft.id;
}

export function deleteGuestStory(id: string): void {
  const current = getGuestStories();
  const updated = current.filter(draft => draft.id !== id);
  saveGuestStories(updated);
}
