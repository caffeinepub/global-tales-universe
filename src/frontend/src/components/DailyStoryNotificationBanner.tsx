import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import TopBanner from './TopBanner';

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
    <TopBanner
      icon={<Sparkles />}
      title="New story today! Check out the latest featured story."
      onDismiss={handleDismiss}
      variant="accent"
    />
  );
}
