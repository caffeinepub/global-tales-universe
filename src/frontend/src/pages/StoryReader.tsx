import { useParams, useNavigate } from '@tanstack/react-router';
import { useStory } from '../hooks/useStories';
import { usePreferences } from '../context/PreferencesContext';
import { useFavorites } from '../hooks/useFavorites';
import { useReadingHistory } from '../hooks/useReadingHistory';
import { useOfflineDownloads } from '../hooks/useOfflineDownloads';
import { getStoryContent, hasTranslation } from '../lib/storyLanguage';
import { translateStoryPlaceholder } from '../lib/translatePlaceholder';
import { getCoverUrl } from '../lib/covers';
import { t } from '../lib/i18n';
import { Button } from '../components/ui/button';
import { ArrowLeft, Heart, Download, Trash2 } from 'lucide-react';
import ReadingControls from '../components/ReadingControls';
import ShareSheetPlaceholder from '../components/ShareSheetPlaceholder';
import TranslateBanner from '../components/TranslateBanner';
import { useState, useEffect, useRef } from 'react';
import { Progress } from '../components/ui/progress';
import { updateStreak } from '../lib/engagement';
import { toast } from 'sonner';

export default function StoryReader() {
  const { storyId } = useParams({ from: '/story/$storyId' });
  const navigate = useNavigate();
  const { language, fontSize, readingBackground, autoScroll } = usePreferences();
  const { data: story, isLoading } = useStory(BigInt(storyId));
  const { isFavorite, toggleFavorite, isToggling } = useFavorites();
  const { addToHistory } = useReadingHistory();
  const { isDownloaded, downloadStory, removeDownload } = useOfflineDownloads();
  const [progress, setProgress] = useState(0);
  const [translated, setTranslated] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (story) {
      addToHistory(story.id, 0);
      updateStreak();
    }
  }, [story]);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const element = contentRef.current;
      const scrolled = element.scrollTop;
      const total = element.scrollHeight - element.clientHeight;
      const percent = total > 0 ? (scrolled / total) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, percent)));
    };

    const element = contentRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
      return () => element.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    if (autoScroll && contentRef.current) {
      const scrollInterval = setInterval(() => {
        if (contentRef.current) {
          contentRef.current.scrollBy({ top: 1, behavior: 'smooth' });
        }
      }, 50);
      return () => clearInterval(scrollInterval);
    }
  }, [autoScroll]);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="h-screen flex items-center justify-center">
          <p className="text-muted-foreground">{t('loading', language)}</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="h-screen flex items-center justify-center">
          <p className="text-muted-foreground">{t('error', language)}</p>
        </div>
      </div>
    );
  }

  const needsTranslation = !hasTranslation(story, language);
  const content = translated
    ? translateStoryPlaceholder(story, language)
    : getStoryContent(story, language);
  const coverUrl = getCoverUrl(story.category, story.isKidFriendly);
  const isFav = isFavorite(story.id);
  const downloaded = isDownloaded(story.id);

  const fontSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[fontSize];

  const bgClass = {
    white: 'bg-white text-black',
    sepia: 'bg-[#f4ecd8] text-[#5c4a3a]',
    darkGrey: 'bg-gray-800 text-gray-100',
    black: 'bg-black text-white',
  }[readingBackground];

  const handleDownload = async () => {
    if (downloaded) {
      await removeDownload(story.id);
      toast.success('Download removed');
    } else {
      await downloadStory(story);
      toast.success('Story downloaded for offline reading');
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-card border-b border-border px-4 py-3 flex items-center gap-3 shrink-0">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-sm truncate">{content.title}</h1>
        </div>
        <ReadingControls />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggleFavorite(story.id)}
          disabled={isToggling}
        >
          <Heart className={`w-5 h-5 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
        <ShareSheetPlaceholder storyTitle={content.title} storyId={storyId} />
        <Button variant="ghost" size="icon" onClick={handleDownload}>
          {downloaded ? <Trash2 className="w-5 h-5" /> : <Download className="w-5 h-5" />}
        </Button>
      </header>

      <div ref={contentRef} className={`flex-1 overflow-auto ${bgClass}`}>
        <div className="max-w-2xl mx-auto px-4 py-6">
          <img src={coverUrl} alt={content.title} className="w-full aspect-[16/9] object-cover rounded-xl mb-6" />

          {needsTranslation && !translated && (
            <TranslateBanner onTranslate={() => setTranslated(true)} />
          )}

          <h1 className="text-3xl font-bold mb-2">{content.title}</h1>
          <p className="text-sm opacity-70 mb-6">{story.author}</p>

          <div className={`prose prose-lg max-w-none ${fontSizeClass}`}>
            <p className="font-semibold mb-4">{content.summary}</p>
            <div className="whitespace-pre-wrap">{content.body}</div>
          </div>
        </div>
      </div>

      <footer className="bg-card border-t border-border px-4 py-3 shrink-0">
        <Progress value={progress} className="mb-2" />
        <p className="text-xs text-center text-muted-foreground">{Math.round(progress)}% complete</p>
      </footer>
    </div>
  );
}
