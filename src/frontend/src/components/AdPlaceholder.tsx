import { useAppUser } from '../hooks/useAppUser';
import { isPreviewMode } from '../lib/urlParams';

interface AdPlaceholderProps {
  variant?: 'banner' | 'inline';
}

export default function AdPlaceholder({ variant = 'banner' }: AdPlaceholderProps) {
  const { isPremium } = useAppUser();

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

  return (
    <div className={`${baseClasses} ${variantClasses}`}>
      <p className="text-sm text-muted-foreground">Advertisement</p>
      <p className="text-xs text-muted-foreground mt-1">
        Go Premium to remove ads
      </p>
    </div>
  );
}
