import { usePreferences } from '../context/PreferencesContext';
import { Button } from './ui/button';
import { Users, Baby } from 'lucide-react';

export default function ModeToggle() {
  const { mode, setMode } = usePreferences();

  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
      <Button
        variant={mode === 'adults' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setMode('adults')}
        className="h-7 px-3 gap-1.5"
      >
        <Users className="h-3.5 w-3.5" />
        <span className="text-xs">Adults</span>
      </Button>
      <Button
        variant={mode === 'kids' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setMode('kids')}
        className="h-7 px-3 gap-1.5"
      >
        <Baby className="h-3.5 w-3.5" />
        <span className="text-xs">Kids</span>
      </Button>
    </div>
  );
}
