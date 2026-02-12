import { usePreferences } from '../context/PreferencesContext';
import { useFavorites } from '../hooks/useFavorites';
import { t } from '../lib/i18n';
import StoryCard from '../components/StoryCard';
import PageLayout from '../components/PageLayout';
import { Heart } from 'lucide-react';
import { iconSizes } from '../lib/uiPolish';

export default function FavoritesTab() {
  const { language } = usePreferences();
  const { favoriteStories } = useFavorites();

  return (
    <PageLayout title={t('favorites', language)}>
      {favoriteStories.length > 0 ? (
        <div className="space-y-4">
          {favoriteStories.map((story) => (
            <StoryCard key={story.id.toString()} story={story} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Heart className={`${iconSizes.xl} text-muted-foreground mb-4`} />
          <p className="text-muted-foreground font-medium">No favorites yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Tap the heart icon on stories to save them here
          </p>
        </div>
      )}
    </PageLayout>
  );
}
