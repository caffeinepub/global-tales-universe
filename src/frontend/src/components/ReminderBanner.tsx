import { useState, useEffect } from 'react';
import { shouldShowReminder, markReminderShown } from '../lib/reminders';
import { BookOpen } from 'lucide-react';
import TopBanner from './TopBanner';

export default function ReminderBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (shouldShowReminder()) {
      setShow(true);
    }
  }, []);

  const handleDismiss = () => {
    markReminderShown();
    setShow(false);
  };

  if (!show) return null;

  return (
    <TopBanner
      icon={<BookOpen />}
      title="New stories are waiting for you today!"
      onDismiss={handleDismiss}
      variant="default"
    />
  );
}
