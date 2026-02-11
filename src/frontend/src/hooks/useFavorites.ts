import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { useState, useEffect } from 'react';

const GUEST_FAVORITES_KEY = 'gtu_guest_favorites';

export function useFavorites() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  const [guestFavorites, setGuestFavorites] = useState<bigint[]>(() => {
    try {
      const stored = localStorage.getItem(GUEST_FAVORITES_KEY);
      return stored ? JSON.parse(stored).map((id: string) => BigInt(id)) : [];
    } catch {
      return [];
    }
  });

  // Fetch backend favorites when authenticated
  const { data: backendFavorites } = useQuery({
    queryKey: ['favorites', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !isAuthenticated) return [];
      try {
        return await actor.getUserFavoriteStories();
      } catch {
        return [];
      }
    },
    enabled: !!actor && isAuthenticated,
  });

  const toggleFavorite = useMutation({
    mutationFn: async (storyId: bigint) => {
      if (isAuthenticated && actor) {
        await actor.toggleFavoriteStory(storyId);
      } else {
        const isFavorite = guestFavorites.some(id => id === storyId);
        const updated = isFavorite
          ? guestFavorites.filter(id => id !== storyId)
          : [...guestFavorites, storyId];
        setGuestFavorites(updated);
        localStorage.setItem(GUEST_FAVORITES_KEY, JSON.stringify(updated.map(id => id.toString())));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const favoriteStories = isAuthenticated ? backendFavorites || [] : [];
  const favoriteIds = isAuthenticated
    ? (backendFavorites || []).map(s => s.id)
    : guestFavorites;

  const isFavorite = (storyId: bigint) => favoriteIds.some(id => id === storyId);

  return {
    favoriteStories,
    favoriteIds,
    isFavorite,
    toggleFavorite: toggleFavorite.mutate,
    isToggling: toggleFavorite.isPending,
  };
}
