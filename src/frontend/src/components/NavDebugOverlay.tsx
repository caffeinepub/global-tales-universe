import { useEffect, useState } from 'react';
import { getNavFailures, clearNavFailures, type NavFailure } from '../lib/navFailures';
import { Button } from './ui/button';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import { cardRadius, cardPadding, cardElevation, iconSizes } from '../lib/uiPolish';

export default function NavDebugOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [failures, setFailures] = useState<NavFailure[]>([]);

  useEffect(() => {
    // Check if debug flag is present in URL
    const params = new URLSearchParams(window.location.search);
    const shouldShow = params.get('debug') === 'nav';
    setIsVisible(shouldShow);
    
    if (shouldShow) {
      // Load failures when overlay becomes visible
      setFailures(getNavFailures());
    }
  }, []);

  const handleClear = () => {
    clearNavFailures();
    setFailures([]);
  };

  const handleClose = () => {
    // Remove debug param from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('debug');
    window.history.replaceState({}, '', url.toString());
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className={`${cardRadius.medium} ${cardPadding.spacious} bg-card ${cardElevation.high} max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className={`${iconSizes.md} text-warning`} />
            <h2 className="text-xl font-bold">Navigation Debug</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            aria-label="Close debug overlay"
          >
            <X className={iconSizes.md} />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {failures.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-lg mb-2">No navigation failures recorded yet.</p>
              <p className="text-sm">
                Navigation failures will appear here when they occur.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {failures.map((failure, index) => (
                <div
                  key={index}
                  className={`${cardPadding.default} ${cardRadius.small} bg-destructive/10 border border-destructive/20`}
                >
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="font-semibold text-destructive">Attempted:</span>{' '}
                      <code className="text-xs bg-background px-1 py-0.5 rounded">
                        {failure.attemptedDestination}
                      </code>
                    </div>
                    <div>
                      <span className="font-semibold text-destructive">Current:</span>{' '}
                      <code className="text-xs bg-background px-1 py-0.5 rounded">
                        {failure.currentLocation}
                      </code>
                    </div>
                    <div>
                      <span className="font-semibold text-destructive">Error:</span>{' '}
                      <span className="text-xs">{failure.errorText}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(failure.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {failures.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
            >
              <Trash2 className={`${iconSizes.sm} mr-2`} />
              Clear All
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
