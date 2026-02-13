import { useParams, useNavigate } from '@tanstack/react-router';
import { useState, useEffect, useRef } from 'react';
import { useGetStoryById } from '../hooks/useStories';
import { usePreferences } from '../context/PreferencesContext';
import { useReadingHistory } from '../hooks/useReadingHistory';
import { useOfflineDownloads } from '../hooks/useOfflineDownloads';
import { useStorySocial } from '../hooks/useStorySocial';
import { getStoryContent } from '../lib/storyLanguage';
import { getStoryCoverUrl } from '../hooks/useStories';
import { shareStory, ShareResult } from '../lib/share';
import { ArrowLeft, Download, Share2, Heart, MessageCircle, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { iconSizes, cardRadius, focusRing } from '../lib/uiPolish';
import { toast } from 'sonner';
import { useUserProfile } from '../hooks/useUserProfile';
import { getStorySocialData } from '../lib/storySocialStorage';

// Safe BigInt parser
function parseBigIntSafe(value: string): bigint | null {
  try {
    const num = BigInt(value);
    if (num < 0n) return null;
    return num;
  } catch {
    return null;
  }
}

export default function StoryReader() {
  const { storyId: storyIdParam } = useParams({ from: '/story/$storyId' });
  const navigate = useNavigate();
  const { language } = usePreferences();
  const { profileData } = useUserProfile();
  const { addToHistory, updateProgress } = useReadingHistory();
  const { isDownloaded, downloadStory, removeDownload } = useOfflineDownloads();
  
  // Safe parsing of storyId
  const storyId = parseBigIntSafe(storyIdParam);
  
  // All hooks must be called before any conditional returns
  const { data: story, isLoading, isError } = useGetStoryById(storyId);
  const { 
    likeOverlay,
    toggleLike, 
    comments, 
    addComment 
  } = useStorySocial(storyIdParam);

  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [bgColor, setBgColor] = useState<'white' | 'sepia' | 'dark'>('white');
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Calculate effective like count and isLiked state
  const socialData = getStorySocialData(storyIdParam);
  const baseLikes = story ? Number(story.likes) : 0;
  const likeCount = baseLikes + likeOverlay;
  const isLiked = likeOverlay > 0;

  // Track reading progress
  useEffect(() => {
    if (!story || !contentRef.current || storyId === null) return;

    const handleScroll = () => {
      if (!contentRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const progress = Math.min(100, Math.round((scrollTop / (scrollHeight - clientHeight)) * 100));
      
      if (progress > 0 && storyId !== null) {
        updateProgress(storyId, progress);
      }
    };

    const container = contentRef.current;
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [story, storyId, updateProgress]);

  // Add to reading history on mount
  useEffect(() => {
    if (story && storyId !== null) {
      addToHistory(storyId);
    }
  }, [story, storyId, addToHistory]);

  // Now we can do conditional returns after all hooks are called
  if (storyId === null) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <h1 className="text-2xl font-bold mb-2">Invalid Story</h1>
            <p className="text-muted-foreground mb-6">
              The story ID is not valid. Please check the link and try again.
            </p>
            <Button onClick={() => navigate({ to: '/' })} className="w-full">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleShare = async () => {
    if (!story) return;
    setIsSharing(true);
    try {
      const content = getStoryContent(story, language);
      const result: ShareResult = await shareStory(storyIdParam, content.title, content.summary);
      
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
      if (isDownloaded(storyId)) {
        await removeDownload(storyId);
        toast.success('Story removed from offline storage');
      } else {
        await downloadStory(story);
        toast.success('Story saved for offline reading');
      }
    } catch (error) {
      toast.error('Failed to manage offline story');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    addComment(profileData.displayName, newComment.trim());
    
    setNewComment('');
    toast.success('Comment added!');
  };

  const fontSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  const bgColorClasses = {
    white: 'bg-background text-foreground',
    sepia: 'bg-amber-50 text-amber-950 dark:bg-amber-950/20 dark:text-amber-50',
    dark: 'bg-gray-900 text-gray-100',
  };

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
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <h1 className="text-2xl font-bold mb-2">Story Not Found</h1>
            <p className="text-muted-foreground mb-6">
              We couldn't find the story you're looking for. It may have been removed or doesn't exist.
            </p>
            <Button onClick={() => navigate({ to: '/' })} className="w-full">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const content = getStoryContent(story, language);
  const coverUrl = getStoryCoverUrl(story);

  return (
    <div className={`min-h-screen ${bgColorClasses[bgColor]}`}>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/95 backdrop-blur border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: '/' })}
            className={focusRing}
          >
            <ArrowLeft className={iconSizes.md} />
          </Button>
          
          <div className="flex items-center gap-2">
            {/* Font Size Control */}
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <button
                onClick={() => setFontSize('small')}
                className={`px-2 py-1 rounded text-xs ${fontSize === 'small' ? 'bg-primary text-primary-foreground' : ''}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('medium')}
                className={`px-2 py-1 rounded text-sm ${fontSize === 'medium' ? 'bg-primary text-primary-foreground' : ''}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 rounded text-base ${fontSize === 'large' ? 'bg-primary text-primary-foreground' : ''}`}
              >
                A
              </button>
            </div>

            {/* Background Color Control */}
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <button
                onClick={() => setBgColor('white')}
                className={`w-6 h-6 rounded bg-white border ${bgColor === 'white' ? 'ring-2 ring-primary' : ''}`}
              />
              <button
                onClick={() => setBgColor('sepia')}
                className={`w-6 h-6 rounded bg-amber-100 border ${bgColor === 'sepia' ? 'ring-2 ring-primary' : ''}`}
              />
              <button
                onClick={() => setBgColor('dark')}
                className={`w-6 h-6 rounded bg-gray-900 border ${bgColor === 'dark' ? 'ring-2 ring-primary' : ''}`}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div ref={contentRef} className="overflow-auto h-[calc(100vh-60px)]">
        <article className="max-w-3xl mx-auto px-4 py-8">
          {/* Cover Image */}
          <img
            src={coverUrl}
            alt={content.title}
            className={`w-full max-w-md mx-auto aspect-[3/4] object-cover ${cardRadius.medium} mb-6`}
            onError={(e) => {
              e.currentTarget.src = '/assets/generated/cover-default.dim_1200x1600.png';
            }}
          />

          {/* Title & Meta */}
          <h1 className="text-3xl font-bold mb-2">{content.title}</h1>
          <p className="text-muted-foreground mb-4">
            By {story.author} • {Number(story.readTimeMinutes)} min read
          </p>

          {/* Social Actions */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={toggleLike}
              className="flex items-center gap-2 hover:text-red-500 transition-colors"
            >
              <Heart className={`${iconSizes.md} ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              <span className="text-sm font-medium">{likeCount}</span>
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <MessageCircle className={iconSizes.md} />
              <span className="text-sm font-medium">{comments.length}</span>
            </button>
            <button
              onClick={handleShare}
              disabled={isSharing}
              className="flex items-center gap-2 hover:text-primary transition-colors disabled:opacity-50"
            >
              <Share2 className={iconSizes.md} />
              <span className="text-sm font-medium">Share</span>
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-2 hover:text-primary transition-colors disabled:opacity-50"
            >
              <Download className={`${iconSizes.md} ${isDownloaded(storyId) ? 'fill-primary' : ''}`} />
              <span className="text-sm font-medium">
                {isDownloaded(storyId) ? 'Downloaded' : 'Download'}
              </span>
            </button>
          </div>

          <Separator className="mb-6" />

          {/* Story Body */}
          <div className={`prose prose-lg max-w-none ${fontSizeClasses[fontSize]}`}>
            {content.body.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Comments ({comments.length})</h2>
              
              {/* Add Comment */}
              <div className="mb-6">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="mb-2"
                  rows={3}
                />
                <Button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  size="sm"
                >
                  <Send className={`${iconSizes.sm} mr-2`} />
                  Post Comment
                </Button>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No comments yet. Be the first to share your thoughts!
                  </p>
                ) : (
                  comments.map((comment, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <p className="font-semibold text-sm mb-1">{comment.author}</p>
                        <p className="text-sm text-muted-foreground mb-2">
                          {new Date(comment.timestamp).toLocaleDateString()}
                        </p>
                        <p className="text-sm">{comment.text}</p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
