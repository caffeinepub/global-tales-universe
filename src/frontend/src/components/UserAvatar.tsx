import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  imageUrl?: string;
  name?: string;
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  className?: string;
}

export default function UserAvatar({ 
  imageUrl, 
  name = 'User', 
  size = 'medium',
  isLoading = false,
  className 
}: UserAvatarProps) {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-24 h-24',
  };

  const iconSizes = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-12 h-12',
  };

  return (
    <div className={cn('relative', className)}>
      <Avatar className={sizeClasses[size]}>
        <AvatarImage 
          src={imageUrl || '/assets/generated/gtu-placeholder-avatar.dim_256x256.png'} 
          alt={name}
        />
        <AvatarFallback>
          <User className={iconSizes[size]} />
        </AvatarFallback>
      </Avatar>
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 rounded-full flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
