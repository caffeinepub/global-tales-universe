import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { StoryDraft } from '../backend';
import { getGuestStories, GuestStoryDraft } from '../lib/userStoriesStorage';

export type MyStoryItem = StoryDraft | GuestStoryDraft;

function isGuestDraft(item: MyStoryItem): item is GuestStoryDraft {
  return typeof item.id === 'string';
}

export function useMyStories() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return useQuery<MyStoryItem[]>({
    queryKey: ['myStories', isAuthenticated],
    queryFn: async () => {
      if (isAuthenticated && actor) {
        try {
          const drafts = await actor.getMyStoryDrafts();
          // Filter expired drafts (24h)
          const now = Date.now();
          const active = drafts.filter(draft => {
            const createdMs = Number(draft.createdAt) / 1_000_000; // nanoseconds to ms
            const expiresAt = createdMs + (24 * 60 * 60 * 1000);
            return expiresAt > now;
          });
          // Sort newest first
          return active.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
        } catch (error) {
          console.error('Failed to fetch authenticated stories:', error);
          return [];
        }
      } else {
        // Guest mode - read from localStorage
        const guestDrafts = getGuestStories();
        // Already sorted newest first and pruned in getGuestStories
        return guestDrafts;
      }
    },
    enabled: !!actor && !actorFetching,
  });
}

export { isGuestDraft };
