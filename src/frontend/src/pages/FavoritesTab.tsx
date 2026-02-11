import { usePreferences } from '../context/PreferencesContext';
import { useFavorites } from '../hooks/useFavorites';
import { t } from '../lib/i18n';
import StoryCard from '../components/StoryCard';
import { Heart } from 'lucide-react';

export default function FavoritesTab() {
  const { language } = usePreferences();
  const { favoriteStories } = useFavorites();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">{t('favorites', language)}</h1>

      {favoriteStories.length > 0 ? (
        <div className="space-y-2">
          {favoriteStories.map((story) => (
            <StoryCard key={story.id.toString()} story={story} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Heart className="w-16 h-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No favorites yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Tap the heart icon on stories to save them here
          </p>
        </div>
      )}
    </div>
  );
}
