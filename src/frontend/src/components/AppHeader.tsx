import { Menu } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import UserAvatar from './UserAvatar';
import { useUserProfile } from '../hooks/useUserProfile';

interface AppHeaderProps {
  onMenuClick: () => void;
}

export default function AppHeader({ onMenuClick }: AppHeaderProps) {
  const [imageError, setImageError] = useState(false);
  const { profile: getProfile, isLoading } = useUserProfile();
  const [profileData, setProfileData] = useState<{ name: string; image?: string }>({ name: 'Guest' });

  useEffect(() => {
    getProfile().then(setProfileData);
  }, [getProfile]);

  return (
    <header className="bg-card border-b border-border px-4 py-3 flex items-center gap-3 shrink-0">
      <Button variant="ghost" size="icon" onClick={onMenuClick} aria-label="Open menu">
        <Menu className="w-5 h-5" />
      </Button>
      <div className="flex-1 flex items-center justify-center">
        {!imageError ? (
          <img 
            src="/assets/generated/gtu-app-icon.dim_512x512.png" 
            alt="Global Tales Universe" 
            className="h-8 w-auto object-contain"
            onError={() => {
              console.warn('Failed to load header icon');
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
          name={profileData.name}
          size="small"
          isLoading={isLoading}
        />
      </div>
    </header>
  );
}
