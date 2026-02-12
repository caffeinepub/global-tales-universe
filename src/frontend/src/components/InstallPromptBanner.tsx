import { Download, X } from 'lucide-react';
import { usePwaInstallPrompt } from '../hooks/usePwaInstallPrompt';
import { Button } from './ui/button';
import { iconSizes, focusRing } from '../lib/uiPolish';

export default function InstallPromptBanner() {
  const { isInstallable, promptInstall, dismissPrompt } = usePwaInstallPrompt();

  if (!isInstallable) {
    return null;
  }

  return (
    <div className="bg-primary text-primary-foreground px-4 py-3 border-b border-primary/20 shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Download className={`${iconSizes.md} shrink-0`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Install Global Tales</p>
            <p className="text-xs opacity-90 mt-0.5">Access stories offline anytime</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="secondary"
            onClick={promptInstall}
            className="text-xs"
          >
            Install
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={dismissPrompt}
            className="h-8 w-8 p-0"
            aria-label="Dismiss"
          >
            <X className={iconSizes.sm} />
          </Button>
        </div>
      </div>
    </div>
  );
}
