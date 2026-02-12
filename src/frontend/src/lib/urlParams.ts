/**
 * Utility to detect Preview/testing mode via query params or dev environment
 */
export function isPreviewMode(): boolean {
  if (typeof window === 'undefined') return false;
  
  const params = new URLSearchParams(window.location.search);
  return params.get('preview') === '1' || params.get('preview') === 'true' || import.meta.env.DEV;
}

/**
 * URL-safe encoding for category IDs that may contain spaces or special characters
 */
export function encodeCategoryId(category: string): string {
  return encodeURIComponent(category);
}

/**
 * Decode category ID back to original string
 */
export function decodeCategoryId(categoryId: string): string {
  return decodeURIComponent(categoryId);
}
