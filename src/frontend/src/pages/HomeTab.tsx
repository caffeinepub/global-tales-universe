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

export default function HomeTab() {
  const { actor } = useActor();
  const { language, mode } = usePreferences();
  const { isPremium, dailyNotificationsEnabled } = useAppUser();

  const { data: featuredStory } = useQuery<Story>({
    queryKey: ['featuredStory', language],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDailyFeaturedStoryByLanguage(language as Language);
    },
    enabled: !!actor,
  });

  const { data: latestStories = [] } = useQuery<Story[]>({
    queryKey: ['latestStories', language, mode],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getFilteredSortedStories(
        language as Language,
        true,
        null,
        mode === 'kids' ? true : null
      );
    },
    enabled: !!actor,
  });

  // Show notification banner if user wants notifications but can't receive them
  const showNotificationBanner = dailyNotificationsEnabled && !canShowNotifications();

  return (
    <>
      {/* Daily Story Notification Banner */}
      {showNotificationBanner && <DailyStoryNotificationBanner show={true} />}

      <PageLayout>
        {/* Ad Banner - only for non-premium users */}
        {!isPremium && (
          <div>
            <AdPlaceholder variant="banner" />
          </div>
        )}

        {/* Featured Story */}
        {featuredStory && (
          <div>
            <h2 className={`${pageLayout.subtitleSize} ${pageLayout.subtitleWeight} ${pageLayout.subtitleMargin}`}>
              {t('featuredStory', language)}
            </h2>
            <StoryCard story={featuredStory} featured />
          </div>
        )}

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

        {/* Inline Ad - only for non-premium users */}
        {!isPremium && (
          <div>
            <AdPlaceholder variant="inline" />
          </div>
        )}

        {/* Latest Stories */}
        <div>
          <h2 className={`${pageLayout.subtitleSize} ${pageLayout.subtitleWeight} ${pageLayout.subtitleMargin}`}>
            {t('latestStories', language)}
          </h2>
          <div className="space-y-4">
            {latestStories.slice(0, 10).map((story) => (
              <StoryCard key={Number(story.id)} story={story} />
            ))}
          </div>
        </div>
      </PageLayout>
    </>
  );
}
