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
      return actor.getFilteredSortedStories(
        language,
        sortByPopularity ?? null,
        filterByCategory ?? null,
        filterByKidFriendly ?? null
      );
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useStory(storyId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['story', storyId?.toString()],
    queryFn: async () => {
      if (!actor || !storyId) return null;
      return actor.getStory(storyId);
    },
    enabled: !!actor && !actorFetching && !!storyId,
  });
}

export function useDailyFeaturedStory(language: Language = Language.english) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['dailyFeatured', language],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDailyFeaturedStoryByLanguage(language);
    },
    enabled: !!actor && !actorFetching,
  });
}
