import { useState, useEffect } from 'react';
import { useInternetIdentity } from './useInternetIdentity';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { AppUser } from '../backend';

interface UserState {
  preferences?: {
    language?: string;
    mode?: string;
    fontSize?: string;
    readingBackground?: string;
    autoScroll?: boolean;
    preferredCategories?: string[];
  };
  isPremium?: boolean;
  streak?: number;
  badges?: string[];
  challengeProgress?: number;
  sharesCount?: number;
  bonusStoriesUnlocked?: number;
  readingHistory?: Array<{
    storyId: bigint;
    timestamp: number;
    progress: number;
  }>;
}

const GUEST_STORAGE_KEY = 'gtu_guest_user_state';

export function useAppUser() {
  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [guestState, setGuestState] = useState<UserState>(() => {
    try {
      const stored = localStorage.getItem(GUEST_STORAGE_KEY);
      if (!stored) return {};
      const parsed = JSON.parse(stored);
      // Convert string IDs back to bigints for readingHistory
      if (parsed.readingHistory) {
        parsed.readingHistory = parsed.readingHistory.map((entry: any) => ({
          ...entry,
          storyId: BigInt(entry.storyId),
        }));
      }
      return parsed;
    } catch {
      return {};
    }
  });

  const isAuthenticated = !!identity;

  // Fetch backend user data when authenticated
  const { data: backendUser } = useQuery<AppUser | null>({
    queryKey: ['appUser', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !isAuthenticated) return null;
      try {
        return await actor.getAppUser();
      } catch {
        return null;
      }
    },
    enabled: !!actor && isAuthenticated,
  });

  // Save backend user data
  const saveBackendUser = useMutation({
    mutationFn: async (appUser: AppUser) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveAppUser(appUser);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appUser'] });
    },
  });

  // Unified user state (guest or authenticated)
  const userState: UserState | AppUser = isAuthenticated && backendUser ? backendUser : guestState;

  const updateUserState = (updates: Partial<UserState>) => {
    if (isAuthenticated && backendUser && actor) {
      // For authenticated users, merge with backend user
      const updated = { ...backendUser, ...updates } as AppUser;
      saveBackendUser.mutate(updated);
    } else {
      // For guests, merge with local state
      const updated = { ...guestState, ...updates };
      setGuestState(updated);
      try {
        // Serialize bigints to strings for localStorage
        const serialized = JSON.parse(JSON.stringify(updated, (key, value) =>
          typeof value === 'bigint' ? value.toString() : value
        ));
        localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(serialized));
      } catch (e) {
        console.warn('Failed to save guest state', e);
      }
    }
  };

  return {
    userState,
    updateUserState,
    isAuthenticated,
  };
}
