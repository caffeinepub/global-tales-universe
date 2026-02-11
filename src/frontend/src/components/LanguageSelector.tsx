import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { usePreferences } from '../context/PreferencesContext';
import { SUPPORTED_LANGUAGES } from '../lib/i18n';
import { Globe } from 'lucide-react';

export default function LanguageSelector() {
  const { language, setLanguage } = usePreferences();

  return (
    <Select value={language} onValueChange={(val) => setLanguage(val as any)}>
      <SelectTrigger className="w-[180px]">
        <Globe className="w-4 h-4 mr-2" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.nativeName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
