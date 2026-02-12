/**
 * Enhanced sharing utilities with explicit success/cancelled/failed result types,
 * improved shared text formatting with story preview and stable URLs,
 * and reliable state management for share actions.
 */

export type ShareResult = 'success' | 'cancelled' | 'failed';

export function getAppUrl(): string {
  if (typeof window === 'undefined') return 'https://gtu.app';
  return window.location.origin;
}

export function getStoryUrl(storyId: string | bigint): string {
  const baseUrl = getAppUrl();
  return `${baseUrl}/story/${storyId}`;
}

function canUseWebShare(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

export async function shareApp(): Promise<ShareResult> {
  const url = getAppUrl();
  const title = 'GTU - Great Tales Unlimited';
  const text = 'Check out GTU - unlimited stories in English, Tamil, and Hindi!';

  if (canUseWebShare()) {
    try {
      await navigator.share({ title, text, url });
      return 'success';
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return 'cancelled';
      }
      console.error('Share failed:', error);
      return 'failed';
    }
  }

  // Fallback: copy to clipboard
  try {
    await navigator.clipboard.writeText(url);
    return 'success';
  } catch (error) {
    console.error('Clipboard copy failed:', error);
    return 'failed';
  }
}

export async function shareStory(
  storyId: string | bigint,
  storyTitle: string,
  storyPreview?: string
): Promise<ShareResult> {
  const url = getStoryUrl(storyId);
  const title = `${storyTitle} - GTU`;
  const preview = storyPreview ? `${storyPreview.slice(0, 100)}...` : '';
  const text = preview
    ? `Read "${storyTitle}" on GTU\n\n${preview}`
    : `Read "${storyTitle}" on GTU`;

  if (canUseWebShare()) {
    try {
      await navigator.share({ title, text, url });
      return 'success';
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return 'cancelled';
      }
      console.error('Share failed:', error);
      return 'failed';
    }
  }

  // Fallback: copy to clipboard
  try {
    await navigator.clipboard.writeText(`${text}\n\n${url}`);
    return 'success';
  } catch (error) {
    console.error('Clipboard copy failed:', error);
    return 'failed';
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Clipboard copy failed:', error);
    return false;
  }
}
