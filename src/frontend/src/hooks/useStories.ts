import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Language } from '../backend';

export function useStories(
  language: Language = Language.english,
  sortByPopularity?: boolean,
  filterByCategory?: string,
  filterByKidFriendly?: boolean
) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['stories', language, sortByPopularity, filterByCategory, filterByKidFriendly],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getFilteredSortedStories(
          language,
          sortByPopularity ?? null,
          filterByCategory ?? null,
          filterByKidFriendly ?? null
        );
      } catch (error) {
        console.error('Failed to fetch stories:', error);
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useStory(storyId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['story', storyId?.toString()],
    queryFn: async () => {
      if (!actor || !storyId) return null;
      try {
        return await actor.getStory(storyId);
      } catch (error) {
        console.error('Failed to fetch story:', error);
        return null;
      }
    },
    enabled: !!actor && !actorFetching && !!storyId,
    retry: false,
  });
}

export function useDailyFeaturedStory(language: Language = Language.english) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['dailyFeatured', language],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getDailyFeaturedStoryByLanguage(language);
      } catch (error) {
        console.error('Failed to fetch featured story:', error);
        return null;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

// Export query key helpers for invalidation
export const storyQueryKeys = {
  all: ['stories'] as const,
  lists: () => [...storyQueryKeys.all, 'list'] as const,
  list: (filters: any) => [...storyQueryKeys.lists(), filters] as const,
  details: () => [...storyQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...storyQueryKeys.details(), id] as const,
};
