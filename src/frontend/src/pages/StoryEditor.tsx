import { useState, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { ArrowLeft, Upload, X, Smile } from 'lucide-react';
import { toast } from 'sonner';
import { useStoryEditor } from '../hooks/useStoryEditor';
import { usePreferences } from '../context/PreferencesContext';
import { t } from '../lib/i18n';
import { iconSizes, cardRadius, cardPadding } from '../lib/uiPolish';

const QUICK_EMOJIS = ['😊', '❤️', '😂', '🎉', '👍', '🔥', '✨', '🌟'];

export default function StoryEditor() {
  const navigate = useNavigate();
  const { language } = usePreferences();
  const { createStory, isCreating } = useStoryEditor();

  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast.error(t('invalidImageType', language));
      setError(t('invalidImageType', language));
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error(t('imageTooLarge', language));
      setError(t('imageTooLarge', language));
      return;
    }

    setError('');
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEmojiClick = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = text.slice(0, start) + emoji + text.slice(end);
    setText(newText);

    // Set cursor position after emoji
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      toast.error(t('storyTextRequired', language));
      setError(t('storyTextRequired', language));
      return;
    }

    setError('');

    try {
      await createStory({ text: text.trim(), image: image || undefined });
      toast.success(t('storyCreated', language));
      navigate({ to: '/my-stories' });
    } catch (error: any) {
      toast.error(error.message || t('failedToCreateStory', language));
      setError(error.message || t('failedToCreateStory', language));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/my-stories' })}>
          <ArrowLeft className={iconSizes.md} />
        </Button>
        <h1 className="text-lg font-semibold flex-1">
          {t('createStory', language)}
        </h1>
        <Button onClick={handleSubmit} disabled={isCreating}>
          {isCreating ? t('creating', language) : t('publish', language)}
        </Button>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Image Upload */}
        <div>
          <Label>{t('storyImage', language)} ({t('optional', language)})</Label>
          {imagePreview ? (
            <div className="relative mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className={`w-full aspect-video object-cover ${cardRadius.medium}`}
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={handleRemoveImage}
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
              <p className="text-sm text-muted-foreground">{t('clickToUpload', language)}</p>
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
        </div>

        {/* Text Content */}
        <div>
          <Label>{t('storyText', language)}</Label>
          <Textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('writeYourStory', language)}
            className="mt-2 min-h-[300px]"
          />
          <div className="flex justify-between items-center text-sm text-muted-foreground mt-1">
            <span>{text.length} {t('characters', language)}</span>
          </div>
        </div>

        {/* Quick Emoji Insert */}
        <div>
          <Label className="flex items-center gap-2">
            <Smile className={iconSizes.sm} />
            {t('quickEmojis', language)}
          </Label>
          <div className="flex gap-2 mt-2 flex-wrap">
            {QUICK_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleEmojiClick(emoji)}
                className={`text-2xl ${cardPadding.compact} ${cardRadius.small} bg-muted hover:bg-accent transition-colors`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    </div>
  );
}
