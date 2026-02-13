import { MyStoryItem, isGuestDraft } from '../hooks/useMyStories';
import { usePreferences } from '../context/PreferencesContext';
import { t } from '../lib/i18n';
import { Clock, Image as ImageIcon } from 'lucide-react';
import { cardRadius, cardPadding, cardElevation, iconSizes } from '../lib/uiPolish';

interface MyStoryDraftCardProps {
  story: MyStoryItem;
}

export default function MyStoryDraftCard({ story }: MyStoryDraftCardProps) {
  const { language } = usePreferences();

  const createdAt = isGuestDraft(story)
    ? new Date(story.createdAt)
    : new Date(Number(story.createdAt) / 1_000_000);

  const hasImage = isGuestDraft(story) ? !!story.imageDataUrl : !!story.image;
  const imageUrl = isGuestDraft(story) ? story.imageDataUrl : story.image?.getDirectURL();

  const textPreview = story.text.slice(0, 150) + (story.text.length > 150 ? '...' : '');

  const timeAgo = getTimeAgo(createdAt, language);

  return (
    <div
      className={`${cardRadius.medium} ${cardPadding.default} bg-card ${cardElevation.low} cursor-pointer hover:shadow-lg transition-shadow`}
    >
      <div className="flex gap-4">
        {hasImage && imageUrl && (
          <img
            src={imageUrl}
            alt="Story"
            className={`w-24 h-24 object-cover ${cardRadius.small} shrink-0`}
          />
        )}
        {hasImage && !imageUrl && (
          <div className={`w-24 h-24 bg-muted ${cardRadius.small} shrink-0 flex items-center justify-center`}>
            <ImageIcon className={iconSizes.md} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm mb-2 line-clamp-3">{textPreview}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className={iconSizes.xs} />
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(date: Date, language: string): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));

  if (hours < 1) {
    return language === 'ta' ? `${minutes} நிமிடங்களுக்கு முன்` : 
           language === 'hi' ? `${minutes} मिनट पहले` :
           `${minutes} min ago`;
  }
  if (hours < 24) {
    return language === 'ta' ? `${hours} மணி நேரத்திற்கு முன்` :
           language === 'hi' ? `${hours} घंटे पहले` :
           `${hours}h ago`;
  }
  return date.toLocaleDateString();
}
