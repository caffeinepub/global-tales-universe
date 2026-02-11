import { UILanguage } from '../context/PreferencesContext';

export function getFontClass(language: UILanguage): string {
  const fontMap: Record<UILanguage, string> = {
    en: 'font-latin',
    ta: 'font-tamil',
    hi: 'font-devanagari',
    te: 'font-telugu',
    ml: 'font-malayalam',
    kn: 'font-kannada',
    bn: 'font-bengali',
    gu: 'font-gujarati',
    pa: 'font-gurmukhi',
    mr: 'font-devanagari',
    or: 'font-odia',
    ur: 'font-arabic',
    es: 'font-latin',
    fr: 'font-latin',
    ar: 'font-arabic',
  };
  
  return fontMap[language] || 'font-latin';
}
