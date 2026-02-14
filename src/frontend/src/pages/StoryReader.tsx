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
  const [imgError, setImgError] = useState(false);
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
  const fallbackCover = '/assets/generated/cover-default.dim_1200x1600.png';

  return (
    <div className={`min-h-screen ${bgColorClasses[bgColor]}`}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: '/' })}
            className={focusRing}
          >
            <ArrowLeft className={iconSizes.md} />
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              disabled={isSharing}
              className={focusRing}
            >
              <Share2 className={iconSizes.md} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
              disabled={isDownloading}
              className={focusRing}
            >
              <Download className={iconSizes.md} />
            </Button>
          </div>
        </div>
      </div>

      {/* Story Content */}
      <div
        ref={contentRef}
        className="container max-w-4xl mx-auto px-4 py-8 overflow-y-auto"
        style={{ maxHeight: 'calc(100vh - 140px)' }}
      >
        {/* Cover Image */}
        <img
          src={imgError ? fallbackCover : coverUrl}
          alt={content.title}
          onError={() => setImgError(true)}
          className={`w-full max-w-md mx-auto h-auto object-cover ${cardRadius.large} mb-6`}
        />

        {/* Title and Metadata */}
        <h1 className="text-3xl font-bold mb-2">{content.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span>By {story.author}</span>
          <span>•</span>
          <span>{Number(story.readTimeMinutes)} min read</span>
        </div>

        {/* Summary */}
        <p className="text-lg text-muted-foreground mb-6 italic">{content.summary}</p>

        <Separator className="my-6" />

        {/* Reading Controls */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm">Font:</span>
            <Button
              variant={fontSize === 'small' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFontSize('small')}
            >
              A
            </Button>
            <Button
              variant={fontSize === 'medium' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFontSize('medium')}
            >
              A
            </Button>
            <Button
              variant={fontSize === 'large' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFontSize('large')}
            >
              A
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Theme:</span>
            <Button
              variant={bgColor === 'white' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setBgColor('white')}
            >
              Light
            </Button>
            <Button
              variant={bgColor === 'sepia' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setBgColor('sepia')}
            >
              Sepia
            </Button>
            <Button
              variant={bgColor === 'dark' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setBgColor('dark')}
            >
              Dark
            </Button>
          </div>
        </div>

        {/* Story Body */}
        <div className={`prose prose-lg max-w-none mb-8 ${fontSizeClasses[fontSize]}`}>
          <p className="whitespace-pre-wrap leading-relaxed">{content.body}</p>
        </div>

        <Separator className="my-8" />

        {/* Social Actions */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant={isLiked ? 'default' : 'outline'}
            onClick={toggleLike}
            className="gap-2"
          >
            <Heart
              className={iconSizes.sm}
              fill={isLiked ? 'currentColor' : 'none'}
            />
            {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowComments(!showComments)}
            className="gap-2"
          >
            <MessageCircle className={iconSizes.sm} />
            {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Comments</h3>
              
              {/* Add Comment */}
              <div className="mb-6">
                <Textarea
                  placeholder="Share your thoughts..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mb-2"
                />
                <Button onClick={handleAddComment} disabled={!newComment.trim()} className="gap-2">
                  <Send className={iconSizes.sm} />
                  Post Comment
                </Button>
              </div>

              {/* Comments List */}
              {comments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No comments yet. Be the first to share your thoughts!
                </p>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border-l-2 border-primary pl-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
