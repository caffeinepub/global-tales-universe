import { Sheet, SheetContent } from './ui/sheet';
import { useNavigate } from '@tanstack/react-router';
import { useUserProfile } from '../hooks/useUserProfile';
import { useAppUser } from '../hooks/useAppUser';
import UserAvatar from './UserAvatar';
import { Home, BookOpen, Search, Heart, User, Crown, FileText, HelpCircle, Info } from 'lucide-react';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { useEffect, useState } from 'react';

interface AppDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AppDrawer({ open, onOpenChange }: AppDrawerProps) {
  const navigate = useNavigate();
  const { profile: getProfile } = useUserProfile();
  const { isPremium } = useAppUser();
  const [currentProfile, setCurrentProfile] = useState<{ name: string; image?: string }>({ name: 'Guest' });

  useEffect(() => {
    getProfile().then(profile => {
      setCurrentProfile(profile);
    });
  }, [getProfile, open]);

  const handleNavigation = (path: string) => {
    navigate({ to: path });
    onOpenChange(false);
  };

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: BookOpen, label: 'Categories', path: '/categories' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Heart, label: 'Favorites', path: '/favorites' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Crown, label: 'Premium', path: '/premium' },
  ];

  const legalItems = [
    { icon: FileText, label: 'Privacy Policy', path: '/privacy-policy' },
    { icon: FileText, label: 'Terms and Conditions', path: '/terms-and-conditions' },
    { icon: HelpCircle, label: 'Help and Support', path: '/help-and-support' },
    { icon: Info, label: 'About Us', path: '/about-us' },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-80 p-0">
        <div className="flex flex-col h-full">
          {/* Profile Header */}
          <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <UserAvatar 
                  imageUrl={currentProfile.image} 
                  name={currentProfile.name}
                  size="medium"
                />
                {isPremium && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center border-2 border-background">
                    <Crown className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold truncate">{currentProfile.name}</p>
                  {isPremium && (
                    <Badge variant="secondary" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-xs px-1.5 py-0">
                      <Crown className="w-2.5 h-2.5 mr-0.5" />
                      Premium
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {isPremium ? 'Premium Member' : 'Free Account'}
                </p>
              </div>
            </div>
          </div>

          {/* Main Menu */}
          <div className="flex-1 overflow-auto py-4">
            <nav className="space-y-1 px-3">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-left"
                >
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            <Separator className="my-4" />

            {/* Legal & Support */}
            <div className="px-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                Legal & Support
              </p>
              <nav className="space-y-1">
                {legalItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-left text-sm"
                  >
                    <item.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t">
            <p className="text-xs text-center text-muted-foreground">
              © {new Date().getFullYear()} Global Tales Universe
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
