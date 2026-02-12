import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Home, Search, Heart, User, BookOpen } from 'lucide-react';
import { iconSizes } from '../lib/uiPolish';
import { logOnce } from '../lib/logOnce';

export default function BottomNav() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const handleNavigate = (path: string) => {
    try {
      navigate({ to: path as any });
    } catch (error) {
      logOnce(`bottom-nav-${path}`, `Bottom nav error to ${path}: ${error}`, 'error');
      // Double fallback: try home, then do nothing
      try {
        navigate({ to: '/' });
      } catch (fallbackError) {
        console.error('Fallback navigation also failed:', fallbackError);
      }
    }
  };

  // Check if we're on a category detail page (nested under /categories)
  const isCategoryDetailPage = currentPath.startsWith('/categories/') && currentPath !== '/categories';

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: BookOpen, label: 'Categories', path: '/categories' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Heart, label: 'Favorites', path: '/favorites' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="bg-card border-t border-border px-2 py-2 flex items-center justify-around shrink-0">
      {navItems.map((item) => {
        // Highlight Categories tab when on category detail pages
        const isActive = item.path === '/categories' 
          ? (currentPath === '/categories' || isCategoryDetailPage)
          : currentPath === item.path;

        return (
          <button
            key={item.path}
            onClick={() => handleNavigate(item.path)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
              isActive
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
            aria-label={item.label}
          >
            <item.icon className={iconSizes.md} />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
