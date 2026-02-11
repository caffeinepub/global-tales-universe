import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Home, Layers, Search, Heart, User } from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';
import { t } from '../lib/i18n';

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

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around items-center h-16 max-w-2xl mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentPath === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate({ to: tab.path })}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
