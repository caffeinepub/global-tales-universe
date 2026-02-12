// Guest profile persistence utilities using localStorage

export interface GuestProfile {
  name: string;
  image?: string; // data URL or remote URL
}

const GUEST_PROFILE_KEY = 'gtu_guest_profile';

export function getGuestProfile(): GuestProfile {
  try {
    const stored = localStorage.getItem(GUEST_PROFILE_KEY);
    if (!stored) {
      return { name: 'Guest' };
    }
    const parsed = JSON.parse(stored);
    return {
      name: parsed.name || 'Guest',
      image: parsed.image,
    };
  } catch {
    return { name: 'Guest' };
  }
}

export function saveGuestProfile(profile: GuestProfile): void {
  try {
    localStorage.setItem(GUEST_PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.warn('Failed to save guest profile', e);
  }
}

export function clearGuestProfile(): void {
  try {
    localStorage.removeItem(GUEST_PROFILE_KEY);
  } catch (e) {
    console.warn('Failed to clear guest profile', e);
  }
}
