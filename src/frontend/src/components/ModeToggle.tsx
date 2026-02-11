import { usePreferences } from '../context/PreferencesContext';
import { t } from '../lib/i18n';
import { Button } from './ui/button';

export default function ModeToggle() {
  const { mode, setMode, language } = usePreferences();

  return (
    <div className="flex gap-2 bg-muted p-1 rounded-lg">
      <Button
        variant={mode === 'adults' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setMode('adults')}
        className="flex-1"
      >
        {t('adults', language)}
      </Button>
      <Button
        variant={mode === 'kids' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setMode('kids')}
        className="flex-1"
      >
        {t('kids', language)}
      </Button>
    </div>
  );
}
