import { useState } from 'react';
import { Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { recordShare } from '../lib/engagement';
import { usePreferences } from '../context/PreferencesContext';
import { t } from '../lib/i18n';

interface ShareSheetPlaceholderProps {
  storyTitle: string;
  storyId: string;
}

export default function ShareSheetPlaceholder({ storyTitle, storyId }: ShareSheetPlaceholderProps) {
  const { language } = usePreferences();
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    const url = `${window.location.origin}/story/${storyId}`;
    const text = `Check out this story: ${storyTitle}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: storyTitle, text, url });
        const data = recordShare();
        if (data.bonusStoriesUnlocked > 0) {
          toast.success('Bonus story unlocked! 🎉');
        }
      } catch (e) {
        // User cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
        const data = recordShare();
        if (data.bonusStoriesUnlocked > 0) {
          toast.success('Bonus story unlocked! 🎉');
        }
      } catch (e) {
        toast.error('Failed to copy link');
      }
    }
    setIsSharing(false);
  };

  return (
    <Button variant="outline" size="icon" onClick={handleShare} disabled={isSharing}>
      <Share2 className="w-4 h-4" />
    </Button>
  );
}
