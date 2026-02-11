import { useNavigate } from '@tanstack/react-router';
import { usePreferences } from '../context/PreferencesContext';
import { translateCategory } from '../lib/i18n';
import { getFilteredCategories } from '../lib/kidsMode';
import { ScrollArea, ScrollBar } from './ui/scroll-area';

export default function CategoryScroller() {
  const navigate = useNavigate();
  const { language, mode } = usePreferences();
  const categories = getFilteredCategories(mode === 'kids');

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 p-1">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => navigate({ to: '/categories/$categoryId', params: { categoryId: category } })}
            className="px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 text-sm font-medium transition-colors shrink-0"
          >
            {translateCategory(category, language)}
          </button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
