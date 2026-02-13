import { useNavigate } from '@tanstack/react-router';
import { useMyStories, isGuestDraft } from '../hooks/useMyStories';
import { usePreferences } from '../context/PreferencesContext';
import { t } from '../lib/i18n';
import { Button } from '../components/ui/button';
import { Plus, BookOpen } from 'lucide-react';
import { iconSizes, cardPadding } from '../lib/uiPolish';
import PageLayout from '../components/PageLayout';
import MyStoryDraftCard from '../components/MyStoryDraftCard';

export default function MyStories() {
  const navigate = useNavigate();
  const { language } = usePreferences();
  const { data: myStories = [], isLoading } = useMyStories();

  const handleCreate = () => {
    navigate({ to: '/story-editor' });
  };

  if (isLoading) {
    return (
      <PageLayout title={t('myStories', language)}>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={t('myStories', language)}>
      <div className="space-y-4">
        {/* Create Button */}
        <Button
          onClick={handleCreate}
          size="lg"
          className="w-full"
        >
          <Plus className={iconSizes.md} />
          {t('createStory', language)}
        </Button>

        {/* Stories List */}
        {myStories.length > 0 ? (
          <div className="space-y-4">
            {myStories.map((story) => (
              <MyStoryDraftCard
                key={isGuestDraft(story) ? story.id : story.id.toString()}
                story={story}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpen className={`${iconSizes.xl} text-muted-foreground mb-4`} />
            <p className="text-muted-foreground font-medium">{t('noStoriesYet', language)}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {t('createYourFirstStory', language)}
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
