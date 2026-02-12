import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { Story } from '../backend';

const GUEST_FAVORITES_KEY = 'gtu_guest_favorites';

function getGuestFavorites(): bigint[] {
  try {
    const stored = localStorage.getItem(GUEST_FAVORITES_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return parsed.map((id: string) => BigInt(id));
  } catch {
    return [];
  }
}

function saveGuestFavorites(favorites: bigint[]): void {
  try {
    const serialized = favorites.map(id => id.toString());
    localStorage.setItem(GUEST_FAVORITES_KEY, JSON.stringify(serialized));
  } catch (e) {
    console.warn('Failed to save guest favorites', e);
  }
}

export function useFavorites() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

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
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
  });

  const toggleMutation = useMutation({
    mutationFn: async (storyId: bigint) => {
      if (isAuthenticated) {
        if (!actor) throw new Error('Actor not available');
        await actor.toggleFavoriteStory(storyId);
      } else {
        // Guest mode - toggle in localStorage
        const current = getGuestFavorites();
        const exists = current.some(id => id === storyId);
        const updated = exists
          ? current.filter(id => id !== storyId)
          : [...current, storyId];
        saveGuestFavorites(updated);
      }
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ['favoriteStories'] });
      }
    },
    onError: (error) => {
      console.error('Failed to toggle favorite:', error);
    },
  });

  const isFavorite = (storyId: bigint): boolean => {
    if (isAuthenticated) {
      return favoriteStories.some((story) => story.id === storyId);
    } else {
      const guestFavorites = getGuestFavorites();
      return guestFavorites.some(id => id === storyId);
    }
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
