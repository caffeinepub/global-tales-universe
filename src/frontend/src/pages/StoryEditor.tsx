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
          setCoverPreview(story.coverImageUrl);
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
          : coverPreview
        : coverPreview || 'https://via.placeholder.com/300x200?text=Story+Cover';

      await saveStory({
        id: storyId,
        title,
        category,
        language,
        content,
        summary,
        coverImageUrl: finalCoverUrl,
        readTimeMinutes: readTime,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      });

      toast.success(isEditMode ? 'Story updated successfully!' : 'Story added successfully!');
      navigate({ to: '/profile' });
    } catch (error: any) {
      console.error('Failed to save story:', error);
      toast.error(error.message || 'Failed to save story. Please try again.');
    }
  };

  const wordCount = countWords(content);
  const autoReadTime = calculateReadTime(wordCount);

  return (
    <RequireAuth>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/profile' })}
              className={focusRing}
            >
              <ArrowLeft className={`${iconSizes.sm} mr-2`} />
              Back
            </Button>
            <h1 className="text-xl font-bold">
              {isEditMode ? 'Edit Story' : 'Create Story'}
            </h1>
            <div className="w-20" />
          </div>
        </div>

        {/* Form */}
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Cover Image */}
          <div className={`bg-card ${cardRadius.medium} ${cardPadding.default} border ${cardElevation.low} space-y-4`}>
            <Label>Cover Image *</Label>
            {coverPreview ? (
              <div className="relative">
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className={`w-full h-64 object-cover ${cardRadius.small}`}
                  onError={(e) => {
                    e.currentTarget.src = '/assets/generated/cover-default.dim_1200x1600.png';
                  }}
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveCover}
                  className="absolute top-2 right-2"
                >
                  <X className={iconSizes.sm} />
                </Button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed ${cardRadius.small} p-12 text-center cursor-pointer hover:border-primary transition-colors ${focusRing}`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
              >
                <Upload className={`${iconSizes.lg} mx-auto mb-4 text-muted-foreground`} />
                <p className="text-sm text-muted-foreground">
                  Click to upload cover image (JPG/PNG, max 2MB)
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileSelect}
              className="hidden"
            />
            {errors.cover && <p className="text-xs text-destructive">{errors.cover}</p>}
          </div>

          {/* Basic Info */}
          <div className={`bg-card ${cardRadius.medium} ${cardPadding.default} border ${cardElevation.low} space-y-4`}>
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter story title"
                className={focusRing}
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category" className={focusRing}>
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
                {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language *</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language" className={focusRing}>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Brief summary of your story"
                rows={3}
                className={focusRing}
              />
            </div>
          </div>

          {/* Story Content */}
          <div className={`bg-card ${cardRadius.medium} ${cardPadding.default} border ${cardElevation.low} space-y-4`}>
            <div className="flex items-center justify-between">
              <Label htmlFor="content">Story Content *</Label>
              <div className="text-sm text-muted-foreground">
                {wordCount} words {wordCount < 400 && '(min 400)'} {wordCount > 2000 && '(max 2000)'}
              </div>
            </div>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your story here (400-2000 words)"
              rows={20}
              className={focusRing}
            />
            {errors.content && <p className="text-xs text-destructive">{errors.content}</p>}
          </div>

          {/* Read Time & Tags */}
          <div className={`bg-card ${cardRadius.medium} ${cardPadding.default} border ${cardElevation.low} space-y-4`}>
            <div className="space-y-2">
              <Label htmlFor="readTime">Read Time (minutes)</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="readTime"
                  type="number"
                  value={manualReadTime}
                  onChange={(e) => handleManualReadTimeChange(e.target.value)}
                  placeholder={`Auto: ${autoReadTime} min`}
                  className={`flex-1 ${focusRing}`}
                />
                <span className="text-sm text-muted-foreground">
                  {manualReadTime ? 'Manual' : `Auto: ${autoReadTime} min`}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (optional)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="adventure, magic, friendship (comma-separated)"
                className={focusRing}
              />
              <p className="text-xs text-muted-foreground">
                Add keywords to help readers find your story
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => navigate({ to: '/profile' })}
              className={`flex-1 ${focusRing}`}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSaving || isLoading}
              className={`flex-1 ${focusRing}`}
            >
              {isSaving ? 'Saving...' : isEditMode ? 'Update Story' : 'Publish Story'}
            </Button>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
