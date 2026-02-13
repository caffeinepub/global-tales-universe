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
import { useMyStories } from '../hooks/useMyStories';
import MyStoryCard from '../components/MyStoryCard';
import { Plus, Crown, Flame, Award, Settings, LogOut, LogIn, Edit2, Save, X } from 'lucide-react';
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
  const { data: myStories = [], isLoading: storiesLoading, isError: storiesError } = useMyStories();

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
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-xl font-bold">{profileData.displayName}</h2>
                      {isPremium && <PremiumBadge variant="compact" />}
                    </div>
                    <p className="text-sm text-muted-foreground">@{profileData.username}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {isAuthenticated ? 'Authenticated User' : 'Guest User'}
                    </p>
                  </>
                )}
              </div>
            </div>

            {isEditing ? (
              <div className="flex gap-2">
                <Button onClick={handleEditSave} disabled={isSaving} className="flex-1">
                  <Save className={`${iconSizes.sm} mr-2`} />
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
                <Button onClick={handleEditCancel} variant="outline" className="flex-1">
                  <X className={`${iconSizes.sm} mr-2`} />
                  Cancel
                </Button>
              </div>
            ) : (
              <>
                <Button onClick={handleEditStart} variant="outline" className="w-full mb-2">
                  <Edit2 className={`${iconSizes.sm} mr-2`} />
                  Edit Profile
                </Button>
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
              </>
            )}
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
              <div className="flex items-center gap-2 mb-3">
                <Crown className={`${iconSizes.lg} text-yellow-600 dark:text-yellow-500`} />
                <h3 className="text-lg font-bold">Go Premium</h3>
              </div>
              <p className="text-sm mb-4 text-muted-foreground">
                Unlock ad-free reading, exclusive stories, and more!
              </p>
              <Button
                onClick={() => handleNavigate('/premium')}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              >
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
                  onClick={() => handleNavigate('/story/editor/new')}
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
                    <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : myStories.length > 0 ? (
                <div className="space-y-3">
                  {myStories.map((story) => (
                    <MyStoryCard key={story.id.toString()} story={story} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="mb-4">You haven't created any stories yet.</p>
                  <Button
                    variant="outline"
                    onClick={() => handleNavigate('/story/editor/new')}
                  >
                    <Plus className={`${iconSizes.sm} mr-2`} />
                    Create Your First Story
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleNavigate('/privacy-policy')}
            >
              Privacy Policy
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleNavigate('/terms-and-conditions')}
            >
              Terms & Conditions
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleNavigate('/help-and-support')}
            >
              Help & Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
