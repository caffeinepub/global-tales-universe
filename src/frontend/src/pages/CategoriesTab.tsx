import { useNavigate } from '@tanstack/react-router';
import { usePreferences } from '../context/PreferencesContext';
import { getFilteredCategories } from '../lib/kidsMode';
import { translateCategory, t } from '../lib/i18n';
import { getCoverUrl } from '../lib/covers';

export default function CategoriesTab() {
  const navigate = useNavigate();
  const { language, mode } = usePreferences();
  const categories = getFilteredCategories(mode === 'kids');

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">{t('categories', language)}</h1>
      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => {
          const coverUrl = getCoverUrl(category, mode === 'kids');
          return (
            <div
              key={category}
              onClick={() => navigate({ to: '/categories/$categoryId', params: { categoryId: category } })}
              className="relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-105 shadow-md"
            >
              <img src={coverUrl} alt={category} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold text-lg">
                  {translateCategory(category, language)}
                </h3>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
