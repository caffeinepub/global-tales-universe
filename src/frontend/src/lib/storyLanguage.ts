import { Language } from '../backend';
import { UILanguage } from '../context/PreferencesContext';

export function uiLangToBackendLang(uiLang: UILanguage): Language {
  const map: Record<UILanguage, Language> = {
    en: Language.english,
    ta: Language.tamil,
    hi: Language.hindi,
    te: Language.english,
    ml: Language.english,
    kn: Language.english,
    bn: Language.english,
    gu: Language.english,
    pa: Language.english,
    mr: Language.english,
    or: Language.english,
    ur: Language.english,
    es: Language.english,
    fr: Language.english,
    ar: Language.english,
  };
  return map[uiLang] || Language.english;
}

export function getStoryContent(story: any, uiLang: UILanguage) {
  const backendLang = uiLangToBackendLang(uiLang);
  
  if (backendLang === Language.english) {
    return story.languages.english;
  } else if (backendLang === Language.tamil) {
    return story.languages.tamil;
  } else if (backendLang === Language.hindi) {
    return story.languages.hindi;
  }
  
  return story.languages.english;
}

export function hasTranslation(story: any, uiLang: UILanguage): boolean {
  const backendLang = uiLangToBackendLang(uiLang);
  return backendLang === Language.english || backendLang === Language.tamil || backendLang === Language.hindi;
}
