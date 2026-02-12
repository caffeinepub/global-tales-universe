import { useAppUser } from '../hooks/useAppUser';

interface AdPlaceholderProps {
  variant?: 'banner' | 'inline';
}

export default function AdPlaceholder({ variant = 'banner' }: AdPlaceholderProps) {
  const { isPremium } = useAppUser();

  // Premium users never see ads
  if (isPremium) {
    return null;
  }

  if (variant === 'banner') {
    return (
      <div className="w-full bg-muted border border-border rounded-lg p-4 text-center">
        <p className="text-sm text-muted-foreground">Advertisement</p>
        <p className="text-xs text-muted-foreground mt-1">
          Go Premium to remove ads
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-muted border border-border rounded-lg p-6 text-center my-4">
      <p className="text-sm text-muted-foreground">Advertisement</p>
      <p className="text-xs text-muted-foreground mt-1">
        Go Premium to remove ads
      </p>
    </div>
  );
}
