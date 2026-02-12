import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInternetIdentity } from './useInternetIdentity';
import { useActor } from './useActor';
import { UserProfile, ExternalBlob } from '../backend';
import { getGuestProfile, saveGuestProfile, GuestProfile } from '../lib/userProfileStorage';

export interface ProfileData {
  name: string;
  image?: string; // For display: data URL or direct URL
}

export function useUserProfile() {
  const { identity } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  // Fetch authenticated user profile
  const authenticatedQuery = useQuery<UserProfile | null>({
    queryKey: ['userProfile', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const profile = await actor.getCallerUserProfile();
      return profile;
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
  });

  // Fetch guest profile (synchronous from localStorage)
  const guestProfile = !isAuthenticated ? getGuestProfile() : null;

  // Determine current profile
  const getCurrentProfile = async (): Promise<ProfileData> => {
    if (isAuthenticated) {
      if (authenticatedQuery.data) {
        // Convert ExternalBlob to URL if present
        const imageUrl = authenticatedQuery.data.image
          ? authenticatedQuery.data.image.getDirectURL()
          : undefined;
        return {
          name: authenticatedQuery.data.name || 'User',
          image: imageUrl,
        };
      } else if (authenticatedQuery.isFetched && authenticatedQuery.data === null) {
        // No profile yet, use principal-derived default
        const principal = identity?.getPrincipal().toString() || 'User';
        const shortName = principal.substring(0, 8);
        return { name: `User-${shortName}` };
      }
      return { name: 'Loading...' };
    } else {
      return {
        name: guestProfile?.name || 'Guest',
        image: guestProfile?.image,
      };
    }
  };

  // Save profile mutation
  const saveMutation = useMutation({
    mutationFn: async (profile: { name: string; image?: string | File }) => {
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
          name: profile.name,
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
          name: profile.name,
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
    profile: getCurrentProfile,
    saveProfile: saveMutation.mutateAsync,
    isLoading: isAuthenticated ? (actorFetching || authenticatedQuery.isLoading) : false,
    isSaving: saveMutation.isPending,
    isFetched: isAuthenticated ? (!!actor && authenticatedQuery.isFetched) : true,
    error: saveMutation.error,
    isAuthenticated,
  };
}
