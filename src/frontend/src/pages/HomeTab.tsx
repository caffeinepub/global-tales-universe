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
import { t } from '../lib/i18n';
import { canShowNotifications } from '../lib/notifications';

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
    <div className="space-y-6 pb-6">
      {/* Daily Story Notification Banner */}
      {showNotificationBanner && <DailyStoryNotificationBanner show={true} />}

      {/* Ad Banner - only for non-premium users */}
      {!isPremium && (
        <div className="px-4 pt-4">
          <AdPlaceholder variant="banner" />
        </div>
      )}

      {/* Featured Story */}
      {featuredStory && (
        <div className="px-4">
          <h2 className="text-xl font-bold mb-4">{t('featuredStory', language)}</h2>
          <StoryCard story={featuredStory} featured />
        </div>
      )}

      {/* Categories */}
      <div>
        <h2 className="text-xl font-bold mb-4 px-4">{t('categories', language)}</h2>
        <CategoryScroller />
      </div>

      {/* Continue Reading */}
      <div className="px-4">
        <ContinueReadingCard />
      </div>

      {/* Inline Ad - only for non-premium users */}
      {!isPremium && (
        <div className="px-4">
          <AdPlaceholder variant="inline" />
        </div>
      )}

      {/* Latest Stories */}
      <div className="px-4">
        <h2 className="text-xl font-bold mb-4">{t('latestStories', language)}</h2>
        <div className="space-y-4">
          {latestStories.slice(0, 10).map((story) => (
            <StoryCard key={Number(story.id)} story={story} />
          ))}
        </div>
      </div>
    </div>
  );
}
