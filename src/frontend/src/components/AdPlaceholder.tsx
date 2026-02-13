import { useAppUser } from '../hooks/useAppUser';
import { isPreviewMode } from '../lib/urlParams';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Button } from './ui/button';
import { logOnce } from '../lib/logOnce';

interface AdPlaceholderProps {
  variant?: 'banner' | 'inline';
}

export default function AdPlaceholder({ variant = 'banner' }: AdPlaceholderProps) {
  const { isPremium } = useAppUser();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const currentSearch = routerState.location.search;

  // Premium users never see ads - return null immediately
  if (isPremium) {
    return null;
  }

  // Hide ads in preview/testing mode
  if (isPreviewMode()) {
    return null;
  }

  const baseClasses = 'w-full bg-muted border border-border rounded-lg text-center';
  const variantClasses = variant === 'banner' ? 'p-4' : 'p-6 my-4';

  const handleGoPremium = () => {
    try {
      navigate({ to: '/premium' });
    } catch (error) {
      const logKey = `ad-premium-${currentPath}`;
      logOnce(
        logKey,
        `AdPlaceholder navigation failed: attempted="/premium" current="${currentPath}${currentSearch}" error="${error}"`,
        'error'
      );
    }
  };

  return (
    <div className={`${baseClasses} ${variantClasses}`}>
      <p className="text-sm text-muted-foreground mb-2">Advertisement</p>
      <Button 
        onClick={handleGoPremium}
        variant="outline"
        size="sm"
        className="text-xs"
      >
        Go Premium to remove ads
      </Button>
    </div>
  );
}
