import { useParams, useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { usePreferences } from '../context/PreferencesContext';
import { useAppUser } from '../hooks/useAppUser';
import { useReadingHistory } from '../hooks/useReadingHistory';
import { useOfflineDownloads } from '../hooks/useOfflineDownloads';
import { Story, Language } from '../backend';
import { Button } from '../components/ui/button';
import { ArrowLeft, Heart, Download, Play, Pause, Type, Palette, Languages } from 'lucide-react';
import ShareSheetPlaceholder from '../components/ShareSheetPlaceholder';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { updateStreak } from '../lib/engagement';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Separator } from '../components/ui/separator';

export default function StoryReader() {
  const { storyId } = useParams({ from: '/story/$storyId' });
  const navigate = useNavigate();
  const { actor } = useActor();
  const { language: uiLanguage, setLanguage } = usePreferences();
  const { isPremium } = useAppUser();
  const { addToHistory } = useReadingHistory();
  const { isDownloaded, downloadStory, removeDownload } = useOfflineDownloads();

  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [background, setBackground] = useState<'default' | 'sepia' | 'dark'>('default');
  const [autoScroll, setAutoScroll] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [readingLanguage, setReadingLanguage] = useState<Language>(Language.english);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { data: story, isLoading } = useQuery<Story>({
    queryKey: ['story', storyId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getStory(BigInt(storyId));
    },
    enabled: !!actor && !!storyId,
  });

  const downloaded = isDownloaded(BigInt(storyId));

  useEffect(() => {
    if (story) {
      addToHistory(story.id, 0);
      updateStreak();
    }
  }, [story, addToHistory]);

  useEffect(() => {
    if (autoScroll && contentRef.current) {
      scrollIntervalRef.current = setInterval(() => {
        window.scrollBy({ top: 1, behavior: 'smooth' });
      }, 50);
    } else if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [autoScroll]);

  const handleToggleFavorite = async () => {
    if (!actor || !story) return;
    try {
      await actor.toggleFavoriteStory(story.id);
      setIsFavorite(!isFavorite);
      toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  const handleDownload = async () => {
    if (!story) return;
    if (downloaded) {
      removeDownload(BigInt(storyId));
      toast.success('Removed from downloads');
    } else {
      downloadStory(story);
      toast.success('Downloaded for offline reading');
    }
  };

  const handleLanguageChange = (lang: string) => {
    setReadingLanguage(lang as Language);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading story...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Story not found</p>
          <Button onClick={() => navigate({ to: '/' })}>Go Home</Button>
        </div>
      </div>
    );
  }

  const content = story.languages[readingLanguage];
  const fontSizeClass = {
    small: 'text-base',
    medium: 'text-lg',
    large: 'text-xl',
  }[fontSize];

  const backgroundClass = {
    default: 'bg-background text-foreground',
    sepia: 'bg-[#f4ecd8] text-[#5c4a3a]',
    dark: 'bg-gray-900 text-gray-100',
  }[background];

  // Get story preview for sharing (first 100 chars of summary or body)
  const storyPreview = content.summary 
    ? content.summary.slice(0, 100) 
    : content.body.slice(0, 100);

  return (
    <div className={`min-h-screen ${backgroundClass} transition-colors`}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleToggleFavorite}>
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDownload}>
              <Download className={`w-5 h-5 ${downloaded ? 'fill-primary text-primary' : ''}`} />
            </Button>
            <ShareSheetPlaceholder 
              storyTitle={content.title} 
              storyId={story.id}
              storyPreview={storyPreview}
            />
          </div>
        </div>
      </div>

      {/* Reading Controls */}
      <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
        <div className="flex flex-wrap gap-3">
          <Select value={fontSize} onValueChange={(v) => setFontSize(v as any)}>
            <SelectTrigger className="w-[140px]">
              <Type className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>

          <Select value={background} onValueChange={(v) => setBackground(v as any)}>
            <SelectTrigger className="w-[140px]">
              <Palette className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="sepia">Sepia</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>

          <Select value={readingLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[140px]">
              <Languages className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Language.english}>English</SelectItem>
              <SelectItem value={Language.tamil}>Tamil</SelectItem>
              <SelectItem value={Language.hindi}>Hindi</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={autoScroll ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAutoScroll(!autoScroll)}
          >
            {autoScroll ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            Auto Scroll
          </Button>
        </div>
      </div>

      <Separator />

      {/* Story Content */}
      <div ref={contentRef} className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          {story.isPremium && !isPremium && (
            <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                Premium unlocked
              </p>
            </div>
          )}
          <h1 className={`font-bold mb-2 ${fontSize === 'small' ? 'text-2xl' : fontSize === 'medium' ? 'text-3xl' : 'text-4xl'}`}>
            {content.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{story.author}</span>
            <span>•</span>
            <span>{Number(story.readTimeMinutes)} min read</span>
            {story.isPremium && (
              <>
                <span>•</span>
                <span className="text-yellow-600 dark:text-yellow-400">Premium</span>
              </>
            )}
          </div>
        </div>

        {content.summary && (
          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
            <p className={`${fontSizeClass} italic`}>{content.summary}</p>
          </div>
        )}

        <div className={`${fontSizeClass} leading-relaxed space-y-4`}>
          {content.body.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <Separator className="mb-6" />
        <p className="text-sm text-muted-foreground mb-4">
          Enjoyed this story? Share it with friends!
        </p>
        <div className="flex justify-center">
          <ShareSheetPlaceholder 
            storyTitle={content.title} 
            storyId={story.id}
            storyPreview={storyPreview}
          />
        </div>
      </div>
    </div>
  );
}
