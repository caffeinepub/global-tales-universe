import { usePreferences } from '../context/PreferencesContext';
import { Button } from './ui/button';
import { Users, Baby } from 'lucide-react';

export default function ModeToggle() {
  const { mode, setMode } = usePreferences();

  return (
    <div className="flex items-center gap-0.5 p-0.5 bg-muted rounded-lg">
      <Button
        variant={mode === 'adults' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setMode('adults')}
        className="h-7 px-1.5 sm:px-3 gap-0.5 sm:gap-1.5"
      >
        <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        <span className="text-[10px] sm:text-xs">Adults</span>
      </Button>
      <Button
        variant={mode === 'kids' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setMode('kids')}
        className="h-7 px-1.5 sm:px-3 gap-0.5 sm:gap-1.5"
      >
        <Baby className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        <span className="text-[10px] sm:text-xs">Kids</span>
      </Button>
    </div>
  );
}
