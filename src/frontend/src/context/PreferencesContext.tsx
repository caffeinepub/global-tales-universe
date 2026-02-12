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

const STORAGE_KEY = 'gtu_preferences';

interface StoredPreferences {
  language?: UILanguage;
  mode?: AgeMode;
  fontSize?: FontSize;
  readingBackground?: ReadingBackground;
  autoScroll?: boolean;
  preferredCategories?: string[];
}

function loadStoredPreferences(): StoredPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveStoredPreferences(prefs: StoredPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.warn('Failed to save preferences', e);
  }
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { userState, updateUserState } = useAppUser();
  
  // Initialize from localStorage first
  const stored = loadStoredPreferences();
  
  const [language, setLanguageState] = useState<UILanguage>(() => {
    return stored.language || 'en';
  });
  const [mode, setModeState] = useState<AgeMode>(() => {
    return stored.mode || 'adults';
  });
  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    return stored.fontSize || 'medium';
  });
  const [readingBackground, setReadingBackgroundState] = useState<ReadingBackground>(() => {
    return stored.readingBackground || 'white';
  });
  const [autoScroll, setAutoScrollState] = useState(() => {
    return stored.autoScroll ?? false;
  });
  const [preferredCategories, setPreferredCategoriesState] = useState<string[]>(() => {
    return stored.preferredCategories || [];
  });

  // Auto-detect browser language on first load if not set
  useEffect(() => {
    if (!stored.language) {
      const browserLang = navigator.language.toLowerCase();
      const langMap: Record<string, UILanguage> = {
        'en': 'en', 'ta': 'ta', 'hi': 'hi', 'te': 'te', 'ml': 'ml',
        'kn': 'kn', 'bn': 'bn', 'gu': 'gu', 'pa': 'pa', 'mr': 'mr',
        'or': 'or', 'ur': 'ur', 'es': 'es', 'fr': 'fr', 'ar': 'ar',
      };
      const detectedLang = langMap[browserLang.split('-')[0]] || 'en';
      setLanguageState(detectedLang);
      saveStoredPreferences({ ...stored, language: detectedLang });
    }
  }, []);

  const setLanguage = (lang: UILanguage) => {
    setLanguageState(lang);
    const newPrefs = { ...loadStoredPreferences(), language: lang };
    saveStoredPreferences(newPrefs);
    
    const hasPreferences = (state: any): state is { preferences: any } => {
      return state && 'preferences' in state;
    };
    const currentPrefs = hasPreferences(userState) ? userState.preferences : {};
    updateUserState({ preferences: { ...currentPrefs, language: lang } } as any);
  };

  const setMode = (newMode: AgeMode) => {
    setModeState(newMode);
    const newPrefs = { ...loadStoredPreferences(), mode: newMode };
    saveStoredPreferences(newPrefs);
    
    const hasPreferences = (state: any): state is { preferences: any } => {
      return state && 'preferences' in state;
    };
    const currentPrefs = hasPreferences(userState) ? userState.preferences : {};
    updateUserState({ preferences: { ...currentPrefs, mode: newMode } } as any);
  };

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
    const newPrefs = { ...loadStoredPreferences(), fontSize: size };
    saveStoredPreferences(newPrefs);
    
    const hasPreferences = (state: any): state is { preferences: any } => {
      return state && 'preferences' in state;
    };
    const currentPrefs = hasPreferences(userState) ? userState.preferences : {};
    updateUserState({ preferences: { ...currentPrefs, fontSize: size } } as any);
  };

  const setReadingBackground = (bg: ReadingBackground) => {
    setReadingBackgroundState(bg);
    const newPrefs = { ...loadStoredPreferences(), readingBackground: bg };
    saveStoredPreferences(newPrefs);
    
    const hasPreferences = (state: any): state is { preferences: any } => {
      return state && 'preferences' in state;
    };
    const currentPrefs = hasPreferences(userState) ? userState.preferences : {};
    updateUserState({ preferences: { ...currentPrefs, readingBackground: bg } } as any);
  };

  const setAutoScroll = (enabled: boolean) => {
    setAutoScrollState(enabled);
    const newPrefs = { ...loadStoredPreferences(), autoScroll: enabled };
    saveStoredPreferences(newPrefs);
    
    const hasPreferences = (state: any): state is { preferences: any } => {
      return state && 'preferences' in state;
    };
    const currentPrefs = hasPreferences(userState) ? userState.preferences : {};
    updateUserState({ preferences: { ...currentPrefs, autoScroll: enabled } } as any);
  };

  const setPreferredCategories = (categories: string[]) => {
    setPreferredCategoriesState(categories);
    const newPrefs = { ...loadStoredPreferences(), preferredCategories: categories };
    saveStoredPreferences(newPrefs);
    
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
