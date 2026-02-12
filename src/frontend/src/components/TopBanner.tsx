import { ReactNode } from 'react';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { iconSizes, focusRing } from '../lib/uiPolish';

interface TopBannerProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  onDismiss: () => void;
  variant?: 'default' | 'primary' | 'accent';
  className?: string;
}

export default function TopBanner({
  icon,
  title,
  description,
  onDismiss,
  variant = 'default',
  className = '',
}: TopBannerProps) {
  const variantClasses = {
    default: 'bg-muted/50 border-b border-border',
    primary: 'bg-primary text-primary-foreground border-b border-primary/20',
    accent: 'bg-gradient-to-r from-primary to-accent text-primary-foreground border-b border-primary/20',
  };

  return (
    <div className={`${variantClasses[variant]} px-4 py-3 ${className}`}>
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {icon && <div className={`${iconSizes.md} shrink-0`}>{icon}</div>}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{title}</p>
            {description && <p className="text-xs opacity-90 mt-0.5">{description}</p>}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className={`shrink-0 h-8 w-8 ${variant !== 'default' ? 'hover:bg-primary-foreground/20 text-primary-foreground' : ''} ${focusRing}`}
          aria-label="Dismiss"
        >
          <X className={iconSizes.sm} />
        </Button>
      </div>
    </div>
  );
}
