import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Home, Layers, Search, Heart, User } from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';
import { t } from '../lib/i18n';
import { iconSizes, focusRing, transitions } from '../lib/uiPolish';

export default function BottomNav() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { language } = usePreferences();
  const currentPath = routerState.location.pathname;

  const tabs = [
    { path: '/', icon: Home, label: t('home', language) },
    { path: '/categories', icon: Layers, label: t('categories', language) },
    { path: '/search', icon: Search, label: t('search', language) },
    { path: '/favorites', icon: Heart, label: t('favorites', language) },
    { path: '/profile', icon: User, label: t('profile', language) },
  ];

  const handleNavigation = (path: string) => {
    try {
      navigate({ to: path as any });
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to home if navigation fails
      try {
        navigate({ to: '/' });
      } catch (fallbackError) {
        console.error('Fallback navigation also failed:', fallbackError);
      }
    }
  };

  // Check if current path starts with a tab path (for nested routes like /categories/Romance)
  const isTabActive = (tabPath: string) => {
    if (tabPath === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(tabPath);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 shadow-lg">
      <div className="flex justify-around items-center h-16 max-w-2xl mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = isTabActive(tab.path);
          return (
            <button
              key={tab.path}
              onClick={() => handleNavigation(tab.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full ${transitions.colors} ${focusRing} ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={`${iconSizes.md} mb-1`} />
              <span className={`text-xs ${isActive ? 'font-semibold' : 'font-normal'}`}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
