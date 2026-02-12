import { useParams, useNavigate } from '@tanstack/react-router';
import { useStory } from '../hooks/useStories';
import { usePreferences } from '../context/PreferencesContext';
import { useAppUser } from '../hooks/useAppUser';
import { useReadingHistory } from '../hooks/useReadingHistory';
import { useOfflineDownloads } from '../hooks/useOfflineDownloads';
import { ArrowLeft, Heart, Share2, Download, Check, Lock, Settings } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useState, useEffect, useRef } from 'react';
import { shareStory, ShareResult } from '../lib/share';
import { toast } from 'sonner';
import { useFavorites } from '../hooks/useFavorites';
import { iconSizes, cardRadius, focusRing, transitions } from '../lib/uiPolish';
import { saveReadingProgress, loadReadingProgress, calculateScrollPercentage } from '../lib/readingProgress';
import { Progress } from '../components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '../components/ui/dropdown-menu';

type ReadingBackground = 'default' | 'sepia' | 'dark';
type FontSize = 'small' | 'medium' | 'large';

export default function StoryReader() {
  const params = useParams({ from: '/story/$storyId' });
  const navigate = useNavigate();
  const { language } = usePreferences();
  const { isPremium } = useAppUser();
  const { isFavorite, toggleFavorite, isToggling } = useFavorites();
  const { updateProgress } = useReadingHistory();
  const { isDownloaded, downloadStory, removeDownload } = useOfflineDownloads();

  const [isSharing, setIsSharing] = useState(false);
  const [isDownloadingStory, setIsDownloadingStory] = useState(false);
  const [background, setBackground] = useState<ReadingBackground>('default');
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Parse storyId safely - do this before calling useStory
  let storyId: bigint | null = null;
  let parseError = false;
  try {
    storyId = BigInt(params.storyId);
  } catch (error) {
    parseError = true;
  }

  // Call useStory with a valid bigint or 0n as fallback
  const { data: story, isLoading, isError } = useStory(storyId || 0n);

  const content = story?.languages[language as keyof typeof story.languages];
  const title = content?.title || story?.languages.english.title || '';
  const body = content?.body || story?.languages.english.body || '';
  const summary = content?.summary || story?.languages.english.summary || '';
  const isPremiumLocked = story?.isPremium && !isPremium;
  const downloaded = story ? isDownloaded(story.id) : false;
  const favorite = story ? isFavorite(story.id) : false;

  // Load saved reading progress
  useEffect(() => {
    if (story) {
      const progress = loadReadingProgress(story.id.toString());
      if (progress && contentRef.current) {
        contentRef.current.scrollTop = progress.scrollPosition;
      }
    }
  }, [story]);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current && story) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        const percentage = calculateScrollPercentage(scrollTop, scrollHeight, clientHeight);
        setScrollProgress(percentage);
        saveReadingProgress(story.id.toString(), percentage, scrollTop);
        updateProgress(story.id, percentage);
      }
    };

    const ref = contentRef.current;
    if (ref) {
      ref.addEventListener('scroll', handleScroll);
      return () => ref.removeEventListener('scroll', handleScroll);
    }
  }, [story, updateProgress]);

  const handleShare = async () => {
    if (!story) return;
    
    setIsSharing(true);
    try {
      const result: ShareResult = await shareStory(story.id.toString(), title, summary);
      
      if (result === 'success') {
        toast.success('Story shared successfully!');
      } else if (result === 'cancelled') {
        // User cancelled, no toast needed
      } else {
        toast.error('Failed to share story');
      }
    } catch (error) {
      console.error('Share error:', error);
      toast.error('Failed to share story');
    } finally {
      setIsSharing(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!story) return;
    
    try {
      await toggleFavorite(story.id);
      toast.success(favorite ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      console.error('Toggle favorite error:', error);
      toast.error('Failed to update favorites');
    }
  };

  const handleDownload = async () => {
    if (!story) return;
    
    setIsDownloadingStory(true);
    try {
      if (downloaded) {
        await removeDownload(story.id);
        toast.success('Download removed');
      } else {
        await downloadStory(story);
        toast.success('Story downloaded for offline reading');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to manage download');
    } finally {
      setIsDownloadingStory(false);
    }
  };

  // Now handle the parse error after all hooks have been called
  if (parseError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Invalid Story ID</h1>
          <p className="text-muted-foreground mb-4">The story you're looking for doesn't exist.</p>
          <Button onClick={() => navigate({ to: '/' })}>Go Home</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading story...</p>
        </div>
      </div>
    );
  }

  if (isError || !story) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Story Not Found</h1>
          <p className="text-muted-foreground mb-4">Coming soon</p>
          <Button onClick={() => navigate({ to: '/' })}>Go Home</Button>
        </div>
      </div>
    );
  }

  const backgroundClasses = {
    default: 'bg-background text-foreground',
    sepia: 'bg-[#f4ecd8] text-[#5c4a3a]',
    dark: 'bg-gray-900 text-gray-100',
  };

  const fontSizeClasses = {
    small: 'text-base',
    medium: 'text-lg',
    large: 'text-xl',
  };

  return (
    <div className={`min-h-screen ${backgroundClasses[background]}`}>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
            <ArrowLeft className={iconSizes.md} />
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleFavorite}
              disabled={isToggling}
              className={favorite ? 'text-red-500' : ''}
            >
              <Heart className={iconSizes.md} fill={favorite ? 'currentColor' : 'none'} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              disabled={isSharing}
            >
              <Share2 className={iconSizes.md} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
              disabled={isDownloadingStory}
            >
              {downloaded ? (
                <Check className={iconSizes.md} />
              ) : (
                <Download className={iconSizes.md} />
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className={iconSizes.md} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Reading Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  Background
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setBackground('default')}>
                  {background === 'default' && '✓ '}Default
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setBackground('sepia')}>
                  {background === 'sepia' && '✓ '}Sepia
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setBackground('dark')}>
                  {background === 'dark' && '✓ '}Dark
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  Font Size
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setFontSize('small')}>
                  {fontSize === 'small' && '✓ '}Small
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFontSize('medium')}>
                  {fontSize === 'medium' && '✓ '}Medium
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFontSize('large')}>
                  {fontSize === 'large' && '✓ '}Large
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <Progress value={scrollProgress} className="h-1 rounded-none" />
      </header>

      {/* Content */}
      <div ref={contentRef} className="max-w-2xl mx-auto px-4 py-8 overflow-auto">
        {/* Cover Image */}
        {story.coverImageUrl && (
          <div className={`mb-6 ${cardRadius.medium} overflow-hidden`}>
            <img
              src={story.coverImageUrl}
              alt={title}
              className="w-full aspect-[16/9] object-cover"
              onError={(e) => {
                e.currentTarget.src = '/assets/generated/cover-default.dim_1200x1600.png';
              }}
            />
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl font-bold mb-4">{title}</h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
          <span>{story.author}</span>
          <span>•</span>
          <span>{Number(story.readTimeMinutes)} min read</span>
          <span>•</span>
          <span>{story.category}</span>
        </div>

        {/* Premium Lock */}
        {isPremiumLocked && (
          <div className={`${cardRadius.medium} bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 mb-6`}>
            <div className="flex items-center gap-2 mb-2">
              <Lock className={iconSizes.sm} />
              <h3 className="font-semibold">Premium Story</h3>
            </div>
            <p className="text-sm mb-3">This story is only available to premium members.</p>
            <Button onClick={() => navigate({ to: '/premium' })} size="sm">
              Go Premium
            </Button>
          </div>
        )}

        {/* Body */}
        <div className={`prose prose-lg max-w-none ${fontSizeClasses[fontSize]}`}>
          {isPremiumLocked ? (
            <p className="text-muted-foreground italic">
              {body.substring(0, 200)}...
            </p>
          ) : (
            <div className="whitespace-pre-wrap">{body}</div>
          )}
        </div>
      </div>
    </div>
  );
}
