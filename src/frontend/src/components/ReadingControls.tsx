import { usePreferences } from '../context/PreferencesContext';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Settings, Type } from 'lucide-react';
import { t } from '../lib/i18n';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

export default function ReadingControls() {
  const { fontSize, setFontSize, readingBackground, setReadingBackground, autoScroll, setAutoScroll, language } = usePreferences();

  const fontSizes = [
    { value: 'small', label: 'S' },
    { value: 'medium', label: 'M' },
    { value: 'large', label: 'L' },
  ];

  const backgrounds = [
    { value: 'white', label: 'White', class: 'bg-white' },
    { value: 'sepia', label: 'Sepia', class: 'bg-[#f4ecd8]' },
    { value: 'darkGrey', label: 'Dark', class: 'bg-gray-800' },
    { value: 'black', label: 'Black', class: 'bg-black' },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 flex items-center gap-2">
              <Type className="w-4 h-4" />
              {t('fontSize', language)}
            </Label>
            <div className="flex gap-2 mt-2">
              {fontSizes.map((size) => (
                <Button
                  key={size.value}
                  variant={fontSize === size.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFontSize(size.value as any)}
                  className="flex-1"
                >
                  {size.label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2">{t('background', language)}</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {backgrounds.map((bg) => (
                <button
                  key={bg.value}
                  onClick={() => setReadingBackground(bg.value as any)}
                  className={`h-10 rounded-md border-2 ${
                    readingBackground === bg.value ? 'border-primary' : 'border-border'
                  } ${bg.class}`}
                  title={bg.label}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="auto-scroll" className="text-sm font-medium">
              {t('autoScroll', language)}
            </Label>
            <Switch
              id="auto-scroll"
              checked={autoScroll}
              onCheckedChange={setAutoScroll}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
