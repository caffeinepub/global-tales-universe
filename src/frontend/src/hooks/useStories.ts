import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { usePreferences } from '../context/PreferencesContext';
import { Story, Language } from '../backend';
import { SEEDED_STORIES, getCoverImageForCategory, getFilteredSeededStories } from '../lib/seededStories';

// Helper to get cover URL from story (handles both ExternalBlob and fallback)
function getStoryCoverUrl(story: Story): string {
  if (story.coverImage) {
    return story.coverImage.getDirectURL();
  }
  // Use local generated cover images based on category and kids mode
  return getCoverImageForCategory(story.category, story.isKidFriendly);
}

export function useGetAllStories() {
  const { actor, isFetching: actorFetching } = useActor();
  const { language, mode } = usePreferences();
  const isKidsMode = mode === 'kids';

  return useQuery<Story[]>({
    queryKey: ['stories', 'all', language, mode],
    queryFn: async () => {
      if (!actor) {
        return getFilteredSeededStories(isKidsMode);
      }
      try {
        const stories = await actor.getFilteredSortedStories(
          Language.english,
          null,
          null,
          isKidsMode ? true : null
        );
        return stories;
      } catch (error) {
        console.error('Failed to fetch stories from backend, using seeded stories:', error);
        return getFilteredSeededStories(isKidsMode);
      }
    },
    enabled: true,
    placeholderData: getFilteredSeededStories(isKidsMode),
    retry: false,
  });
}

export function useGetFeaturedStory() {
  const { actor, isFetching: actorFetching } = useActor();
  const { language, mode } = usePreferences();
  const isKidsMode = mode === 'kids';

  return useQuery<Story>({
    queryKey: ['stories', 'featured', language, mode],
    queryFn: async () => {
      const fallback = getFilteredSeededStories(isKidsMode)[0];
      if (!actor) return fallback;
      try {
        const story = await actor.getDailyFeaturedStoryByLanguage(Language.english);
        // Check if story matches mode
        if (isKidsMode && !story.isKidFriendly) {
          return fallback;
        }
        return story;
      } catch (error) {
        console.error('Failed to fetch featured story, using seeded story:', error);
        return fallback;
      }
    },
    enabled: true,
    placeholderData: getFilteredSeededStories(isKidsMode)[0],
    retry: false,
  });
}

export function useGetStoriesByCategory(category: string) {
  const { actor, isFetching: actorFetching } = useActor();
  const { language, mode } = usePreferences();
  const isKidsMode = mode === 'kids';

  return useQuery<Story[]>({
    queryKey: ['stories', 'category', category, language, mode],
    queryFn: async () => {
      const seededFallback = getFilteredSeededStories(isKidsMode).filter((s) => s.category === category);
      if (!actor) {
        return seededFallback;
      }
      try {
        const stories = await actor.getFilteredSortedStories(
          Language.english,
          null,
          category,
          isKidsMode ? true : null
        );
        return stories;
      } catch (error) {
        console.error(`Failed to fetch ${category} stories, using seeded stories:`, error);
        return seededFallback;
      }
    },
    enabled: true,
    placeholderData: getFilteredSeededStories(isKidsMode).filter((s) => s.category === category),
    retry: false,
  });
}

export function useGetStoryById(storyId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Story | null>({
    queryKey: ['stories', 'detail', storyId?.toString()],
    queryFn: async () => {
      if (!storyId) return null;
      if (!actor) {
        return SEEDED_STORIES.find((s) => s.id === storyId) || null;
      }
      try {
        const story = await actor.getStory(storyId);
        return story;
      } catch (error) {
        console.error(`Failed to fetch story ${storyId}, checking seeded stories:`, error);
        return SEEDED_STORIES.find((s) => s.id === storyId) || null;
      }
    },
    enabled: !!storyId,
    retry: false,
  });
}

// Legacy exports for backward compatibility
export const useDailyFeaturedStory = useGetFeaturedStory;
export const useStories = useGetAllStories;
export const useStory = useGetStoryById;

// Export helper for components
export { getStoryCoverUrl };
