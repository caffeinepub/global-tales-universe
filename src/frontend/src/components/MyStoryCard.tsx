import { Story } from '../backend';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { usePreferences } from '../context/PreferencesContext';
import { Clock, Edit } from 'lucide-react';
import { Button } from './ui/button';
import { iconSizes, cardRadius, cardElevation, transitions, focusRing } from '../lib/uiPolish';
import { getStoryCoverUrl } from '../hooks/useStories';
import { logOnce } from '../lib/logOnce';
import { getFullPath } from '../lib/routerSearch';

interface MyStoryCardProps {
  story: Story;
}

export default function MyStoryCard({ story }: MyStoryCardProps) {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const currentSearch = routerState.location.search;
  const fullPath = getFullPath(currentPath, currentSearch);
  const { language } = usePreferences();
  
  const content = story.languages[language as keyof typeof story.languages];
  const title = content?.title || story.languages.english.title;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      navigate({ to: '/story/editor/$storyId', params: { storyId: String(story.id) } });
    } catch (error) {
      const logKey = `my-story-edit-${story.id}-${currentPath}`;
      logOnce(
        logKey,
        `MyStoryCard edit navigation failed: attempted="/story/editor/${story.id}" current="${fullPath}" error="${error}"`,
        'error'
      );
    }
  };

  const handleRead = () => {
    try {
      navigate({ to: '/story/$storyId', params: { storyId: String(story.id) } });
    } catch (error) {
      const logKey = `my-story-read-${story.id}-${currentPath}`;
      logOnce(
        logKey,
        `MyStoryCard read navigation failed: attempted="/story/${story.id}" current="${fullPath}" error="${error}"`,
        'error'
      );
    }
  };

  // Get cover image URL (handles both ExternalBlob and fallback)
  const coverImageUrl = getStoryCoverUrl(story);

  return (
    <div
      className={`flex gap-4 bg-card ${cardRadius.small} p-4 border ${cardElevation.low} ${focusRing}`}
      tabIndex={0}
    >
      <div className={`w-24 h-32 shrink-0 ${cardRadius.small} overflow-hidden bg-muted`}>
        <img
          src={coverImageUrl}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/assets/generated/cover-default.dim_1200x1600.png';
          }}
        />
      </div>
      <div className="flex-1 min-w-0 flex flex-col">
        <h3 className="font-semibold line-clamp-2 mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">
          {content?.summary || story.languages.english.summary}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className={iconSizes.xs} />
              {Number(story.readTimeMinutes)} min
            </span>
            <span>•</span>
            <span>{story.category}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className={focusRing}
            >
              <Edit className={`${iconSizes.sm} mr-1`} />
              Edit
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleRead}
              className={focusRing}
            >
              Read
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
