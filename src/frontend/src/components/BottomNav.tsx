import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Home, Compass, Search, Heart, User } from 'lucide-react';
import { logOnce } from '../lib/logOnce';
import { recordNavFailure } from '../lib/navFailures';
import { getFullPath } from '../lib/routerSearch';

export default function BottomNav() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const currentSearch = routerState.location.search;
  const fullPath = getFullPath(currentPath, currentSearch);

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Compass, label: 'Categories', path: '/categories' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Heart, label: 'Favorites', path: '/favorites' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const handleNavigation = (path: string) => {
    try {
      navigate({ to: path as any });
    } catch (error) {
      const logKey = `bottom-nav-${path}-${currentPath}`;
      logOnce(
        logKey,
        `BottomNav navigation failed: attempted="${path}" current="${fullPath}" error="${error}"`,
        'error'
      );
      recordNavFailure(path, fullPath, String(error));
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 pb-safe">
      <div className="flex justify-around items-center h-16 sm:h-20 px-2 sm:px-4 max-w-screen-xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-0 ${
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              aria-label={item.label}
            >
              <Icon className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
              <span className="text-[10px] sm:text-xs font-medium truncate max-w-full">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
