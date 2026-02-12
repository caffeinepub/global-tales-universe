import { Crown } from 'lucide-react';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

interface PremiumBadgeProps {
  variant?: 'default' | 'compact' | 'icon-only';
  className?: string;
}

export default function PremiumBadge({ variant = 'default', className }: PremiumBadgeProps) {
  if (variant === 'icon-only') {
    return (
      <div className={cn(
        "w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center border-2 border-background shadow-sm",
        className
      )}>
        <Crown className="w-4 h-4 text-white" />
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <Badge 
        variant="secondary" 
        className={cn(
          "bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-sm",
          className
        )}
      >
        <Crown className="w-3 h-3 mr-1" />
        Premium
      </Badge>
    );
  }

  return (
    <Badge 
      variant="secondary" 
      className={cn(
        "bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-sm px-3 py-1",
        className
      )}
    >
      <Crown className="w-4 h-4 mr-1.5" />
      Premium
    </Badge>
  );
}
