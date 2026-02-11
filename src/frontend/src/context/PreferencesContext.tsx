import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAppUser } from '../hooks/useAppUser';

export type UILanguage = 'en' | 'ta' | 'hi' | 'te' | 'ml' | 'kn' | 'bn' | 'gu' | 'pa' | 'mr' | 'or' | 'ur' | 'es' | 'fr' | 'ar';
export type AgeMode = 'adults' | 'kids';
export type FontSize = 'small' | 'medium' | 'large';
export type ReadingBackground = 'white' | 'sepia' | 'darkGrey' | 'black';

interface PreferencesContextType {
  language: UILanguage;
  setLanguage: (lang: UILanguage) => void;
  mode: AgeMode;
  setMode: (mode: AgeMode) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  readingBackground: ReadingBackground;
  setReadingBackground: (bg: ReadingBackground) => void;
  autoScroll: boolean;
  setAutoScroll: (enabled: boolean) => void;
  preferredCategories: string[];
  setPreferredCategories: (categories: string[]) => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { userState, updateUserState } = useAppUser();
  const [language, setLanguageState] = useState<UILanguage>('en');
  const [mode, setModeState] = useState<AgeMode>('adults');
  const [fontSize, setFontSizeState] = useState<FontSize>('medium');
  const [readingBackground, setReadingBackgroundState] = useState<ReadingBackground>('white');
  const [autoScroll, setAutoScrollState] = useState(false);
  const [preferredCategories, setPreferredCategoriesState] = useState<string[]>([]);

  // Auto-detect browser language on first load
  useEffect(() => {
    const browserLang = navigator.language.toLowerCase();
    const langMap: Record<string, UILanguage> = {
      'en': 'en', 'ta': 'ta', 'hi': 'hi', 'te': 'te', 'ml': 'ml',
      'kn': 'kn', 'bn': 'bn', 'gu': 'gu', 'pa': 'pa', 'mr': 'mr',
      'or': 'or', 'ur': 'ur', 'es': 'es', 'fr': 'fr', 'ar': 'ar',
    };
    const detectedLang = langMap[browserLang.split('-')[0]] || 'en';
    
    // Type guard to check if userState has preferences
    const hasPreferences = (state: any): state is { preferences: any } => {
      return state && 'preferences' in state;
    };

    if (hasPreferences(userState) && userState.preferences?.language) {
      setLanguageState(userState.preferences.language as UILanguage);
    } else {
      setLanguageState(detectedLang);
    }

    if (hasPreferences(userState) && userState.preferences?.mode) {
      setModeState(userState.preferences.mode as AgeMode);
    }
    if (hasPreferences(userState) && userState.preferences?.fontSize) {
      setFontSizeState(userState.preferences.fontSize as FontSize);
    }
    if (hasPreferences(userState) && userState.preferences?.readingBackground) {
      setReadingBackgroundState(userState.preferences.readingBackground as ReadingBackground);
    }
    if (hasPreferences(userState) && userState.preferences?.autoScroll !== undefined) {
      setAutoScrollState(userState.preferences.autoScroll);
    }
    if (hasPreferences(userState) && userState.preferences?.preferredCategories) {
      setPreferredCategoriesState(userState.preferences.preferredCategories);
    }
  }, [userState]);

  const setLanguage = (lang: UILanguage) => {
    setLanguageState(lang);
    const hasPreferences = (state: any): state is { preferences: any } => {
      return state && 'preferences' in state;
    };
    const currentPrefs = hasPreferences(userState) ? userState.preferences : {};
    updateUserState({ preferences: { ...currentPrefs, language: lang } } as any);
  };

  const setMode = (newMode: AgeMode) => {
    setModeState(newMode);
    const hasPreferences = (state: any): state is { preferences: any } => {
      return state && 'preferences' in state;
    };
    const currentPrefs = hasPreferences(userState) ? userState.preferences : {};
    updateUserState({ preferences: { ...currentPrefs, mode: newMode } } as any);
  };

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
    const hasPreferences = (state: any): state is { preferences: any } => {
      return state && 'preferences' in state;
    };
    const currentPrefs = hasPreferences(userState) ? userState.preferences : {};
    updateUserState({ preferences: { ...currentPrefs, fontSize: size } } as any);
  };

  const setReadingBackground = (bg: ReadingBackground) => {
    setReadingBackgroundState(bg);
    const hasPreferences = (state: any): state is { preferences: any } => {
      return state && 'preferences' in state;
    };
    const currentPrefs = hasPreferences(userState) ? userState.preferences : {};
    updateUserState({ preferences: { ...currentPrefs, readingBackground: bg } } as any);
  };

  const setAutoScroll = (enabled: boolean) => {
    setAutoScrollState(enabled);
    const hasPreferences = (state: any): state is { preferences: any } => {
      return state && 'preferences' in state;
    };
    const currentPrefs = hasPreferences(userState) ? userState.preferences : {};
    updateUserState({ preferences: { ...currentPrefs, autoScroll: enabled } } as any);
  };

  const setPreferredCategories = (categories: string[]) => {
    setPreferredCategoriesState(categories);
    const hasPreferences = (state: any): state is { preferences: any } => {
      return state && 'preferences' in state;
    };
    const currentPrefs = hasPreferences(userState) ? userState.preferences : {};
    updateUserState({ preferences: { ...currentPrefs, preferredCategories: categories } } as any);
  };

  return (
    <PreferencesContext.Provider
      value={{
        language,
        setLanguage,
        mode,
        setMode,
        fontSize,
        setFontSize,
        readingBackground,
        setReadingBackground,
        autoScroll,
        setAutoScroll,
        preferredCategories,
        setPreferredCategories,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within PreferencesProvider');
  }
  return context;
}
