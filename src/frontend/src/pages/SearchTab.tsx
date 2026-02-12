import { useState } from 'react';
import { usePreferences } from '../context/PreferencesContext';
import { useStories } from '../hooks/useStories';
import { uiLangToBackendLang } from '../lib/storyLanguage';
import { getStoryContent } from '../lib/storyLanguage';
import { t } from '../lib/i18n';
import { Input } from '../components/ui/input';
import { Search } from 'lucide-react';
import StoryCard from '../components/StoryCard';
import StoryCardSkeleton from '../components/StoryCardSkeleton';
import PageLayout from '../components/PageLayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { iconSizes } from '../lib/uiPolish';

export default function SearchTab() {
  const { language } = usePreferences();
  const backendLang = uiLangToBackendLang(language);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');
  const { data: allStories, isLoading } = useStories(backendLang, sortBy === 'popular');

  const filteredStories = allStories?.filter((story) => {
    if (!query) return true;
    const content = getStoryContent(story, language);
    const searchText = `${content.title} ${content.body} ${story.author}`.toLowerCase();
    return searchText.includes(query.toLowerCase());
  });

  return (
    <PageLayout title={t('search', language)}>
      <div className="space-y-4">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconSizes.sm} text-muted-foreground`} />
          <Input
            placeholder={t('searchPlaceholder', language)}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={sortBy} onValueChange={(val) => setSortBy(val as any)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <StoryCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredStories && filteredStories.length > 0 ? (
          <div className="space-y-4">
            {filteredStories.map((story) => (
              <StoryCard key={story.id.toString()} story={story} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {t('noResults', language)}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
