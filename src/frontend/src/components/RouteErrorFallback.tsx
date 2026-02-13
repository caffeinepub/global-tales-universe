import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Button } from './ui/button';
import { Home, AlertCircle, Copy } from 'lucide-react';
import { cardRadius, cardPadding, cardElevation, iconSizes } from '../lib/uiPolish';
import ButtonStyleRegressionCheck from './ButtonStyleRegressionCheck';
import { logOnce } from '../lib/logOnce';
import { recordNavFailure } from '../lib/navFailures';
import { toast } from 'sonner';
import { getFullPath } from '../lib/routerSearch';

export default function RouteErrorFallback() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const currentSearch = routerState.location.search;
  const fullPath = getFullPath(currentPath, currentSearch);

  // Log when this fallback renders
  useEffect(() => {
    const logKey = `route-error-${currentPath}`;
    const errorMessage = `RouteErrorFallback rendered: path="${fullPath}"`;
    
    logOnce(logKey, errorMessage, 'error');
    
    // Record navigation failure
    recordNavFailure(
      fullPath,
      fullPath, // Current location is the same as attempted (we're already here)
      'Route not found or error rendering route'
    );
  }, [currentPath, fullPath]);

  const handleGoHome = () => {
    navigate({ to: '/' });
  };

  const handleCopyDiagnostics = async () => {
    const diagnostics = [
      `Attempted path: ${fullPath}`,
      `Timestamp: ${new Date().toISOString()}`,
      `User agent: ${navigator.userAgent}`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(diagnostics);
      toast.success('Diagnostics copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy diagnostics');
      console.error('Copy failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <ButtonStyleRegressionCheck />
      
      <div className={`${cardRadius.medium} ${cardPadding.spacious} bg-card ${cardElevation.medium} max-w-md w-full text-center`}>
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertCircle className={`${iconSizes.xl} text-destructive`} />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
        <p className="text-muted-foreground mb-2">
          Sorry, we couldn't find the page you're looking for. It may have been moved or doesn't exist.
        </p>
        
        {/* Diagnostics info */}
        <div className={`${cardPadding.default} ${cardRadius.small} bg-muted text-left mb-6 mt-4`}>
          <p className="text-xs text-muted-foreground mb-1">Tried to open:</p>
          <code className="text-xs break-all">{fullPath}</code>
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={handleGoHome}
            className="w-full"
            size="lg"
          >
            <Home className={`${iconSizes.sm} mr-2`} />
            Go to Home
          </Button>
          
          <Button
            onClick={handleCopyDiagnostics}
            variant="outline"
            className="w-full"
            size="sm"
          >
            <Copy className={`${iconSizes.sm} mr-2`} />
            Copy Diagnostics
          </Button>
        </div>
      </div>
    </div>
  );
}
