import { usePreferences } from '../context/PreferencesContext';
import { useAppUser } from '../hooks/useAppUser';
import { useGetFeaturedStory, useGetAllStories } from '../hooks/useStories';
import { Language } from '../backend';
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
  const { language, mode } = usePreferences();
  const { isPremium, dailyNotificationsEnabled } = useAppUser();

  const { data: featuredStory, isLoading: featuredLoading } = useGetFeaturedStory();

  const { data: latestStories = [], isLoading: storiesLoading } = useGetAllStories();

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
        <div>
          <h2 className={`${pageLayout.subtitleSize} ${pageLayout.subtitleWeight} ${pageLayout.subtitleMargin}`}>
            {t('featuredStory', language)}
          </h2>
          {featuredLoading ? (
            <div className="aspect-[16/9] bg-muted animate-pulse rounded-lg" />
          ) : featuredStory ? (
            <StoryCard story={featuredStory} />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No featured story available at the moment.
            </div>
          )}
        </div>

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
          ) : latestStories.length > 0 ? (
            <div className="space-y-4">
              {latestStories.slice(0, 10).map((story) => (
                <StoryCard key={Number(story.id)} story={story} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No stories available at the moment.
            </div>
          )}
        </div>
      </PageLayout>
    </>
  );
}
