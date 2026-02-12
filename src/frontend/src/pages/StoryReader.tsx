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
  const storyId = BigInt(params.storyId);
  const navigate = useNavigate();
  const { language } = usePreferences();
  const { isPremium } = useAppUser();
  const { data: story, isLoading } = useStory(storyId);
  const { addToHistory } = useReadingHistory();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isDownloaded, downloadStory, removeDownload } = useOfflineDownloads();

  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [background, setBackground] = useState<ReadingBackground>('default');
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const content = story?.languages[language as keyof typeof story.languages];
  const title = content?.title || story?.languages.english.title || '';
  const body = content?.body || story?.languages.english.body || '';
  const summary = content?.summary || story?.languages.english.summary || '';
  const isPremiumLocked = story?.isPremium && !isPremium;
  const downloaded = story ? isDownloaded(story.id) : false;
  const favorite = story ? isFavorite(story.id) : false;

  // Load saved progress on mount
  useEffect(() => {
    if (story) {
      const saved = loadReadingProgress(story.id.toString());
      if (saved && scrollContainerRef.current) {
        setTimeout(() => {
          scrollContainerRef.current?.scrollTo({
            top: saved.scrollPosition,
            behavior: 'smooth',
          });
        }, 100);
      }
    }
  }, [story]);

  // Track scroll progress
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !story) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const percentage = calculateScrollPercentage(scrollTop, scrollHeight, clientHeight);
      
      setScrollProgress(percentage);
      
      // Save progress periodically
      if (percentage > 0) {
        saveReadingProgress(story.id.toString(), percentage, scrollTop);
        addToHistory(story.id, percentage);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [story, addToHistory]);

  // Add to history on mount
  useEffect(() => {
    if (story) {
      const saved = loadReadingProgress(story.id.toString());
      addToHistory(story.id, saved?.scrollPercentage || 0);
    }
  }, [story, addToHistory]);

  const handleShare = async () => {
    if (!story || isSharing) return;
    
    setIsSharing(true);
    try {
      const result: ShareResult = await shareStory(story.id, title, summary);
      
      if (result === 'success') {
        toast.success('Thanks for sharing!');
      } else if (result === 'cancelled') {
        // User cancelled, no message
      } else {
        toast.error('Failed to share. Please try again.');
      }
    } catch (error) {
      console.error('Share error:', error);
      toast.error('Failed to share. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownload = async () => {
    if (!story || isDownloading) return;
    
    setIsDownloading(true);
    try {
      if (downloaded) {
        await removeDownload(story.id);
        toast.success('Story removed from offline storage');
      } else {
        await downloadStory(story);
        toast.success('Story saved for offline reading');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to save story. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleFavorite = async () => {
    if (!story) return;
    try {
      await toggleFavorite(story.id);
      toast.success(favorite ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      console.error('Favorite error:', error);
      toast.error('Failed to update favorites. Please try again.');
    }
  };

  const getBackgroundClass = () => {
    switch (background) {
      case 'sepia':
        return 'bg-[#f4ecd8] text-[#5f4b32]';
      case 'dark':
        return 'bg-gray-900 text-gray-100';
      default:
        return 'bg-background text-foreground';
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small':
        return 'text-base leading-relaxed';
      case 'large':
        return 'text-xl leading-loose';
      default:
        return 'text-lg leading-relaxed';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading story...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-xl font-semibold mb-2">Story not found</p>
          <Button onClick={() => navigate({ to: '/' })}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div ref={scrollContainerRef} className={`min-h-screen ${getBackgroundClass()} ${transitions.colors} overflow-auto`}>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Progress value={scrollProgress} className="h-1 rounded-none" />
      </div>

      {/* Header */}
      <div className={`sticky top-0 z-40 ${getBackgroundClass()} border-b backdrop-blur-sm bg-opacity-95`}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: '/' })}
            className={focusRing}
          >
            <ArrowLeft className={iconSizes.sm} />
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavorite}
              className={focusRing}
            >
              <Heart className={`${iconSizes.sm} ${favorite ? 'fill-current text-red-500' : ''}`} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              disabled={isSharing}
              className={focusRing}
            >
              <Share2 className={iconSizes.sm} />
            </Button>
            
            {!isPremiumLocked && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                disabled={isDownloading}
                className={focusRing}
              >
                {downloaded ? (
                  <Check className={`${iconSizes.sm} text-green-500`} />
                ) : (
                  <Download className={iconSizes.sm} />
                )}
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className={focusRing}>
                  <Settings className={iconSizes.sm} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Reading Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Background</DropdownMenuLabel>
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
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Font Size</DropdownMenuLabel>
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
      </div>

      {/* Cover Image */}
      <div className="relative w-full h-64 md:h-96 overflow-hidden">
        <img
          src={story.coverImageUrl}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/assets/generated/cover-default.dim_1200x1600.png';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div ref={contentRef} className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
        
        <div className="flex items-center gap-4 text-sm opacity-70 mb-8">
          <span>{story.category}</span>
          <span>•</span>
          <span>{Number(story.readTimeMinutes)} min read</span>
          {story.isPremium && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                {isPremiumLocked ? (
                  <>
                    <Lock className={iconSizes.xs} />
                    Premium Story
                  </>
                ) : (
                  '✓ Premium Access'
                )}
              </span>
            </>
          )}
        </div>

        {isPremiumLocked ? (
          <div className={`${cardRadius.medium} border-2 border-yellow-500/50 bg-yellow-500/10 p-8 text-center space-y-4`}>
            <Lock className={`${iconSizes.lg} mx-auto text-yellow-600 dark:text-yellow-500`} />
            <div>
              <h3 className="text-xl font-bold mb-2">Premium Story</h3>
              <p className="text-muted-foreground mb-4">
                This story is available exclusively for Premium members.
              </p>
            </div>
            <Button
              onClick={() => navigate({ to: '/premium' })}
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            >
              Go Premium
            </Button>
          </div>
        ) : (
          <div className={`${getFontSizeClass()} whitespace-pre-wrap`}>
            {body}
          </div>
        )}
      </div>
    </div>
  );
}
