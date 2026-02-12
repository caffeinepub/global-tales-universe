import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { useNavigate } from '@tanstack/react-router';
import { useAppUser } from '../hooks/useAppUser';
import { Home, Search, Heart, User, Crown, BookOpen, HelpCircle, Info, PenSquare } from 'lucide-react';
import PremiumBadge from './PremiumBadge';
import { Button } from './ui/button';
import { iconSizes, cardRadius, cardPadding, cardElevation, focusRing, transitions } from '../lib/uiPolish';

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AppDrawer({ isOpen, onClose }: AppDrawerProps) {
  const navigate = useNavigate();
  const { isPremium, isAuthenticated } = useAppUser();

  const handleNavigate = (path: string) => {
    try {
      navigate({ to: path as any });
      onClose();
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to home if navigation fails
      navigate({ to: '/' });
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
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent ${transitions.colors} ${focusRing} text-left`}
              >
                <item.icon className={iconSizes.md} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Create Story (Authenticated Only) */}
          {isAuthenticated && (
            <>
              <div className="h-px bg-border" />
              <button
                onClick={() => handleNavigate('/story/editor/new')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent ${transitions.colors} ${focusRing} text-left`}
              >
                <PenSquare className={iconSizes.md} />
                <span className="font-medium">Create Story</span>
              </button>
            </>
          )}

          {/* Premium Upsell */}
          {!isPremium && (
            <>
              <div className="h-px bg-border" />
              <div className={`${cardRadius.medium} ${cardPadding.default} bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 ${cardElevation.low}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Crown className={`${iconSizes.md} text-yellow-600 dark:text-yellow-500`} />
                  <PremiumBadge variant="compact" />
                </div>
                <p className="text-sm mb-3">
                  Unlock ad-free reading and exclusive premium stories.
                </p>
                <Button
                  onClick={() => handleNavigate('/premium')}
                  size="sm"
                  className={`w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 ${focusRing}`}
                >
                  Go Premium
                </Button>
              </div>
            </>
          )}

          {/* Secondary Navigation */}
          <div className="h-px bg-border" />
          <nav className="space-y-1">
            {secondaryItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent ${transitions.colors} ${focusRing} text-left`}
              >
                <item.icon className={iconSizes.md} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
