import { useState } from 'react';
import { usePreferences } from '../context/PreferencesContext';
import { useStories } from '../hooks/useStories';
import { uiLangToBackendLang } from '../lib/storyLanguage';
import { getStoryContent } from '../lib/storyLanguage';
import { t } from '../lib/i18n';
import { Input } from '../components/ui/input';
import { Search } from 'lucide-react';
import StoryCard from '../components/StoryCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

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
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">{t('search', language)}</h1>

      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : filteredStories && filteredStories.length > 0 ? (
        <div className="space-y-2">
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
  );
}
