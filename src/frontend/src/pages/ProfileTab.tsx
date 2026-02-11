import { usePreferences } from '../context/PreferencesContext';
import { useAppUser } from '../hooks/useAppUser';
import { t } from '../lib/i18n';
import LoginButton from '../components/LoginButton';
import { Button } from '../components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { getEngagementData } from '../lib/engagement';
import { Badge } from '../components/ui/badge';
import { Flame, Award, Target } from 'lucide-react';

export default function ProfileTab() {
  const { language } = usePreferences();
  const { isAuthenticated } = useAppUser();
  const navigate = useNavigate();
  const engagement = getEngagementData();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('profile', language)}</h1>
        <LoginButton />
      </div>

      <div className="bg-card rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Flame className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-2xl font-bold">{engagement.streak}</p>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate({ to: '/premium' })}>
            {t('goPremium', language)}
          </Button>
        </div>

        {engagement.badges.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5" />
              <h3 className="font-semibold">Badges</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {engagement.badges.map((badge) => (
                <Badge key={badge} variant="secondary">
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5" />
            <h3 className="font-semibold">Reading Challenge</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Read 5 stories this week: {engagement.challengeProgress}/5
          </p>
        </div>
      </div>

      <div className="bg-card rounded-xl p-6">
        <h3 className="font-semibold mb-4">{t('settings', language)}</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('language', language)}</span>
            <span className="font-medium">{language.toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Account Status</span>
            <span className="font-medium">{isAuthenticated ? 'Signed In' : 'Guest'}</span>
          </div>
        </div>
      </div>

      <footer className="text-center text-sm text-muted-foreground py-6">
        <p>© {new Date().getFullYear()} Global Tales Universe</p>
        <p className="mt-2">
          Built with ❤️ using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              window.location.hostname
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
