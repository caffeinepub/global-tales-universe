import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { User } from 'lucide-react';
import { iconSizes } from '../lib/uiPolish';
import { logOnce } from '../lib/logOnce';

interface UserAvatarProps {
  imageUrl?: string;
  name: string;
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
}

export default function UserAvatar({ imageUrl, name, size = 'medium', isLoading }: UserAvatarProps) {
  const sizeClasses = {
    small: 'h-10 w-10',
    medium: 'h-16 w-16',
    large: 'h-24 w-24',
  };

  const iconSize = {
    small: iconSizes.sm,
    medium: iconSizes.md,
    large: iconSizes.lg,
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage 
          src={imageUrl || '/assets/generated/gtu-placeholder-avatar.dim_256x256.png'} 
          alt={name}
          onError={() => {
            logOnce('avatar-image-load-fail', 'Failed to load avatar image, using fallback');
          }}
        />
        <AvatarFallback className="bg-primary/10">
          {initials || <User className={iconSize[size]} />}
        </AvatarFallback>
      </Avatar>
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 rounded-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-1/2 w-1/2 border-2 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  );
}
