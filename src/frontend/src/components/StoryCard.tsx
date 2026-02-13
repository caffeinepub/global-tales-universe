import { useNavigate } from '@tanstack/react-router';
import { Heart, Clock, Star } from 'lucide-react';
import { Story } from '../backend';
import { useFavorites } from '../hooks/useFavorites';
import { useStorySocial } from '../hooks/useStorySocial';
import { usePreferences } from '../context/PreferencesContext';
import { Button } from './ui/button';
import { cardRadius, cardPadding, cardElevation, iconSizes } from '../lib/uiPolish';
import { logOnce } from '../lib/logOnce';
import { getFullPath } from '../lib/routerSearch';
import { useRouterState } from '@tanstack/react-router';

interface StoryCardProps {
  story: Story;
}

export default function StoryCard({ story }: StoryCardProps) {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const currentSearch = routerState.location.search;
  const fullPath = getFullPath(currentPath, currentSearch);
  const { language } = usePreferences();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { likeOverlay } = useStorySocial(story.id.toString());

  const content = story.languages[language] || story.languages.english;
  const effectiveLikes = Number(story.likes) + likeOverlay;

  // Use placeholder image for all stories
  const coverUrl = 'https://via.placeholder.com/300x200?text=Story';

  const handleCardClick = () => {
    try {
      navigate({ to: '/story/$storyId', params: { storyId: String(story.id) } });
    } catch (error) {
      const logKey = `story-card-nav-${story.id}-${currentPath}`;
      logOnce(
        logKey,
        `StoryCard navigation failed: attempted="/story/${story.id}" current="${fullPath}" error="${error}"`,
        'error'
      );
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(story.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`${cardRadius.medium} ${cardPadding.default} bg-card ${cardElevation.low} cursor-pointer hover:shadow-lg transition-shadow`}
    >
      <div className="flex gap-4">
        <img
          src={coverUrl}
          alt={content.title}
          className={`w-24 h-24 object-cover ${cardRadius.small} shrink-0`}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-1 line-clamp-2">{content.title}</h3>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{content.summary}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className={iconSizes.xs} />
              {Number(story.readTimeMinutes)} min
            </span>
            <span className="flex items-center gap-1">
              <Heart className={iconSizes.xs} />
              {effectiveLikes}
            </span>
            <span className="flex items-center gap-1">
              <Star className={iconSizes.xs} />
              {Number(story.rating)}/5
            </span>
          </div>
        </div>
        <Button
          variant={isFavorite(story.id) ? 'default' : 'outline'}
          size="icon"
          onClick={handleFavoriteClick}
          className="shrink-0"
        >
          <Heart
            className={iconSizes.sm}
            fill={isFavorite(story.id) ? 'currentColor' : 'none'}
          />
        </Button>
      </div>
    </div>
  );
}
