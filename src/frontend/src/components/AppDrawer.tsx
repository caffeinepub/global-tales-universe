import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { useNavigate } from '@tanstack/react-router';
import { useAppUser } from '../hooks/useAppUser';
import PremiumBadge from './PremiumBadge';
import { Home, BookOpen, Heart, User, HelpCircle, FileText, Shield, Info, Crown } from 'lucide-react';
import { Separator } from './ui/separator';
import { iconSizes, rowSpacing } from '../lib/uiPolish';

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AppDrawer({ isOpen, onClose }: AppDrawerProps) {
  const navigate = useNavigate();
  const { isPremium } = useAppUser();

  const handleNavigation = (path: string) => {
    navigate({ to: path });
    onClose();
  };

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: BookOpen, label: 'Categories', path: '/categories' },
    { icon: Heart, label: 'Favorites', path: '/favorites' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const supportItems = [
    { icon: HelpCircle, label: 'Help & Support', path: '/help' },
    { icon: FileText, label: 'Terms & Conditions', path: '/terms' },
    { icon: Shield, label: 'Privacy Policy', path: '/privacy' },
    { icon: Info, label: 'About Us', path: '/about' },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Premium Status / Upsell */}
          {isPremium ? (
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <Crown className={`${iconSizes.md} text-yellow-600 dark:text-yellow-400 shrink-0`} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-yellow-900 dark:text-yellow-100">Premium Active</p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300">Enjoying ad-free stories</p>
              </div>
            </div>
          ) : (
            <button
              onClick={() => handleNavigation('/premium')}
              className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800 hover:shadow-md transition-shadow"
            >
              <Crown className={`${iconSizes.md} text-yellow-600 dark:text-yellow-400 shrink-0`} />
              <div className="flex-1 text-left min-w-0">
                <p className="font-medium text-sm text-yellow-900 dark:text-yellow-100">Go Premium</p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300">Unlock all stories</p>
              </div>
            </button>
          )}

          <Separator />

          {/* Main Navigation */}
          <nav className={rowSpacing.tight}>
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleNavigation(item.path)}
              >
                <item.icon className={`${iconSizes.md} mr-3`} />
                {item.label}
              </Button>
            ))}
          </nav>

          <Separator />

          {/* Support Links */}
          <nav className={rowSpacing.tight}>
            {supportItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className="w-full justify-start text-muted-foreground"
                onClick={() => handleNavigation(item.path)}
              >
                <item.icon className={`${iconSizes.md} mr-3`} />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
