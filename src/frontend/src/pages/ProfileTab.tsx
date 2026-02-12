import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useUserProfile } from '../hooks/useUserProfile';
import { useAppUser } from '../hooks/useAppUser';
import { usePreferences } from '../context/PreferencesContext';
import { useNavigate } from '@tanstack/react-router';
import { t } from '../lib/i18n';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import PageLayout from '../components/PageLayout';
import UserAvatar from '../components/UserAvatar';
import PremiumBadge from '../components/PremiumBadge';
import { useMyStories } from '../hooks/useMyStories';
import MyStoryCard from '../components/MyStoryCard';
import { Plus, Crown, Flame, Award, Settings, LogOut, LogIn } from 'lucide-react';
import { iconSizes } from '../lib/uiPolish';
import { useState, useEffect } from 'react';
import { AppUser } from '../backend';

export default function ProfileTab() {
  const { identity, clear, login, loginStatus } = useInternetIdentity();
  const { profile, isLoading: profileLoading } = useUserProfile();
  const { userState, isPremium, isAuthenticated } = useAppUser();
  const { language } = usePreferences();
  const navigate = useNavigate();
  const { data: myStories = [], isLoading: storiesLoading, isError: storiesError } = useMyStories();

  const [profileData, setProfileData] = useState<{ name: string; image?: string } | null>(null);

  useEffect(() => {
    profile().then(setProfileData);
  }, [profile]);

  // Extract stats from userState
  const dailyStreak = isAuthenticated && userState && 'dailyStreak' in userState 
    ? Number((userState as AppUser).dailyStreak) 
    : 0;
  
  const badges = isAuthenticated && userState && 'badgeAchievements' in userState
    ? (userState as AppUser).badgeAchievements
    : [];

  const isLoading = profileLoading;

  const handleAuth = async () => {
    if (identity) {
      await clear();
    } else {
      await login();
    }
  };

  if (isLoading) {
    return (
      <PageLayout title={t('profile', language)}>
        <div className="space-y-4">
          <div className="h-32 bg-muted animate-pulse rounded-lg" />
          <div className="h-48 bg-muted animate-pulse rounded-lg" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={t('profile', language)}>
      <div className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <UserAvatar
                imageUrl={profileData?.image}
                name={profileData?.name || 'Guest'}
                size="large"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold">{profileData?.name || 'Guest'}</h2>
                  {isPremium && <PremiumBadge variant="compact" />}
                </div>
                <p className="text-sm text-muted-foreground">
                  {isAuthenticated ? 'Authenticated User' : 'Guest User'}
                </p>
              </div>
            </div>

            <Button
              onClick={handleAuth}
              variant={isAuthenticated ? 'outline' : 'default'}
              className="w-full"
              disabled={loginStatus === 'logging-in'}
            >
              {loginStatus === 'logging-in' ? (
                'Loading...'
              ) : isAuthenticated ? (
                <>
                  <LogOut className={`${iconSizes.sm} mr-2`} />
                  {t('logout', language)}
                </>
              ) : (
                <>
                  <LogIn className={`${iconSizes.sm} mr-2`} />
                  {t('login', language)}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Stats */}
        {isAuthenticated && (
          <Card>
            <CardHeader>
              <CardTitle>Your Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Flame className={`${iconSizes.lg} text-orange-500`} />
                  <div>
                    <p className="text-2xl font-bold">{dailyStreak}</p>
                    <p className="text-xs text-muted-foreground">Day Streak</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className={`${iconSizes.lg} text-yellow-500`} />
                  <div>
                    <p className="text-2xl font-bold">{badges.length}</p>
                    <p className="text-xs text-muted-foreground">Badges</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Premium CTA */}
        {!isPremium && (
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3 mb-4">
                <Crown className={`${iconSizes.lg} text-yellow-600 dark:text-yellow-500`} />
                <div>
                  <h3 className="font-bold mb-1">Go Premium</h3>
                  <p className="text-sm text-muted-foreground">
                    Unlock all stories, remove ads, and get exclusive features
                  </p>
                </div>
              </div>
              <Button onClick={() => navigate({ to: '/premium' })} className="w-full">
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        )}

        {/* My Stories */}
        {isAuthenticated && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>My Stories</CardTitle>
                <Button
                  size="sm"
                  onClick={() => navigate({ to: '/story/editor/$storyId', params: { storyId: 'new' } })}
                >
                  <Plus className={`${iconSizes.sm} mr-1`} />
                  Create
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {storiesLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : storiesError ? (
                <p className="text-center py-8 text-muted-foreground">
                  Coming soon
                </p>
              ) : myStories.length > 0 ? (
                <div className="space-y-3">
                  {myStories.map((story) => (
                    <MyStoryCard key={story.id.toString()} story={story} />
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  No stories yet. Create your first story!
                </p>
              )}
            </CardContent>
          </Card>
        )}

        <Separator />

        {/* Settings Links */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate({ to: '/privacy-policy' })}
          >
            Privacy Policy
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate({ to: '/terms-and-conditions' })}
          >
            Terms & Conditions
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate({ to: '/help-and-support' })}
          >
            Help & Support
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate({ to: '/about-us' })}
          >
            About Us
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
