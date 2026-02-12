import { useNavigate } from '@tanstack/react-router';
import { Story } from '../backend';
import { Heart, Clock } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { usePreferences } from '../context/PreferencesContext';
import { getStoryCoverUrl } from '../hooks/useStories';
import { getStorySocialData } from '../lib/storySocialStorage';
import { cardRadius, cardElevation, transitions, iconSizes } from '../lib/uiPolish';

interface StoryCardProps {
  story: Story;
}

export default function StoryCard({ story }: StoryCardProps) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { language } = usePreferences();
  const content = story.languages[language];
  const coverUrl = getStoryCoverUrl(story);
  const isFav = isFavorite(story.id);
  
  // Get effective like count (base + overlay)
  const socialData = getStorySocialData(story.id.toString());
  const effectiveLikes = Number(story.likes) + socialData.likeOverlay;

  const handleCardClick = () => {
    navigate({ to: '/story/$storyId', params: { storyId: story.id.toString() } });
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(story.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`flex gap-3 p-3 ${cardRadius.medium} ${cardElevation.low} hover:${cardElevation.medium} ${transitions.all} cursor-pointer bg-card`}
    >
      <img
        src={coverUrl}
        alt={content.title}
        className={`w-24 h-32 object-cover ${cardRadius.small} shrink-0`}
        onError={(e) => {
          e.currentTarget.src = '/assets/generated/cover-default.dim_1200x1600.png';
        }}
      />
      <div className="flex-1 min-w-0 flex flex-col">
        <h3 className="font-semibold text-base line-clamp-2 mb-1">{content.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{content.summary}</p>
        <div className="mt-auto flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className={iconSizes.xs} />
            {Number(story.readTimeMinutes)} min
          </span>
          <span className="flex items-center gap-1">
            <Heart className={`${iconSizes.xs} ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
            {effectiveLikes}
          </span>
          <span className="truncate">{story.author}</span>
        </div>
      </div>
      <button
        onClick={handleFavoriteClick}
        className="shrink-0 self-start p-2 hover:bg-accent rounded-full transition-colors"
        aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart className={`${iconSizes.md} ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
      </button>
    </div>
  );
}
