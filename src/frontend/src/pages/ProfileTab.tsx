import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useUserProfile } from '../hooks/useUserProfile';
import { useAppUser } from '../hooks/useAppUser';
import { usePreferences } from '../context/PreferencesContext';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useState } from 'react';
import { t } from '../lib/i18n';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import PageLayout from '../components/PageLayout';
import UserAvatar from '../components/UserAvatar';
import PremiumBadge from '../components/PremiumBadge';
import { useMyStories, isGuestDraft } from '../hooks/useMyStories';
import MyStoryDraftCard from '../components/MyStoryDraftCard';
import { Plus, Crown, Flame, Award, Settings, LogOut, LogIn, Edit2, Save, X, BookOpen } from 'lucide-react';
import { iconSizes } from '../lib/uiPolish';
import { AppUser } from '../backend';
import { logOnce } from '../lib/logOnce';
import { toast } from 'sonner';

export default function ProfileTab() {
  const { identity, clear, login, loginStatus } = useInternetIdentity();
  const { profileData, saveProfile, isLoading: profileLoading, isSaving } = useUserProfile();
  const { userState, isPremium, isAuthenticated } = useAppUser();
  const { language } = usePreferences();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const currentSearch = routerState.location.search;
  const { data: myStories = [], isLoading: storiesLoading } = useMyStories();

  const [isEditing, setIsEditing] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editUsername, setEditUsername] = useState('');

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

  const handleNavigate = (path: string) => {
    try {
      navigate({ to: path as any });
    } catch (error) {
      const logKey = `profile-nav-${path}-${currentPath}`;
      logOnce(
        logKey,
        `ProfileTab navigation failed: attempted="${path}" current="${currentPath}${currentSearch}" error="${error}"`,
        'error'
      );
      navigate({ to: '/' });
    }
  };

  const handleEditStart = () => {
    setEditDisplayName(profileData.displayName);
    setEditUsername(profileData.username);
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditDisplayName('');
    setEditUsername('');
  };

  const handleEditSave = async () => {
    if (!editDisplayName.trim() || !editUsername.trim()) {
      toast.error('Name and username cannot be empty');
      return;
    }
    try {
      await saveProfile({
        displayName: editDisplayName.trim(),
        username: editUsername.trim(),
      });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
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
                imageUrl={profileData.image}
                name={profileData.displayName}
                size="large"
              />
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="displayName" className="text-xs">Display Name</Label>
                      <Input
                        id="displayName"
                        value={editDisplayName}
                        onChange={(e) => setEditDisplayName(e.target.value)}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="username" className="text-xs">Username</Label>
                      <Input
                        id="username"
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                        placeholder="username"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      {profileData.displayName}
                      {isPremium && <PremiumBadge variant="compact" />}
                    </h2>
                    <p className="text-sm text-muted-foreground">@{profileData.username}</p>
                  </>
                )}
              </div>
              {isEditing ? (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleEditCancel}
                  >
                    <X className={iconSizes.sm} />
                  </Button>
                  <Button
                    variant="default"
                    size="icon"
                    onClick={handleEditSave}
                    disabled={isSaving}
                  >
                    <Save className={iconSizes.sm} />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleEditStart}
                >
                  <Edit2 className={iconSizes.sm} />
                </Button>
              )}
            </div>

            {/* Stats */}
            {isAuthenticated && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Flame className={`${iconSizes.sm} text-orange-500`} />
                    <span className="text-2xl font-bold">{dailyStreak}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Day Streak</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Award className={`${iconSizes.sm} text-yellow-500`} />
                    <span className="text-2xl font-bold">{badges.length}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Badges</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <BookOpen className={`${iconSizes.sm} text-blue-500`} />
                    <span className="text-2xl font-bold">{myStories.length}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{t('myStories', language)}</p>
                </div>
              </div>
            )}

            <Separator className="my-4" />

            {/* Auth Button */}
            <Button
              onClick={handleAuth}
              disabled={loginStatus === 'logging-in'}
              variant={identity ? 'outline' : 'default'}
              className="w-full"
            >
              {identity ? (
                <>
                  <LogOut className={iconSizes.sm} />
                  {t('logout', language)}
                </>
              ) : (
                <>
                  <LogIn className={iconSizes.sm} />
                  {t('login', language)}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Premium CTA */}
        {!isPremium && (
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Crown className={`${iconSizes.md} text-yellow-600 dark:text-yellow-500`} />
                <h3 className="font-bold">{t('goPremium', language)}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Unlock exclusive features and ad-free experience
              </p>
              <Button
                onClick={() => handleNavigate('/premium')}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              >
                {t('goPremium', language)}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* My Stories Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('myStories', language)}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigate('/my-stories')}
              >
                {t('viewAll', language)}
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
            ) : myStories.length > 0 ? (
              <div className="space-y-3">
                {myStories.slice(0, 3).map((story) => (
                  <MyStoryDraftCard
                    key={isGuestDraft(story) ? story.id : story.id.toString()}
                    story={story}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className={`${iconSizes.lg} text-muted-foreground mx-auto mb-2`} />
                <p className="text-sm text-muted-foreground mb-3">{t('noStoriesYet', language)}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleNavigate('/story-editor')}
                >
                  <Plus className={iconSizes.sm} />
                  {t('createStory', language)}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardContent className="pt-6">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleNavigate('/help-and-support')}
            >
              <Settings className={iconSizes.md} />
              {t('settings', language)}
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
