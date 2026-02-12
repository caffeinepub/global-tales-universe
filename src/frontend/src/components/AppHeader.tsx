import { Menu } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import UserAvatar from './UserAvatar';
import { useUserProfile } from '../hooks/useUserProfile';
import { iconSizes, focusRing } from '../lib/uiPolish';
import { logOnce } from '../lib/logOnce';

interface AppHeaderProps {
  onMenuClick: () => void;
}

export default function AppHeader({ onMenuClick }: AppHeaderProps) {
  const [imageError, setImageError] = useState(false);
  const { profileData, isLoading } = useUserProfile();

  return (
    <header className="bg-card border-b border-border px-4 py-3 flex items-center gap-3 shrink-0">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onMenuClick} 
        aria-label="Open menu"
        className={focusRing}
      >
        <Menu className={iconSizes.md} />
      </Button>
      <div className="flex-1 flex items-center justify-center">
        {!imageError ? (
          <img 
            src="/assets/generated/gtu-app-icon.dim_512x512.png" 
            alt="Global Tales Universe" 
            className="h-8 w-auto object-contain"
            onError={() => {
              logOnce('header-icon-load-fail', 'Failed to load header icon, using text fallback');
              setImageError(true);
            }}
          />
        ) : (
          <span className="text-lg font-bold text-primary">GTU</span>
        )}
      </div>
      {/* Avatar to balance logo centering */}
      <div className="w-10 flex items-center justify-center">
        <UserAvatar 
          imageUrl={profileData.image}
          name={profileData.displayName}
          size="small"
          isLoading={isLoading}
        />
      </div>
    </header>
  );
}
