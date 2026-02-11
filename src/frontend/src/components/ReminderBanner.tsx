import { useState, useEffect } from 'react';
import { shouldShowReminder, markReminderShown } from '../lib/reminders';
import { X } from 'lucide-react';
import { Button } from './ui/button';

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
    <div className="bg-primary/10 border-b border-primary/20 px-4 py-2 flex items-center justify-between">
      <p className="text-sm text-foreground">
        📚 New stories are waiting for you today!
      </p>
      <Button variant="ghost" size="icon" onClick={handleDismiss}>
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}
