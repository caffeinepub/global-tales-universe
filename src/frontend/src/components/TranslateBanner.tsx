import { useState } from 'react';
import { Button } from './ui/button';
import { Languages } from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';
import { t } from '../lib/i18n';

interface TranslateBannerProps {
  onTranslate: () => void;
}

export default function TranslateBanner({ onTranslate }: TranslateBannerProps) {
  const { language } = usePreferences();
  const [translated, setTranslated] = useState(false);

  const handleTranslate = () => {
    onTranslate();
    setTranslated(true);
  };

  if (translated) {
    return (
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          ℹ️ This is a placeholder translation. Full translation support coming soon.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-muted border border-border rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Languages className="w-5 h-5 text-muted-foreground" />
          <p className="text-sm">Story not available in selected language</p>
        </div>
        <Button size="sm" onClick={handleTranslate}>
          {t('translate', language)}
        </Button>
      </div>
    </div>
  );
}
