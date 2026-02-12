import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { useStoryEditor } from '../hooks/useStoryEditor';
import { iconSizes, cardRadius, cardPadding, cardElevation, focusRing } from '../lib/uiPolish';
import { calculateReadTime, countWords, validateStoryForm } from '../lib/storyDraft';
import RequireAuth from '../components/RequireAuth';
import { getStoryCoverUrl } from '../hooks/useStories';

const CATEGORIES = [
  'Romance',
  'Horror',
  'Thriller',
  'Comedy',
  'Kids Fairy Tales',
  'Motivational',
  'Adventure',
  'Mystery',
  'Fantasy',
  'Science Fiction',
];

const LANGUAGES = [
  { value: 'english', label: 'English' },
  { value: 'tamil', label: 'Tamil' },
  { value: 'hindi', label: 'Hindi' },
];

export default function StoryEditor() {
  const navigate = useNavigate();
  const params = useParams({ from: '/story/editor/$storyId' });
  const storyId = params?.storyId ? BigInt(params.storyId) : null;
  const isEditMode = !!storyId;

  const { loadStory, saveStory, isLoading, isSaving } = useStoryEditor();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [language, setLanguage] = useState('english');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [coverImage, setCoverImage] = useState<File | string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [readTime, setReadTime] = useState<number>(0);
  const [manualReadTime, setManualReadTime] = useState<string>('');
  const [tags, setTags] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load story for edit mode
  useEffect(() => {
    if (isEditMode && storyId) {
      loadStory(storyId).then((story) => {
        if (story) {
          const langContent = story.languages[language as keyof typeof story.languages];
          setTitle(langContent.title);
          setContent(langContent.body);
          setSummary(langContent.summary);
          setCategory(story.category);
          // Get cover URL from story
          const coverUrl = getStoryCoverUrl(story);
          setCoverPreview(coverUrl);
          setReadTime(Number(story.readTimeMinutes));
          setManualReadTime(String(story.readTimeMinutes));
        }
      });
    }
  }, [isEditMode, storyId, language, loadStory]);

  // Auto-calculate read time
  useEffect(() => {
    if (!manualReadTime) {
      const words = countWords(content);
      const calculated = calculateReadTime(words);
      setReadTime(calculated);
    }
  }, [content, manualReadTime]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast.error('Please upload a JPG or PNG image');
      setErrors({ ...errors, cover: 'Invalid file type' });
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      setErrors({ ...errors, cover: 'File too large' });
      return;
    }

    setErrors({ ...errors, cover: '' });
    setCoverImage(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleRemoveCover = () => {
    setCoverImage(null);
    setCoverPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleManualReadTimeChange = (value: string) => {
    setManualReadTime(value);
    const num = parseInt(value);
    if (!isNaN(num) && num > 0) {
      setReadTime(num);
    }
  };

  const handleSubmit = async () => {
    const validation = validateStoryForm({
      title,
      category,
      content,
      summary,
      coverImage: coverImage || coverPreview,
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      toast.error('Please fix the errors before publishing');
      return;
    }

    setErrors({});

    try {
      const finalCoverUrl = coverImage
        ? typeof coverImage === 'string'
          ? coverImage
          : URL.createObjectURL(coverImage)
        : coverPreview;

      await saveStory({
        title,
        category,
        content,
        summary,
        coverUrl: finalCoverUrl,
        readTime,
        language,
      });

      toast.success(isEditMode ? 'Story updated!' : 'Story published!');
      navigate({ to: '/profile' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to save story');
    }
  };

  return (
    <RequireAuth>
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/profile' })}>
            <ArrowLeft className={iconSizes.md} />
          </Button>
          <h1 className="text-lg font-semibold flex-1">
            {isEditMode ? 'Edit Story' : 'Create Story'}
          </h1>
          <Button onClick={handleSubmit} disabled={isSaving || isLoading}>
            {isSaving ? 'Saving...' : 'Publish'}
          </Button>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          {/* Cover Image */}
          <div>
            <Label>Cover Image</Label>
            {coverPreview ? (
              <div className="relative mt-2">
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className={`w-full aspect-[3/4] object-cover ${cardRadius.medium}`}
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveCover}
                >
                  <X className={iconSizes.sm} />
                </Button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`mt-2 border-2 border-dashed ${cardRadius.medium} p-8 text-center cursor-pointer hover:border-primary transition-colors`}
              >
                <Upload className={`${iconSizes.lg} mx-auto mb-2 text-muted-foreground`} />
                <p className="text-sm text-muted-foreground">Click to upload cover image</p>
                <p className="text-xs text-muted-foreground mt-1">JPG or PNG, max 2MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={handleFileSelect}
            />
            {errors.cover && <p className="text-sm text-destructive mt-1">{errors.cover}</p>}
          </div>

          {/* Language */}
          <div>
            <Label>Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div>
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter story title"
              className="mt-2"
            />
            {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
          </div>

          {/* Category */}
          <div>
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-destructive mt-1">{errors.category}</p>}
          </div>

          {/* Summary */}
          <div>
            <Label>Summary</Label>
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief summary of your story"
              className="mt-2"
              rows={3}
            />
            {errors.summary && <p className="text-sm text-destructive mt-1">{errors.summary}</p>}
          </div>

          {/* Content */}
          <div>
            <Label>Story Content</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your story here..."
              className="mt-2 min-h-[400px]"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>{countWords(content)} words</span>
              <span>{readTime} min read</span>
            </div>
            {errors.content && <p className="text-sm text-destructive mt-1">{errors.content}</p>}
          </div>

          {/* Manual Read Time */}
          <div>
            <Label>Read Time (minutes) - Optional</Label>
            <Input
              type="number"
              value={manualReadTime}
              onChange={(e) => handleManualReadTimeChange(e.target.value)}
              placeholder="Auto-calculated"
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leave empty for automatic calculation
            </p>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
