import { Story } from '../backend';
import { useNavigate } from '@tanstack/react-router';
import { Heart, Clock } from 'lucide-react';
import { getCoverUrl } from '../lib/covers';
import { getStoryContent } from '../lib/storyLanguage';
import { usePreferences } from '../context/PreferencesContext';
import { Badge } from './ui/badge';
import { t } from '../lib/i18n';

interface StoryCardProps {
  story: Story;
  featured?: boolean;
}

export default function StoryCard({ story, featured = false }: StoryCardProps) {
  const navigate = useNavigate();
  const { language } = usePreferences();
  const content = getStoryContent(story, language);
  const coverUrl = getCoverUrl(story.category, story.isKidFriendly);

  const handleClick = () => {
    navigate({ to: '/story/$storyId', params: { storyId: story.id.toString() } });
  };

  if (featured) {
    return (
      <div
        onClick={handleClick}
        className="relative overflow-hidden rounded-2xl shadow-lg cursor-pointer transition-all hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 duration-500"
      >
        <div className="aspect-[16/9] relative">
          <img src={coverUrl} alt={content.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-primary/90 text-primary-foreground">
                {story.category}
              </Badge>
              {story.isPremium && (
                <Badge variant="secondary" className="bg-yellow-500/90 text-black">
                  {t('premium', language)}
                </Badge>
              )}
            </div>
            <h2 className="text-2xl font-bold mb-2 line-clamp-2">{content.title}</h2>
            <p className="text-sm text-white/90 line-clamp-3 mb-3">{content.summary}</p>
            <div className="flex items-center gap-4 text-sm text-white/80">
              <span>{story.author}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {story.readTimeMinutes.toString()} {t('min', language)}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {story.likes.toString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className="flex gap-3 p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      <img
        src={coverUrl}
        alt={content.title}
        className="w-20 h-28 object-cover rounded-md shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-1">
          <h3 className="font-semibold text-sm line-clamp-2 flex-1">{content.title}</h3>
          {story.isPremium && (
            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 text-xs">
              {t('premium', language)}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-2">{story.author}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {story.readTimeMinutes.toString()} {t('min', language)}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            {story.likes.toString()}
          </span>
        </div>
      </div>
    </div>
  );
}
