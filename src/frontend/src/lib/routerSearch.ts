/**
 * Safely converts TanStack Router search to a query string.
 * TanStack Router's location.search can be an object, URLSearchParams, or string.
 * This helper ensures we always get a valid string representation.
 */
export function getSearchString(search: unknown): string {
  if (!search) return '';
  
  // If it's already a string, use it
  if (typeof search === 'string') {
    return search.startsWith('?') ? search.slice(1) : search;
  }
  
  // If it's URLSearchParams, convert to string
  if (search instanceof URLSearchParams) {
    const str = search.toString();
    return str || '';
  }
  
  // If it's an object, serialize to query string
  if (typeof search === 'object' && search !== null) {
    try {
      const params = new URLSearchParams();
      Object.entries(search).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
      const str = params.toString();
      return str || '';
    } catch (error) {
      console.warn('Failed to serialize search object:', error);
      return '';
    }
  }
  
  return '';
}

/**
 * Builds a full path with pathname and search query string.
 * Ensures no double-? and no [object Object] artifacts.
 */
export function getFullPath(pathname: string, search: unknown): string {
  const searchStr = getSearchString(search);
  return searchStr ? `${pathname}?${searchStr}` : pathname;
}
