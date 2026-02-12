import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { Story } from '../backend';

export function useMyStories() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return useQuery<Story[]>({
    queryKey: ['myStories'],
    queryFn: async () => {
      if (!actor || !isAuthenticated) return [];
      
      // Check if backend supports getting user's stories
      if (typeof (actor as any).getMyStories === 'function') {
        return (actor as any).getMyStories();
      }
      
      // Feature not available yet
      return [];
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
  });
}
