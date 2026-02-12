export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function calculateReadTime(wordCount: number): number {
  // Average reading speed: 200 words per minute
  const minutes = Math.ceil(wordCount / 200);
  return Math.max(1, minutes);
}

export interface StoryFormData {
  title: string;
  category: string;
  content: string;
  summary: string;
  coverImage: File | string | null;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateStoryForm(data: StoryFormData): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.title.trim()) {
    errors.title = 'Title is required';
  } else if (data.title.length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }

  if (!data.category) {
    errors.category = 'Category is required';
  }

  const wordCount = countWords(data.content);
  if (!data.content.trim()) {
    errors.content = 'Story content is required';
  } else if (wordCount < 400) {
    errors.content = `Story must be at least 400 words (currently ${wordCount})`;
  } else if (wordCount > 2000) {
    errors.content = `Story must be at most 2000 words (currently ${wordCount})`;
  }

  if (!data.coverImage) {
    errors.cover = 'Cover image is required';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

// Local storage helpers for tags (since backend doesn't support them yet)
const TAGS_STORAGE_KEY = 'gtu_story_tags';

export function saveStoryTags(storyId: string, tags: string[]): void {
  try {
    const stored = localStorage.getItem(TAGS_STORAGE_KEY);
    const allTags = stored ? JSON.parse(stored) : {};
    allTags[storyId] = tags;
    localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(allTags));
  } catch (e) {
    console.warn('Failed to save tags', e);
  }
}

export function getStoryTags(storyId: string): string[] {
  try {
    const stored = localStorage.getItem(TAGS_STORAGE_KEY);
    if (!stored) return [];
    const allTags = JSON.parse(stored);
    return allTags[storyId] || [];
  } catch (e) {
    console.warn('Failed to load tags', e);
    return [];
  }
}
