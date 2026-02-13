import { useState } from 'react';
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
import LanguageSelector from '../components/LanguageSelector';
import ModeToggle from '../components/ModeToggle';
import StoryCardSkeleton from '../components/StoryCardSkeleton';
import { Button } from '../components/ui/button';
import { t } from '../lib/i18n';
import { canShowNotifications } from '../lib/notifications';
import { pageLayout } from '../lib/uiPolish';
import { isPreviewMode } from '../lib/urlParams';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function HomeTab() {
  const { language, mode } = usePreferences();
  const { isPremium, dailyNotificationsEnabled } = useAppUser();
  const [logoError, setLogoError] = useState(false);

  const { 
    data: featuredStory, 
    isLoading: featuredLoading,
    isError: featuredError,
    refetch: refetchFeatured
  } = useGetFeaturedStory();

  const { 
    data: latestStories = [], 
    isLoading: storiesLoading,
    isError: storiesError,
    refetch: refetchStories
  } = useGetAllStories();

  // Show notification banner if user wants notifications but can't receive them
  const showNotificationBanner = dailyNotificationsEnabled && !canShowNotifications();
  
  // Check if we should show ads
  const showAds = !isPremium && !isPreviewMode();

  return (
    <>
      {/* Daily Story Notification Banner */}
      {showNotificationBanner && <DailyStoryNotificationBanner show={true} />}

      <PageLayout>
        {/* Home Header with Logo, Language Selector, and Mode Toggle */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            {!logoError ? (
              <img 
                src="/assets/generated/gt-logo.dim_256x256.png"
                alt="Global Tales"
                className="h-10 w-10 object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">GT</span>
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold">Global Tales</h1>
              <p className="text-xs text-muted-foreground">Stories from around the world</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <ModeToggle />
          </div>
        </div>

        {/* Ad Banner - only for non-premium users and not in preview mode */}
        {showAds && <AdPlaceholder variant="banner" />}

        {/* Featured Story */}
        <div>
          <h2 className={`${pageLayout.subtitleSize} ${pageLayout.subtitleWeight} ${pageLayout.subtitleMargin}`}>
            {t('featuredStory', language)}
          </h2>
          {featuredLoading ? (
            <div className="aspect-[16/9] bg-muted animate-pulse rounded-lg" />
          ) : featuredError ? (
            <div className="p-6 rounded-lg bg-destructive/10 border border-destructive/20 text-center">
              <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
              <p className="text-sm text-destructive mb-3">Failed to load featured story</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refetchFeatured()}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            </div>
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
              {[1, 2, 3, 4, 5].map((i) => (
                <StoryCardSkeleton key={i} />
              ))}
            </div>
          ) : storiesError ? (
            <div className="p-6 rounded-lg bg-destructive/10 border border-destructive/20 text-center">
              <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
              <p className="text-sm text-destructive mb-3">Failed to load stories</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refetchStories()}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            </div>
          ) : latestStories.length > 0 ? (
            <div className="space-y-4">
              {latestStories.slice(0, 15).map((story) => (
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
