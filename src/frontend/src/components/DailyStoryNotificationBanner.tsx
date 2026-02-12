import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { X, Sparkles } from 'lucide-react';

interface DailyStoryNotificationBannerProps {
  show: boolean;
}

export default function DailyStoryNotificationBanner({ show }: DailyStoryNotificationBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const DISMISS_KEY = 'gtu_daily_notification_banner_dismissed';
  const DISMISS_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  useEffect(() => {
    const dismissedTime = localStorage.getItem(DISMISS_KEY);
    if (dismissedTime) {
      const elapsed = Date.now() - parseInt(dismissedTime, 10);
      if (elapsed < DISMISS_DURATION) {
        setDismissed(true);
      } else {
        localStorage.removeItem(DISMISS_KEY);
      }
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
  };

  if (!show || dismissed) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-primary/90 to-accent/90 text-primary-foreground px-4 py-3 border-b border-primary/20">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <Sparkles className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">New story today!</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDismiss}
          className="shrink-0 hover:bg-primary-foreground/20 text-primary-foreground"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
