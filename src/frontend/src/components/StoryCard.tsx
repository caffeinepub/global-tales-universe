import { Story } from '../backend';
import { useNavigate } from '@tanstack/react-router';
import { usePreferences } from '../context/PreferencesContext';
import { useAppUser } from '../hooks/useAppUser';
import { Clock, Star, Crown } from 'lucide-react';
import { Badge } from './ui/badge';

interface StoryCardProps {
  story: Story;
  featured?: boolean;
}

export default function StoryCard({ story, featured = false }: StoryCardProps) {
  const navigate = useNavigate();
  const { language } = usePreferences();
  const { isPremium } = useAppUser();
  
  const content = story.languages[language as keyof typeof story.languages];
  const title = content?.title || story.languages.english.title;

  const handleClick = () => {
    navigate({ to: '/story/$storyId', params: { storyId: String(story.id) } });
  };

  if (featured) {
    return (
      <div
        onClick={handleClick}
        className="relative overflow-hidden rounded-xl cursor-pointer group"
      >
        <div className="aspect-[16/9] bg-gradient-to-br from-primary/20 to-primary/5">
          <img
            src={story.coverImageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = '/assets/generated/cover-default.dim_1200x1600.png';
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            {story.isPremium && (
              <Badge variant="secondary" className="bg-yellow-500 text-white border-0">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            )}
            <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-0">
              {story.category}
            </Badge>
          </div>
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <div className="flex items-center gap-4 text-sm text-white/80">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {Number(story.readTimeMinutes)} min
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              {Number(story.rating)}/5
            </span>
          </div>
          {story.isPremium && isPremium && (
            <p className="text-xs text-yellow-300 mt-2">Premium unlocked</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className="flex gap-4 bg-card rounded-lg p-4 cursor-pointer hover:bg-accent transition-colors"
    >
      <div className="w-24 h-32 shrink-0 rounded-md overflow-hidden bg-muted">
        <img
          src={story.coverImageUrl}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/assets/generated/cover-default.dim_1200x1600.png';
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-2">
          <h3 className="font-semibold line-clamp-2 flex-1">{title}</h3>
          {story.isPremium && (
            <Crown className="w-4 h-4 text-yellow-500 shrink-0" />
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {content?.summary || story.languages.english.summary}
        </p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {Number(story.readTimeMinutes)} min
          </span>
          <span>•</span>
          <span>{story.category}</span>
          {story.isPremium && isPremium && (
            <>
              <span>•</span>
              <span className="text-yellow-500">Premium unlocked</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
