import { Menu } from 'lucide-react';
import { Button } from './ui/button';

interface AppHeaderProps {
  onMenuClick: () => void;
}

export default function AppHeader({ onMenuClick }: AppHeaderProps) {
  return (
    <header className="bg-card border-b border-border px-4 py-3 flex items-center gap-3 shrink-0">
      <Button variant="ghost" size="icon" onClick={onMenuClick} aria-label="Open menu">
        <Menu className="w-5 h-5" />
      </Button>
      <div className="flex-1 flex items-center justify-center">
        <img 
          src="/assets/generated/gtu-logo.dim_512x512.png" 
          alt="Global Tales Universe" 
          className="h-8 w-auto object-contain"
        />
      </div>
      {/* Spacer to center logo */}
      <div className="w-10" />
    </header>
  );
}
