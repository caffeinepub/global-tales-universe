import { useState } from 'react';
import { Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { recordShare } from '../lib/engagement';
import { shareStory } from '../lib/share';

interface ShareSheetPlaceholderProps {
  storyTitle: string;
  storyId: string | bigint;
  storyPreview?: string;
}

export default function ShareSheetPlaceholder({ storyTitle, storyId, storyPreview }: ShareSheetPlaceholderProps) {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    
    const success = await shareStory(storyId, storyTitle, storyPreview);
    
    if (success) {
      const data = recordShare();
      if (data.bonusStoriesUnlocked > 0) {
        toast.success('Bonus story unlocked! 🎉');
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
