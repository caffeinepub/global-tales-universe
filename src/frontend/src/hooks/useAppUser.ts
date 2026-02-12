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
  dailyNotificationsEnabled?: boolean;
}

const GUEST_STORAGE_KEY = 'gtu_guest_user_state';
const NOTIFICATIONS_PREF_KEY = 'gtu_notifications_pref';

export function useAppUser() {
  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [guestState, setGuestState] = useState<UserState>(() => {
    try {
      const stored = localStorage.getItem(GUEST_STORAGE_KEY);
      if (!stored) return {};
      const parsed = JSON.parse(stored);
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

  const saveBackendUser = useMutation({
    mutationFn: async (appUser: AppUser) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveAppUser(appUser);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appUser'] });
    },
  });

  // Optimistic premium state for instant UI updates
  const [optimisticPremium, setOptimisticPremium] = useState<boolean | null>(null);

  const isPremium = optimisticPremium !== null 
    ? optimisticPremium 
    : isAuthenticated && backendUser 
      ? backendUser.premiumSubscriptionActive 
      : guestState.isPremium || false;

  const dailyNotificationsEnabled = (() => {
    if (isAuthenticated && identity) {
      const key = `${NOTIFICATIONS_PREF_KEY}_${identity.getPrincipal().toString()}`;
      const stored = localStorage.getItem(key);
      return stored === 'true';
    }
    return guestState.dailyNotificationsEnabled || false;
  })();

  const userState: UserState | AppUser = isAuthenticated && backendUser ? backendUser : guestState;

  const updateUserState = (updates: Partial<UserState>) => {
    if (isAuthenticated && backendUser && actor) {
      if ('isPremium' in updates) {
        // Set optimistic state immediately
        setOptimisticPremium(updates.isPremium || false);
        
        const updated = { 
          ...backendUser, 
          premiumSubscriptionActive: updates.isPremium || false 
        } as AppUser;
        
        saveBackendUser.mutate(updated, {
          onSuccess: () => {
            // Clear optimistic state after backend confirms
            setOptimisticPremium(null);
          },
          onError: () => {
            // Revert optimistic state on error
            setOptimisticPremium(null);
          }
        });
      }
      
      if ('dailyNotificationsEnabled' in updates && identity) {
        const key = `${NOTIFICATIONS_PREF_KEY}_${identity.getPrincipal().toString()}`;
        localStorage.setItem(key, String(updates.dailyNotificationsEnabled || false));
      }
    } else {
      const updated = { ...guestState, ...updates };
      setGuestState(updated);
      try {
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
    isPremium,
    dailyNotificationsEnabled,
  };
}
