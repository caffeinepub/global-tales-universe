import { useReadingHistory } from '../hooks/useReadingHistory';
import { useGetStoryById } from '../hooks/useStories';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { usePreferences } from '../context/PreferencesContext';
import { t } from '../lib/i18n';
import { getStoryContent } from '../lib/storyLanguage';
import { getStoryCoverUrl } from '../hooks/useStories';
import { Progress } from './ui/progress';
import { cardRadius, transitions, focusRing } from '../lib/uiPolish';
import { logOnce } from '../lib/logOnce';
import { getFullPath } from '../lib/routerSearch';

export default function ContinueReadingCard() {
  const { getLastRead } = useReadingHistory();
  const lastRead = getLastRead();
  const { data: story } = useGetStoryById(lastRead?.storyId || null);
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const currentSearch = routerState.location.search;
  const fullPath = getFullPath(currentPath, currentSearch);
  const { language } = usePreferences();

  if (!lastRead || !story) return null;

  const content = getStoryContent(story, language);
  const coverUrl = getStoryCoverUrl(story);

  const handleNavigate = () => {
    try {
      navigate({ to: '/story/$storyId', params: { storyId: story.id.toString() } });
    } catch (error) {
      const logKey = `continue-reading-${story.id}-${currentPath}`;
      logOnce(
        logKey,
        `ContinueReadingCard navigation failed: attempted="/story/${story.id}" current="${fullPath}" error="${error}"`,
        'error'
      );
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3">{t('continueReading', language)}</h2>
      <div
        onClick={handleNavigate}
        className={`flex gap-3 p-4 ${cardRadius.medium} bg-accent/30 hover:bg-accent/50 cursor-pointer ${transitions.colors} border shadow-sm ${focusRing}`}
        tabIndex={0}
        role="button"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleNavigate();
          }
        }}
      >
        <img
          src={coverUrl}
          alt={content.title}
          className={`w-16 h-24 object-cover ${cardRadius.small} shrink-0`}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm line-clamp-2 mb-1">{content.title}</h3>
          <p className="text-xs text-muted-foreground mb-2">{story.author}</p>
          <Progress value={lastRead.progress} className="h-1.5" />
          <p className="text-xs text-muted-foreground mt-1">{Math.round(lastRead.progress)}% complete</p>
        </div>
      </div>
    </div>
  );
}
