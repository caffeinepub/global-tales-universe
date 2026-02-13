/**
 * Navigation failure tracking utility using sessionStorage
 * Records the last N navigation failures for debugging
 */

export interface NavFailure {
  attemptedDestination: string;
  currentLocation: string;
  errorText: string;
  timestamp: number;
}

const STORAGE_KEY = 'nav_failures';
const MAX_FAILURES = 10;

/**
 * Record a navigation failure
 */
export function recordNavFailure(
  attemptedDestination: string,
  currentLocation: string,
  errorText: string
): void {
  try {
    const failures = getNavFailures();
    const newFailure: NavFailure = {
      attemptedDestination,
      currentLocation,
      errorText,
      timestamp: Date.now(),
    };
    
    // Add to beginning, keep only last MAX_FAILURES
    failures.unshift(newFailure);
    const trimmed = failures.slice(0, MAX_FAILURES);
    
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (error) {
    // Best-effort: if sessionStorage fails, just log to console
    console.warn('Failed to record navigation failure:', error);
  }
}

/**
 * Retrieve all recorded navigation failures
 */
export function getNavFailures(): NavFailure[] {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Failed to retrieve navigation failures:', error);
    return [];
  }
}

/**
 * Clear all recorded navigation failures
 */
export function clearNavFailures(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear navigation failures:', error);
  }
}
