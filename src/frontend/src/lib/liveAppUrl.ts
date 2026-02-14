/**
 * Utility to compute the current live app URL.
 * In production, this returns the actual deployed URL.
 * Can be overridden via environment variable for testing.
 */

export function getLiveAppUrl(): string {
  // Check for build-time override (useful for testing)
  const envUrl = import.meta.env.VITE_LIVE_APP_URL;
  if (envUrl && typeof envUrl === 'string') {
    return envUrl;
  }

  // In production, use the current browser location
  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location;
    const portSuffix = port && port !== '80' && port !== '443' ? `:${port}` : '';
    return `${protocol}//${hostname}${portSuffix}`;
  }

  // Fallback (should not happen in browser context)
  return 'https://app-url-not-available.icp0.io';
}

export function isProductionUrl(url: string): boolean {
  return url.includes('.icp0.io') || url.includes('.raw.icp0.io') || url.includes('.ic0.app');
}
