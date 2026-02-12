import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Story } from '../backend';

export function useFavorites() {
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();

  const { data: favoriteStories = [], isLoading, isError } = useQuery<Story[]>({
    queryKey: ['favoriteStories'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getUserFavoriteStories();
      } catch (error) {
        console.error('Failed to fetch favorite stories:', error);
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  const toggleMutation = useMutation({
    mutationFn: async (storyId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      await actor.toggleFavoriteStory(storyId);
    },
    onSuccess: () => {
      // Invalidate favorites list to refetch
      queryClient.invalidateQueries({ queryKey: ['favoriteStories'] });
    },
    onError: (error) => {
      console.error('Failed to toggle favorite:', error);
    },
  });

  const isFavorite = (storyId: bigint): boolean => {
    return favoriteStories.some((story) => story.id === storyId);
  };

  const toggleFavorite = async (storyId: bigint) => {
    await toggleMutation.mutateAsync(storyId);
  };

  return {
    favoriteStories,
    isLoading,
    isError,
    isFavorite,
    toggleFavorite,
    isToggling: toggleMutation.isPending,
  };
}
