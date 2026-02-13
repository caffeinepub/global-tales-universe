import { useParams, useNavigate } from '@tanstack/react-router';
import { usePreferences } from '../context/PreferencesContext';
import { useGetStoriesByCategory } from '../hooks/useStories';
import { translateCategory, t } from '../lib/i18n';
import { decodeCategoryId } from '../lib/urlParams';
import StoryCard from '../components/StoryCard';
import ModeToggle from '../components/ModeToggle';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

// Safe category ID decoder
function safeDecodeCategoryId(encodedId: string): string | null {
  try {
    return decodeCategoryId(encodedId);
  } catch {
    return null;
  }
}

export default function CategoryDetail() {
  const { categoryId: encodedCategoryId } = useParams({ from: '/categories/$categoryId' });
  const navigate = useNavigate();
  const { language, mode } = usePreferences();
  
  // Safely decode the category ID from URL
  const categoryId = safeDecodeCategoryId(encodedCategoryId);
  
  // All hooks must be called before any conditional returns
  // Pass empty string as fallback to avoid conditional hook call
  const { data: stories = [], isLoading } = useGetStoriesByCategory(categoryId || '');
  
  // Now we can do conditional returns after all hooks are called
  if (categoryId === null) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <h1 className="text-2xl font-bold mb-2">Invalid Category</h1>
            <p className="text-muted-foreground mb-6">
              The category link is not valid. Please try selecting a category from the main page.
            </p>
            <div className="flex gap-2">
              <Button onClick={() => navigate({ to: '/categories' })} className="flex-1">
                View Categories
              </Button>
              <Button onClick={() => navigate({ to: '/' })} variant="outline" className="flex-1">
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Limit to 5-10 stories per category display
  const displayStories = stories.slice(0, 10);

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
      ) : displayStories.length > 0 ? (
        <div className="space-y-2">
          {displayStories.map((story) => (
            <StoryCard key={story.id.toString()} story={story} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          No stories available in this category yet.
        </div>
      )}
    </div>
  );
}
