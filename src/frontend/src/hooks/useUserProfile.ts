import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInternetIdentity } from './useInternetIdentity';
import { useActor } from './useActor';
import { UserProfile, ExternalBlob } from '../backend';
import { getGuestProfile, saveGuestProfile, GuestProfile } from '../lib/userProfileStorage';
import { useMemo } from 'react';

export interface ProfileData {
  displayName: string;
  username: string;
  image?: string; // For display: data URL or direct URL
}

export function useUserProfile() {
  const { identity } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  // Fetch authenticated user profile with error handling
  const authenticatedQuery = useQuery<UserProfile | null>({
    queryKey: ['userProfile', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        const profile = await actor.getCallerUserProfile();
        return profile;
      } catch (error: any) {
        console.error('Failed to fetch user profile:', error);
        // If unauthorized or trap, return null to trigger guest fallback
        if (error.message?.includes('Unauthorized') || error.message?.includes('trap')) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
  });

  // Fetch guest profile (synchronous from localStorage)
  const guestProfile = !isAuthenticated ? getGuestProfile() : null;

  // Stable profile data derived from query state
  const profileData: ProfileData = useMemo(() => {
    if (isAuthenticated) {
      if (authenticatedQuery.data) {
        // Convert ExternalBlob to URL if present
        const imageUrl = authenticatedQuery.data.image
          ? authenticatedQuery.data.image.getDirectURL()
          : undefined;
        return {
          displayName: authenticatedQuery.data.displayName || 'User',
          username: authenticatedQuery.data.username || 'user',
          image: imageUrl,
        };
      } else if (authenticatedQuery.isFetched && authenticatedQuery.data === null) {
        // No profile yet, use principal-derived default
        const principal = identity?.getPrincipal().toString() || 'User';
        const shortName = principal.substring(0, 8);
        return { displayName: `User-${shortName}`, username: `user-${shortName}` };
      } else if (authenticatedQuery.isError) {
        // Error fetching profile, use fallback
        return { displayName: 'Guest', username: 'guest' };
      }
      return { displayName: 'Loading...', username: 'loading' };
    } else {
      return {
        displayName: guestProfile?.displayName || 'Guest',
        username: guestProfile?.username || 'guest',
        image: guestProfile?.image,
      };
    }
  }, [isAuthenticated, authenticatedQuery.data, authenticatedQuery.isFetched, authenticatedQuery.isError, identity, guestProfile]);

  // Save profile mutation
  const saveMutation = useMutation({
    mutationFn: async (profile: { displayName: string; username: string; image?: string | File }) => {
      if (isAuthenticated) {
        if (!actor) throw new Error('Actor not available');
        
        let imageBlob: ExternalBlob | undefined;
        
        if (profile.image) {
          if (typeof profile.image === 'string') {
            // URL string
            imageBlob = ExternalBlob.fromURL(profile.image);
          } else {
            // File object - convert to bytes
            const arrayBuffer = await profile.image.arrayBuffer();
            const bytes = new Uint8Array(arrayBuffer);
            imageBlob = ExternalBlob.fromBytes(bytes);
          }
        }
        
        const backendProfile: UserProfile = {
          displayName: profile.displayName,
          username: profile.username,
          image: imageBlob,
        };
        
        await actor.saveCallerUserProfile(backendProfile);
      } else {
        // Guest mode - save to localStorage
        let imageUrl: string | undefined;
        
        if (profile.image) {
          if (typeof profile.image === 'string') {
            imageUrl = profile.image;
          } else {
            // Convert File to data URL
            const reader = new FileReader();
            imageUrl = await new Promise<string>((resolve, reject) => {
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(profile.image as File);
            });
          }
        }
        
        const guestProfile: GuestProfile = {
          displayName: profile.displayName,
          username: profile.username,
          image: imageUrl,
        };
        
        saveGuestProfile(guestProfile);
      }
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      }
    },
  });

  return {
    profileData, // Stable, render-safe profile data
    saveProfile: saveMutation.mutateAsync,
    isLoading: isAuthenticated ? (actorFetching || authenticatedQuery.isLoading) : false,
    isSaving: saveMutation.isPending,
    isFetched: isAuthenticated ? (!!actor && authenticatedQuery.isFetched) : true,
    error: saveMutation.error,
    isAuthenticated,
  };
}
