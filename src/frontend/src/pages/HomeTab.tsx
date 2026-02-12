import { useQuery } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { usePreferences } from '../context/PreferencesContext';
import { useAppUser } from '../hooks/useAppUser';
import { Story, Language } from '../backend';
import StoryCard from '../components/StoryCard';
import CategoryScroller from '../components/CategoryScroller';
import ContinueReadingCard from '../components/ContinueReadingCard';
import AdPlaceholder from '../components/AdPlaceholder';
import DailyStoryNotificationBanner from '../components/DailyStoryNotificationBanner';
import PageLayout from '../components/PageLayout';
import { t } from '../lib/i18n';
import { canShowNotifications } from '../lib/notifications';
import { pageLayout } from '../lib/uiPolish';
import { isPreviewMode } from '../lib/urlParams';

export default function HomeTab() {
  const { actor, isFetching: actorFetching } = useActor();
  const { language, mode } = usePreferences();
  const { isPremium, dailyNotificationsEnabled } = useAppUser();

  const { data: featuredStory, isLoading: featuredLoading, isError: featuredError } = useQuery<Story | null>({
    queryKey: ['featuredStory', language],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getDailyFeaturedStoryByLanguage(language as Language);
      } catch (error) {
        console.error('Failed to fetch featured story:', error);
        return null;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  const { data: latestStories = [], isLoading: storiesLoading, isError: storiesError } = useQuery<Story[]>({
    queryKey: ['latestStories', language, mode],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getFilteredSortedStories(
          language as Language,
          true,
          null,
          mode === 'kids' ? true : null
        );
      } catch (error) {
        console.error('Failed to fetch latest stories:', error);
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  // Show notification banner if user wants notifications but can't receive them
  const showNotificationBanner = dailyNotificationsEnabled && !canShowNotifications();
  
  // Check if we should show ads
  const showAds = !isPremium && !isPreviewMode();

  return (
    <>
      {/* Daily Story Notification Banner */}
      {showNotificationBanner && <DailyStoryNotificationBanner show={true} />}

      <PageLayout>
        {/* Ad Banner - only for non-premium users and not in preview mode */}
        {showAds && <AdPlaceholder variant="banner" />}

        {/* Featured Story */}
        {featuredLoading ? (
          <div>
            <h2 className={`${pageLayout.subtitleSize} ${pageLayout.subtitleWeight} ${pageLayout.subtitleMargin}`}>
              {t('featuredStory', language)}
            </h2>
            <div className="aspect-[16/9] bg-muted animate-pulse rounded-lg" />
          </div>
        ) : featuredError ? (
          <div>
            <h2 className={`${pageLayout.subtitleSize} ${pageLayout.subtitleWeight} ${pageLayout.subtitleMargin}`}>
              {t('featuredStory', language)}
            </h2>
            <div className="text-center py-8 text-muted-foreground">
              Failed to load featured story
            </div>
          </div>
        ) : featuredStory ? (
          <div>
            <h2 className={`${pageLayout.subtitleSize} ${pageLayout.subtitleWeight} ${pageLayout.subtitleMargin}`}>
              {t('featuredStory', language)}
            </h2>
            <StoryCard story={featuredStory} featured />
          </div>
        ) : null}

        {/* Categories */}
        <div>
          <h2 className={`${pageLayout.subtitleSize} ${pageLayout.subtitleWeight} ${pageLayout.subtitleMargin}`}>
            {t('categories', language)}
          </h2>
          <CategoryScroller />
        </div>

        {/* Continue Reading */}
        <div>
          <ContinueReadingCard />
        </div>

        {/* Inline Ad - only for non-premium users and not in preview mode */}
        {showAds && <AdPlaceholder variant="inline" />}

        {/* Latest Stories */}
        <div>
          <h2 className={`${pageLayout.subtitleSize} ${pageLayout.subtitleWeight} ${pageLayout.subtitleMargin}`}>
            {t('latestStories', language)}
          </h2>
          {storiesLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : storiesError ? (
            <div className="text-center py-8 text-muted-foreground">
              Failed to load stories
            </div>
          ) : latestStories.length > 0 ? (
            <div className="space-y-4">
              {latestStories.slice(0, 10).map((story) => (
                <StoryCard key={Number(story.id)} story={story} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No stories available
            </div>
          )}
        </div>
      </PageLayout>
    </>
  );
}
