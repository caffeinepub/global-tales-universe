import { useState } from 'react';
import { Share2, Copy } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { recordShare } from '../lib/engagement';
import { shareStory, copyToClipboard, getStoryUrl, ShareResult } from '../lib/share';
import { iconSizes } from '../lib/uiPolish';

interface ShareSheetPlaceholderProps {
  storyTitle: string;
  storyId: string | bigint;
  storyPreview?: string;
}

export default function ShareSheetPlaceholder({ storyTitle, storyId, storyPreview }: ShareSheetPlaceholderProps) {
  const [isSharing, setIsSharing] = useState(false);

  const hasWebShareApi = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const handleShare = async () => {
    if (isSharing) return;
    
    setIsSharing(true);
    
    try {
      const result: ShareResult = await shareStory(storyId, storyTitle, storyPreview);
      
      if (result === 'success') {
        const data = recordShare();
        if (data.bonusStoriesUnlocked > 0) {
          toast.success('Thanks for sharing! Bonus story unlocked 🎉');
        } else {
          toast.success('Thanks for sharing!');
        }
      } else if (result === 'cancelled') {
        // User cancelled, no message needed
      } else {
        toast.error('Failed to share. Please try again.');
      }
    } catch (error) {
      console.error('Share error:', error);
      toast.error('Failed to share. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyLink = async () => {
    const url = getStoryUrl(storyId);
    const success = await copyToClipboard(url);
    if (success) {
      toast.success('Story link copied to clipboard!');
    } else {
      toast.error('Failed to copy link. Please try again.');
    }
  };

  if (!hasWebShareApi) {
    return (
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handleCopyLink}
        title="Copy story link"
      >
        <Copy className={iconSizes.sm} />
      </Button>
    );
  }

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={handleShare} 
      disabled={isSharing}
      title="Share story"
    >
      <Share2 className={`${iconSizes.sm} ${isSharing ? 'animate-pulse' : ''}`} />
    </Button>
  );
}
