import { X, Download } from 'lucide-react';
import { usePwaInstallPrompt } from '../hooks/usePwaInstallPrompt';
import { Button } from './ui/button';

export default function InstallPromptBanner() {
  const { isInstallable, promptInstall, dismissPrompt } = usePwaInstallPrompt();

  if (!isInstallable) {
    return null;
  }

  return (
    <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between gap-3 shadow-md">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Download className="w-5 h-5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">Install Global Tales</p>
          <p className="text-xs opacity-90 truncate">Access stories offline anytime</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button
          size="sm"
          variant="secondary"
          onClick={promptInstall}
          className="text-xs px-3 py-1 h-auto"
        >
          Install
        </Button>
        <button
          onClick={dismissPrompt}
          className="p-1 hover:bg-primary-foreground/10 rounded transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
