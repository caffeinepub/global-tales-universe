import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetStoryById } from '../hooks/useStories';
import { usePreferences } from '../context/PreferencesContext';
import { useFavorites } from '../hooks/useFavorites';
import { useReadingHistory } from '../hooks/useReadingHistory';
import { useOfflineDownloads } from '../hooks/useOfflineDownloads';
import { useStorySocial } from '../hooks/useStorySocial';
import { useUserProfile } from '../hooks/useUserProfile';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Heart, Share2, Download, BookOpen, Type, MessageCircle, ThumbsUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Slider } from '../components/ui/slider';
import { Input } from '../components/ui/input';
import { shareStory, ShareResult } from '../lib/share';
import { toast } from 'sonner';
import { iconSizes, focusRing } from '../lib/uiPolish';
import { getStoryCoverUrl } from '../hooks/useStories';
import type { FontSize, ReadingBackground } from '../context/PreferencesContext';

// Font size mapping
const FONT_SIZE_MAP: Record<FontSize, number> = {
  small: 14,
  medium: 18,
  large: 22,
};

const FONT_SIZE_REVERSE_MAP: Record<number, FontSize> = {
  14: 'small',
  18: 'medium',
  22: 'large',
};

export default function StoryReader() {
  const { storyId } = useParams({ from: '/story/$storyId' });
  const navigate = useNavigate();
  const { data: story, isLoading } = useGetStoryById(BigInt(storyId));
  const { language, fontSize, setFontSize, readingBackground, setReadingBackground } = usePreferences();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { updateProgress } = useReadingHistory();
  const { isDownloaded, downloadStory, removeDownload } = useOfflineDownloads();
  const { likeOverlay, comments, toggleLike, addComment } = useStorySocial(storyId);
  const { profileData } = useUserProfile();
  
  const [showControls, setShowControls] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const isFav = story ? isFavorite(story.id) : false;
  const isOffline = story ? isDownloaded(story.id) : false;
  const effectiveLikes = story ? Number(story.likes) + likeOverlay : 0;
  const isLiked = likeOverlay > 0;

  // Track reading progress
  useEffect(() => {
    if (!story) return;

    const handleScroll = () => {
      if (!contentRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      updateProgress(story.id, Math.min(progress, 100));
    };

    const ref = contentRef.current;
    ref?.addEventListener('scroll', handleScroll);
    return () => ref?.removeEventListener('scroll', handleScroll);
  }, [story, updateProgress]);

  const handleShare = async () => {
    if (!story) return;
    setIsSharing(true);
    try {
      const content = story.languages[language];
      const result: ShareResult = await shareStory(
        story.id.toString(),
        content.title,
        content.summary
      );
      
      if (result === 'success') {
        toast.success('Story shared successfully!');
      } else if (result === 'cancelled') {
        // User cancelled, no toast needed
      } else {
        toast.error('Failed to share story');
      }
    } catch (error) {
      toast.error('Failed to share story');
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownload = async () => {
    if (!story) return;
    setIsDownloading(true);
    try {
      if (isOffline) {
        await removeDownload(story.id);
        toast.success('Story removed from offline storage');
      } else {
        await downloadStory(story);
        toast.success('Story downloaded for offline reading');
      }
    } catch (error) {
      toast.error('Failed to manage offline download');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleFontSizeChange = (value: number[]) => {
    const pixelSize = value[0];
    const fontSizeKey = FONT_SIZE_REVERSE_MAP[pixelSize] || 'medium';
    setFontSize(fontSizeKey);
  };

  const handleLike = () => {
    toggleLike();
    toast.success(isLiked ? 'Like removed' : 'Story liked!');
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    addComment(profileData.displayName, commentText.trim());
    setCommentText('');
    toast.success('Comment added!');
  };

  const currentFontSizePixels = FONT_SIZE_MAP[fontSize];

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-muted-foreground">Story not found</p>
        <Button onClick={() => navigate({ to: '/' })}>Go Home</Button>
      </div>
    );
  }

  const content = story.languages[language];
  const coverUrl = getStoryCoverUrl(story);

  // Background color based on reading background preference
  const bgColorClass = {
    white: 'bg-white text-black',
    sepia: 'bg-[#f4ecd8] text-[#5c4a3a]',
    darkGrey: 'bg-[#2d2d2d] text-[#e0e0e0]',
    black: 'bg-black text-white',
  }[readingBackground] || 'bg-background text-foreground';

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 border-b bg-card shrink-0">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })} className={focusRing}>
          <ArrowLeft className={iconSizes.md} />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold truncate">{content.title}</h1>
          <p className="text-xs text-muted-foreground truncate">{story.author}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggleFavorite(story.id)}
          className={focusRing}
        >
          <Heart className={`${iconSizes.md} ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowControls(!showControls)}
          className={focusRing}
        >
          <BookOpen className={iconSizes.md} />
        </Button>
      </header>

      {/* Reading Controls */}
      {showControls && (
        <div className="px-4 py-3 border-b bg-card space-y-3 shrink-0">
          <div className="flex items-center gap-3">
            <Type className={iconSizes.sm} />
            <Slider
              value={[currentFontSizePixels]}
              onValueChange={handleFontSizeChange}
              min={14}
              max={22}
              step={4}
              className="flex-1"
            />
            <span className="text-sm w-12 text-right">{currentFontSizePixels}px</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant={readingBackground === 'white' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setReadingBackground('white')}
              className="text-xs"
            >
              White
            </Button>
            <Button
              variant={readingBackground === 'sepia' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setReadingBackground('sepia')}
              className="text-xs"
            >
              Sepia
            </Button>
            <Button
              variant={readingBackground === 'darkGrey' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setReadingBackground('darkGrey')}
              className="text-xs"
            >
              Grey
            </Button>
            <Button
              variant={readingBackground === 'black' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setReadingBackground('black')}
              className="text-xs"
            >
              Black
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              disabled={isSharing}
              className="flex-1"
            >
              <Share2 className={`${iconSizes.sm} mr-2`} />
              {isSharing ? 'Sharing...' : 'Share'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1"
            >
              <Download className={`${iconSizes.sm} mr-2`} />
              {isDownloading ? 'Loading...' : isOffline ? 'Remove' : 'Download'}
            </Button>
          </div>
        </div>
      )}

      {/* Story Content */}
      <div
        ref={contentRef}
        className={`flex-1 overflow-y-auto px-4 py-6 ${bgColorClass}`}
        style={{ fontSize: `${currentFontSizePixels}px` }}
      >
        <div className="max-w-2xl mx-auto">
          <img
            src={coverUrl}
            alt={content.title}
            className="w-full aspect-[3/4] object-cover rounded-lg mb-6"
            onError={(e) => {
              e.currentTarget.src = '/assets/generated/cover-default.dim_1200x1600.png';
            }}
          />
          <h1 className="text-3xl font-bold mb-2">{content.title}</h1>
          <p className="text-muted-foreground mb-6">By {story.author}</p>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {content.body.split('\n').map((paragraph, i) => (
              <p key={i} className="mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Social Actions */}
          <div className="mt-8 pt-6 border-t space-y-4">
            <div className="flex gap-3">
              <Button
                variant={isLiked ? 'default' : 'outline'}
                size="sm"
                onClick={handleLike}
                className="flex-1"
              >
                <ThumbsUp className={`${iconSizes.sm} mr-2 ${isLiked ? 'fill-current' : ''}`} />
                Like ({effectiveLikes})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowComments(!showComments)}
                className="flex-1"
              >
                <MessageCircle className={`${iconSizes.sm} mr-2`} />
                Comments ({comments.length})
              </Button>
            </div>

            {/* Comments Section */}
            {showComments && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment();
                      }
                    }}
                  />
                  <Button onClick={handleAddComment} disabled={!commentText.trim()}>
                    Post
                  </Button>
                </div>
                <div className="space-y-2">
                  {comments.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No comments yet. Be the first to comment!
                    </p>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="p-3 rounded-lg bg-muted">
                        <p className="text-sm font-semibold">{comment.author}</p>
                        <p className="text-sm mt-1">{comment.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(comment.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
