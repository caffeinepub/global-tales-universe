const ONBOARDING_KEY = 'gtu_onboarding_completed';

/**
 * Check if the user has completed onboarding
 */
export function isOnboardingCompleted(): boolean {
  try {
    const value = localStorage.getItem(ONBOARDING_KEY);
    return value === 'true';
  } catch (error) {
    console.warn('Failed to read onboarding status:', error);
    // If localStorage fails, assume onboarding is needed
    return false;
  }
}

/**
 * Mark onboarding as completed
 */
export function setOnboardingCompleted(): void {
  try {
    localStorage.setItem(ONBOARDING_KEY, 'true');
  } catch (error) {
    console.error('Failed to save onboarding status:', error);
    // Continue anyway - user can complete onboarding again if needed
  }
}

/**
 * Reset onboarding status (for testing/debugging)
 */
export function resetOnboarding(): void {
  try {
    localStorage.removeItem(ONBOARDING_KEY);
  } catch (error) {
    console.error('Failed to reset onboarding status:', error);
  }
}
