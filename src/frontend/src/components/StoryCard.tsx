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
import { getStoryCoverUrl } from '../hooks/useStories';
import { useState } from 'react';

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
  const { likeOverlay, toggleLike } = useStorySocial(story.id.toString());
  const [imgError, setImgError] = useState(false);

  const content = story.languages[language] || story.languages.english;
  const effectiveLikes = Number(story.likes) + likeOverlay;
  const isLiked = likeOverlay > 0;

  // Use helper to get cover URL with fallback
  const coverUrl = getStoryCoverUrl(story);
  const fallbackCover = '/assets/generated/cover-default.dim_1200x1600.png';

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

  const handleLikeClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    toggleLike();
  };

  const handleLikePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
  };

  const handleLikeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleLikeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      handleLikeClick(e);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`${cardRadius.medium} ${cardPadding.default} bg-card ${cardElevation.low} cursor-pointer hover:shadow-lg transition-shadow`}
    >
      <div className="flex gap-3 sm:gap-4 min-w-0">
        <img
          src={imgError ? fallbackCover : coverUrl}
          alt={content.title}
          onError={() => setImgError(true)}
          className={`w-20 h-20 sm:w-24 sm:h-24 object-cover ${cardRadius.small} shrink-0`}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base sm:text-lg mb-1 line-clamp-2">{content.title}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2">{content.summary}</p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 whitespace-nowrap">
              <Clock className={iconSizes.xs} />
              {Number(story.readTimeMinutes)} min
            </span>
            <button
              type="button"
              onClick={handleLikeClick}
              onPointerDown={handleLikePointerDown}
              onMouseDown={handleLikeMouseDown}
              onKeyDown={handleLikeKeyDown}
              className="flex items-center gap-1 hover:text-red-500 transition-colors whitespace-nowrap"
              aria-label={isLiked ? 'Unlike story' : 'Like story'}
            >
              <Heart
                className={iconSizes.xs}
                fill={isLiked ? 'currentColor' : 'none'}
                stroke={isLiked ? 'currentColor' : 'currentColor'}
              />
              {effectiveLikes}
            </button>
            <span className="flex items-center gap-1 whitespace-nowrap">
              <Star className={iconSizes.xs} />
              {Number(story.rating)}/5
            </span>
          </div>
        </div>
        <Button
          variant={isFavorite(story.id) ? 'default' : 'outline'}
          size="icon"
          onClick={handleFavoriteClick}
          className="shrink-0 h-9 w-9 sm:h-10 sm:w-10"
        >
          <Heart
            className="h-4 w-4"
            fill={isFavorite(story.id) ? 'currentColor' : 'none'}
          />
        </Button>
      </div>
    </div>
  );
}
