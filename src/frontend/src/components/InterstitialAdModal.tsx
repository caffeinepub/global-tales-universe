import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { useAppUser } from '../hooks/useAppUser';
import { isPreviewMode } from '../lib/urlParams';

interface InterstitialAdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InterstitialAdModal({ isOpen, onClose }: InterstitialAdModalProps) {
  const { isPremium } = useAppUser();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (isOpen && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, countdown]);

  useEffect(() => {
    if (isOpen) {
      setCountdown(3);
    }
  }, [isOpen]);

  // Premium users never see interstitial ads
  if (isPremium) {
    return null;
  }

  // Hide ads in preview/testing mode
  if (isPreviewMode()) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Advertisement</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <div className="w-full h-48 bg-muted border border-dashed border-border rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">[Interstitial Ad Placeholder]</p>
          </div>
          <Button
            onClick={onClose}
            disabled={countdown > 0}
            className="w-full"
          >
            {countdown > 0 ? `Continue in ${countdown}s` : 'Continue'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
