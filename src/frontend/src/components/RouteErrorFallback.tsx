import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Button } from './ui/button';
import { Home, AlertCircle } from 'lucide-react';
import { cardRadius, cardPadding, cardElevation, iconSizes } from '../lib/uiPolish';
import ButtonStyleRegressionCheck from './ButtonStyleRegressionCheck';
import { logOnce } from '../lib/logOnce';

export default function RouteErrorFallback() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const currentSearch = routerState.location.search;

  // Log when this fallback renders
  useEffect(() => {
    const logKey = `route-error-${currentPath}`;
    logOnce(
      logKey,
      `RouteErrorFallback rendered: path="${currentPath}" search="${currentSearch}"`,
      'error'
    );
  }, [currentPath, currentSearch]);

  const handleGoHome = () => {
    navigate({ to: '/' });
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
        <p className="text-muted-foreground mb-6">
          Sorry, we couldn't find the page you're looking for. It may have been moved or doesn't exist.
        </p>
        
        <Button 
          onClick={handleGoHome}
          className="w-full"
          size="lg"
        >
          <Home className={`${iconSizes.sm} mr-2`} />
          Go to Home
        </Button>
      </div>
    </div>
  );
}
