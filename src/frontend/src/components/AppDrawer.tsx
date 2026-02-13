import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useAppUser } from '../hooks/useAppUser';
import { Home, Search, Heart, User, Crown, BookOpen, HelpCircle, Info } from 'lucide-react';
import PremiumBadge from './PremiumBadge';
import { Button } from './ui/button';
import { iconSizes, cardRadius, cardPadding, cardElevation, focusRing, transitions } from '../lib/uiPolish';
import { logOnce } from '../lib/logOnce';

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AppDrawer({ isOpen, onClose }: AppDrawerProps) {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const currentSearch = routerState.location.search;
  const { isPremium, isAuthenticated } = useAppUser();

  const handleNavigate = (path: string) => {
    try {
      navigate({ to: path as any });
      onClose();
    } catch (error) {
      const logKey = `drawer-nav-${path}-${currentPath}`;
      logOnce(
        logKey,
        `AppDrawer navigation failed: attempted="${path}" current="${currentPath}${currentSearch}" error="${error}"`,
        'error'
      );
      // Fallback to home if navigation fails
      try {
        navigate({ to: '/' });
      } catch (fallbackError) {
        console.error('Fallback navigation also failed:', fallbackError);
      }
      onClose();
    }
  };

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: BookOpen, label: 'Categories', path: '/categories' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Heart, label: 'Favorites', path: '/favorites' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const secondaryItems = [
    { icon: HelpCircle, label: 'Help & Support', path: '/help-and-support' },
    { icon: Info, label: 'About Us', path: '/about-us' },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={(open) => {
      // Only close when the sheet is being dismissed (open becomes false)
      if (!open) {
        onClose();
      }
    }}>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {/* Main Navigation */}
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors text-left ${focusRing}`}
              >
                <item.icon className={iconSizes.md} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Premium CTA */}
          {!isPremium && (
            <div className={`${cardPadding} ${cardRadius} ${cardElevation} bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800`}>
              <div className="flex items-center gap-2 mb-2">
                <Crown className={`${iconSizes.md} text-yellow-600 dark:text-yellow-500`} />
                <h3 className="font-bold">Go Premium</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Unlock exclusive features
              </p>
              <Button
                size="sm"
                onClick={() => handleNavigate('/premium')}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              >
                Upgrade Now
              </Button>
            </div>
          )}

          {/* Secondary Navigation */}
          <nav className="space-y-1 pt-4 border-t border-border">
            {secondaryItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors text-left text-sm ${focusRing}`}
              >
                <item.icon className={iconSizes.sm} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
