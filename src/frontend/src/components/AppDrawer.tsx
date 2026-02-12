import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { useNavigate } from '@tanstack/react-router';
import { useUserProfile } from '../hooks/useUserProfile';
import { useAppUser } from '../hooks/useAppUser';
import UserAvatar from './UserAvatar';
import PremiumBadge from './PremiumBadge';
import { Button } from './ui/button';
import { Home, BookOpen, User, Heart, HelpCircle, FileText, Shield, Info, Crown } from 'lucide-react';
import { Separator } from './ui/separator';

interface AppDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AppDrawer({ open, onOpenChange }: AppDrawerProps) {
  const navigate = useNavigate();
  const { profile: getProfile } = useUserProfile();
  const { isPremium } = useAppUser();
  const [profile, setProfile] = useState<{ name: string; image?: string }>({ name: 'Guest' });

  useEffect(() => {
    if (open) {
      getProfile().then(setProfile);
    }
  }, [open, getProfile]);

  const handleNavigate = (path: string) => {
    navigate({ to: path as any });
    onOpenChange(false);
  };

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: BookOpen, label: 'Categories', path: '/categories' },
    { icon: Heart, label: 'Favorites', path: '/favorites' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const footerItems = [
    { icon: HelpCircle, label: 'Help & Support', path: '/help' },
    { icon: FileText, label: 'Terms & Conditions', path: '/terms' },
    { icon: Shield, label: 'Privacy Policy', path: '/privacy' },
    { icon: Info, label: 'About Us', path: '/about' },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-80 flex flex-col">
        <SheetHeader>
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        </SheetHeader>

        {/* User Profile Header */}
        <div className="flex items-center gap-3 py-4">
          <div className="relative">
            <UserAvatar imageUrl={profile.image} name={profile.name} size="medium" />
            {isPremium && (
              <div className="absolute -bottom-1 -right-1">
                <PremiumBadge variant="icon-only" className="w-6 h-6 border" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold truncate">{profile.name}</p>
              {isPremium && <PremiumBadge variant="compact" className="shrink-0" />}
            </div>
            {isPremium && (
              <p className="text-xs text-muted-foreground">Premium Member</p>
            )}
          </div>
        </div>

        <Separator />

        {/* Main Menu */}
        <nav className="flex-1 py-4 space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleNavigate(item.path)}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Button>
          ))}

          {!isPremium && (
            <>
              <Separator className="my-2" />
              <Button
                variant="outline"
                className="w-full justify-start border-yellow-500/50 hover:bg-yellow-500/10"
                onClick={() => handleNavigate('/premium')}
              >
                <Crown className="w-5 h-5 mr-3 text-yellow-500" />
                <span className="text-yellow-600 dark:text-yellow-500 font-medium">Go Premium</span>
              </Button>
            </>
          )}
        </nav>

        <Separator />

        {/* Footer Links */}
        <div className="py-4 space-y-1">
          {footerItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground"
              onClick={() => handleNavigate(item.path)}
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.label}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
