import { usePreferences } from '../context/PreferencesContext';
import { useDailyFeaturedStory, useStories } from '../hooks/useStories';
import { uiLangToBackendLang } from '../lib/storyLanguage';
import { t } from '../lib/i18n';
import LanguageSelector from '../components/LanguageSelector';
import ModeToggle from '../components/ModeToggle';
import StoryCard from '../components/StoryCard';
import CategoryScroller from '../components/CategoryScroller';
import ContinueReadingCard from '../components/ContinueReadingCard';
import AdPlaceholder from '../components/AdPlaceholder';
import { useAppUser } from '../hooks/useAppUser';

export default function HomeTab() {
  const { language, mode } = usePreferences();
  const { userState } = useAppUser();
  const backendLang = uiLangToBackendLang(language);
  const { data: featuredStory, isLoading: featuredLoading } = useDailyFeaturedStory(backendLang);
  const { data: stories, isLoading: storiesLoading } = useStories(
    backendLang,
    true,
    undefined,
    mode === 'kids' ? true : undefined
  );

  // Type guard to check if userState has isPremium
  const isPremium = userState && 'isPremium' in userState ? userState.isPremium : false;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Global Tales</h1>
        <LanguageSelector />
      </div>

      <ModeToggle />

      {featuredLoading ? (
        <div className="h-64 bg-muted animate-pulse rounded-2xl" />
      ) : featuredStory ? (
        <>
          <div>
            <h2 className="text-lg font-semibold mb-3">{t('featuredStory', language)}</h2>
            <StoryCard story={featuredStory} featured />
          </div>
        </>
      ) : null}

      <div>
        <h2 className="text-lg font-semibold mb-3">{t('categories', language)}</h2>
        <CategoryScroller />
      </div>

      <ContinueReadingCard />

      {!isPremium && <AdPlaceholder type="banner" />}

      <div>
        <h2 className="text-lg font-semibold mb-3">{t('latestStories', language)}</h2>
        {storiesLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {stories?.slice(0, 10).map((story, idx) => (
              <div key={story.id.toString()}>
                <StoryCard story={story} />
                {!isPremium && idx === 4 && <AdPlaceholder type="inline" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
