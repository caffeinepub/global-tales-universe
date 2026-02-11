import { useParams } from '@tanstack/react-router';
import { usePreferences } from '../context/PreferencesContext';
import { useStories } from '../hooks/useStories';
import { uiLangToBackendLang } from '../lib/storyLanguage';
import { translateCategory, t } from '../lib/i18n';
import StoryCard from '../components/StoryCard';
import ModeToggle from '../components/ModeToggle';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '../components/ui/button';

export default function CategoryDetail() {
  const { categoryId } = useParams({ from: '/categories/$categoryId' });
  const navigate = useNavigate();
  const { language, mode } = usePreferences();
  const backendLang = uiLangToBackendLang(language);
  const { data: stories, isLoading } = useStories(
    backendLang,
    true,
    categoryId,
    mode === 'kids' ? true : undefined
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/categories' })}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold flex-1">{translateCategory(categoryId, language)}</h1>
      </div>

      <div className="mb-6">
        <ModeToggle />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : stories && stories.length > 0 ? (
        <div className="space-y-2">
          {stories.map((story) => (
            <StoryCard key={story.id.toString()} story={story} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          {t('noResults', language)}
        </div>
      )}
    </div>
  );
}
