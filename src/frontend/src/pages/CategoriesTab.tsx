import { useNavigate } from '@tanstack/react-router';
import { usePreferences } from '../context/PreferencesContext';
import { getFilteredCategories } from '../lib/kidsMode';
import { translateCategory, t } from '../lib/i18n';
import { getCoverUrl } from '../lib/covers';
import PageLayout from '../components/PageLayout';
import { cardRadius, cardElevation, transitions, focusRing } from '../lib/uiPolish';

export default function CategoriesTab() {
  const navigate = useNavigate();
  const { language, mode } = usePreferences();
  const categories = getFilteredCategories(mode === 'kids');

  return (
    <PageLayout title={t('categories', language)}>
      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => {
          const coverUrl = getCoverUrl(category, mode === 'kids');
          return (
            <div
              key={category}
              onClick={() => navigate({ to: '/categories/$categoryId', params: { categoryId: category } })}
              className={`relative aspect-[3/4] ${cardRadius.medium} overflow-hidden cursor-pointer hover:scale-105 motion-reduce:hover:scale-100 ${transitions.transform} ${cardElevation.medium} ${focusRing}`}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate({ to: '/categories/$categoryId', params: { categoryId: category } });
                }
              }}
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
    </PageLayout>
  );
}
