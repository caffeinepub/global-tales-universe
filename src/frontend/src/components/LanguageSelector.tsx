import { usePreferences, UILanguage } from '../context/PreferencesContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Globe } from 'lucide-react';

const LANGUAGES: { value: UILanguage; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'ta', label: 'தமிழ்' },
  { value: 'hi', label: 'हिन्दी' },
  { value: 'te', label: 'తెలుగు' },
  { value: 'ml', label: 'മലയാളം' },
  { value: 'kn', label: 'ಕನ್ನಡ' },
  { value: 'bn', label: 'বাংলা' },
  { value: 'gu', label: 'ગુજરાતી' },
  { value: 'pa', label: 'ਪੰਜਾਬੀ' },
  { value: 'mr', label: 'मराठी' },
];

export default function LanguageSelector() {
  const { language, setLanguage } = usePreferences();

  return (
    <Select value={language} onValueChange={(value) => setLanguage(value as UILanguage)}>
      <SelectTrigger className="w-[140px] h-9">
        <Globe className="h-4 w-4 mr-2" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((lang) => (
          <SelectItem key={lang.value} value={lang.value}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
