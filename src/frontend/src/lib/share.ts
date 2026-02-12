import { toast } from 'sonner';

interface ShareOptions {
  title?: string;
  text: string;
  url: string;
}

/**
 * Share content using Web Share API or fallback to clipboard
 */
export async function shareContent(options: ShareOptions): Promise<boolean> {
  const { title, text, url } = options;

  // Try Web Share API first
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return true;
    } catch (error: any) {
      // User cancelled or error occurred
      if (error.name !== 'AbortError') {
        console.warn('Share failed:', error);
      }
      return false;
    }
  }

  // Fallback to clipboard
  return copyToClipboard(url);
}

/**
 * Copy text to clipboard with fallback
 */
async function copyToClipboard(text: string): Promise<boolean> {
  // Try modern clipboard API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Link copied to clipboard!');
      return true;
    } catch (error) {
      console.warn('Clipboard write failed:', error);
    }
  }

  // Fallback to execCommand (deprecated but widely supported)
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (successful) {
      toast.success('Link copied to clipboard!');
      return true;
    }
  } catch (error) {
    console.warn('execCommand copy failed:', error);
  }

  // Final fallback: show the URL in a toast
  toast.info(`Share this link: ${text}`, { duration: 5000 });
  return false;
}

/**
 * Get current app URL
 */
export function getAppUrl(): string {
  return window.location.origin;
}

/**
 * Get story URL
 */
export function getStoryUrl(storyId: string | bigint): string {
  return `${window.location.origin}/story/${storyId}`;
}

/**
 * Share the app
 */
export async function shareApp(): Promise<boolean> {
  const url = getAppUrl();
  const text = `Check out Global Tales Universe – Free multi-language stories app for adults & kids! Install here: ${url}`;
  
  return shareContent({
    title: 'Global Tales Universe',
    text,
    url,
  });
}

/**
 * Share a story
 */
export async function shareStory(storyId: string | bigint, title: string, preview?: string): Promise<boolean> {
  const url = getStoryUrl(storyId);
  const previewText = preview ? ` - ${preview}` : '';
  const text = `Check out this story: ${title}${previewText}\n\n${url}`;
  
  return shareContent({
    title,
    text,
    url,
  });
}
