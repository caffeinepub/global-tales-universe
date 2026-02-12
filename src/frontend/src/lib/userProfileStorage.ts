// Guest profile persistence utilities using localStorage

export interface GuestProfile {
  displayName: string;
  username: string;
  image?: string; // data URL or remote URL
}

const GUEST_PROFILE_KEY = 'gtu_guest_profile';

export function getGuestProfile(): GuestProfile {
  try {
    const stored = localStorage.getItem(GUEST_PROFILE_KEY);
    if (!stored) {
      return { displayName: 'Guest', username: 'guest' };
    }
    const parsed = JSON.parse(stored);
    
    // Migration: handle old format with 'name' field
    if (parsed.name && !parsed.displayName) {
      return {
        displayName: parsed.name,
        username: parsed.name.toLowerCase().replace(/\s+/g, '_'),
        image: parsed.image,
      };
    }
    
    return {
      displayName: parsed.displayName || 'Guest',
      username: parsed.username || 'guest',
      image: parsed.image,
    };
  } catch {
    return { displayName: 'Guest', username: 'guest' };
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
