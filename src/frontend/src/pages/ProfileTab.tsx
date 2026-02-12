import { usePreferences } from '../context/PreferencesContext';
import { useAppUser } from '../hooks/useAppUser';
import { useUserProfile } from '../hooks/useUserProfile';
import { useMyStories } from '../hooks/useMyStories';
import { t } from '../lib/i18n';
import LoginButton from '../components/LoginButton';
import UserAvatar from '../components/UserAvatar';
import PremiumBadge from '../components/PremiumBadge';
import MyStoryCard from '../components/MyStoryCard';
import PageLayout from '../components/PageLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useNavigate } from '@tanstack/react-router';
import { getEngagementData } from '../lib/engagement';
import { Badge } from '../components/ui/badge';
import { Flame, Award, Target, Upload, Crown, Share2, Bell, BellOff, AlertCircle, Copy, ExternalLink, Plus } from 'lucide-react';
import { Separator } from '../components/ui/separator';
import { Switch } from '../components/ui/switch';
import { useState, useEffect, useRef } from 'react';
import { validateUsername, validateImageFile, validateImageUrl } from '../lib/profileValidation';
import { toast } from 'sonner';
import { shareApp, getAppUrl, copyToClipboard, ShareResult } from '../lib/share';
import { recordShare } from '../lib/engagement';
import { 
  isNotificationSupported, 
  canShowNotifications, 
  requestNotificationPermission, 
  showTestNotification,
  isNotificationDenied,
  getNotificationPermission
} from '../lib/notifications';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { iconSizes, cardPadding, rowSpacing, separatorMargin, cardRadius, cardElevation, focusRing } from '../lib/uiPolish';

export default function ProfileTab() {
  const { language } = usePreferences();
  const { isAuthenticated, isPremium, dailyNotificationsEnabled, updateUserState } = useAppUser();
  const { profile: getProfile, saveProfile, isLoading: profileLoading, isSaving, isFetched } = useUserProfile();
  const { data: myStories, isLoading: storiesLoading } = useMyStories();
  const navigate = useNavigate();
  const engagement = getEngagementData();

  const [currentProfile, setCurrentProfile] = useState<{ name: string; image?: string }>({ name: 'Guest' });
  const [editedName, setEditedName] = useState('');
  const [editedImage, setEditedImage] = useState<string | File | undefined>();
  const [imageUrl, setImageUrl] = useState('');
  const [nameError, setNameError] = useState('');
  const [imageError, setImageError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(dailyNotificationsEnabled);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Load current profile
  useEffect(() => {
    getProfile().then(profile => {
      setCurrentProfile(profile);
      setEditedName(profile.name);
      if (profile.image) {
        setEditedImage(profile.image);
      }
    });
  }, [getProfile, isFetched]);

  // Sync notifications state with permission
  useEffect(() => {
    const permission = getNotificationPermission();
    if (permission === 'denied') {
      setNotificationsEnabled(false);
    } else {
      setNotificationsEnabled(dailyNotificationsEnabled && permission === 'granted');
    }
  }, [dailyNotificationsEnabled]);

  const handleNameChange = (value: string) => {
    setEditedName(value);
    const validation = validateUsername(value);
    setNameError(validation.valid ? '' : validation.error || '');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setImageError(validation.error || '');
      toast.error(validation.error);
      return;
    }

    setImageError('');
    setEditedImage(file);
  };

  const handleUrlSubmit = () => {
    if (!imageUrl.trim()) {
      setImageError('Please enter a URL');
      return;
    }

    const validation = validateImageUrl(imageUrl);
    if (!validation.valid) {
      setImageError(validation.error || '');
      toast.error(validation.error);
      return;
    }

    setImageError('');
    setEditedImage(imageUrl);
    setImageUrl('');
  };

  const handleSave = async () => {
    const validation = validateUsername(editedName);
    if (!validation.valid) {
      setNameError(validation.error || '');
      toast.error(validation.error);
      return;
    }

    try {
      await saveProfile({
        name: editedName,
        image: editedImage,
      });
      
      toast.success('Profile updated successfully!');
      
      const updated = await getProfile();
      setCurrentProfile(updated);
    } catch (error: any) {
      console.error('Failed to save profile:', error);
      toast.error('Failed to save profile. Please try again.');
    }
  };

  const handleCancelSubscription = () => {
    updateUserState({ isPremium: false });
    setShowCancelDialog(false);
    toast.success('Subscription cancelled. You are now on the free plan.');
  };

  const handleShareApp = async () => {
    if (isSharing) return;
    
    setIsSharing(true);
    try {
      const result: ShareResult = await shareApp();
      
      if (result === 'success') {
        const data = recordShare();
        if (data.bonusStoriesUnlocked > 0) {
          toast.success('Thanks for sharing! Bonus story unlocked 🎉');
        } else {
          toast.success('Thanks for sharing!');
        }
      } else if (result === 'cancelled') {
        // User cancelled, no message needed
      } else {
        toast.error('Failed to share. Please try again.');
      }
    } catch (error) {
      console.error('Share error:', error);
      toast.error('Failed to share. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyLink = async () => {
    const url = getAppUrl();
    const success = await copyToClipboard(url);
    if (success) {
      toast.success('Link copied to clipboard!');
    } else {
      toast.error('Failed to copy link. Please try again.');
    }
  };

  const handleNotificationToggle = async (enabled: boolean) => {
    if (!isNotificationSupported()) {
      toast.error('Notifications are not supported in your browser.');
      return;
    }

    if (enabled) {
      const currentPermission = getNotificationPermission();
      
      if (currentPermission === 'denied') {
        toast.error('Notification permission denied. Please enable notifications in your browser settings.');
        return;
      }

      if (currentPermission !== 'granted') {
        const permission = await requestNotificationPermission();
        
        if (permission === 'granted') {
          const shown = showTestNotification();
          if (shown) {
            setNotificationsEnabled(true);
            updateUserState({ dailyNotificationsEnabled: true });
            toast.success('Daily notifications enabled!');
          } else {
            toast.error('Failed to show notification.');
          }
        } else if (permission === 'denied') {
          toast.error('Notification permission denied. Please enable notifications in your browser settings.');
        } else {
          toast.info('Notification permission not granted.');
        }
      } else {
        showTestNotification();
        setNotificationsEnabled(true);
        updateUserState({ dailyNotificationsEnabled: true });
        toast.success('Daily notifications enabled!');
      }
    } else {
      setNotificationsEnabled(false);
      updateUserState({ dailyNotificationsEnabled: false });
      toast.info('Daily notifications disabled.');
    }
  };

  const hasChanges = editedName !== currentProfile.name || editedImage !== currentProfile.image;
  const canSave = hasChanges && !nameError && !isSaving;

  const getPreviewUrl = (): string | undefined => {
    if (!editedImage) return currentProfile.image;
    if (typeof editedImage === 'string') return editedImage;
    return URL.createObjectURL(editedImage);
  };

  const notificationSupported = isNotificationSupported();
  const notificationDenied = isNotificationDenied();
  const notificationPermission = getNotificationPermission();
  const hasWebShareApi = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('profile', language)}</h1>
        <LoginButton />
      </div>

      {/* Profile Edit Section */}
      <div className={`bg-card ${cardRadius.medium} ${cardPadding.default} ${rowSpacing.default} border ${cardElevation.low}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <UserAvatar 
              imageUrl={getPreviewUrl()} 
              name={editedName}
              size="large"
              isLoading={isSaving}
            />
            {isPremium && (
              <div className="absolute -top-1 -right-1">
                <PremiumBadge variant="icon-only" />
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg">{currentProfile.name}</span>
            {isPremium && <PremiumBadge variant="compact" />}
          </div>
          
          <div className="w-full max-w-md space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={editedName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter your username"
                className={focusRing}
              />
              {nameError && <p className="text-xs text-destructive">{nameError}</p>}
            </div>

            <div className="space-y-2">
              <Label>Profile Picture</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex-1 ${focusRing}`}
                >
                  <Upload className={`${iconSizes.sm} mr-2`} />
                  Upload
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Or paste image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className={`flex-1 ${focusRing}`}
                />
                <Button variant="outline" size="sm" onClick={handleUrlSubmit} className={focusRing}>
                  Add
                </Button>
              </div>
              {imageError && <p className="text-xs text-destructive">{imageError}</p>}
            </div>

            <Button
              onClick={handleSave}
              disabled={!canSave}
              className={`w-full ${focusRing}`}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      {/* My Stories Section */}
      {isAuthenticated && (
        <>
          <Separator className={separatorMargin.default} />
          <div className={`bg-card ${cardRadius.medium} ${cardPadding.default} border ${cardElevation.low} space-y-4`}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">My Stories</h2>
              <Button
                onClick={() => navigate({ to: '/story/editor/$storyId', params: { storyId: 'new' } })}
                size="sm"
                className={focusRing}
              >
                <Plus className={`${iconSizes.sm} mr-2`} />
                Create Story
              </Button>
            </div>
            
            {storiesLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading your stories...
              </div>
            ) : myStories && myStories.length > 0 ? (
              <div className="space-y-3">
                {myStories.map((story) => (
                  <MyStoryCard key={story.id.toString()} story={story} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 space-y-3">
                <p className="text-muted-foreground">You haven't created any stories yet.</p>
                <p className="text-sm text-muted-foreground">
                  Share your creativity with the world!
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {!isAuthenticated && (
        <>
          <Separator className={separatorMargin.default} />
          <div className={`bg-card ${cardRadius.medium} ${cardPadding.default} border ${cardElevation.low} text-center space-y-4`}>
            <Upload className={`${iconSizes.lg} mx-auto text-muted-foreground`} />
            <div>
              <h3 className="font-semibold mb-2">Create Your Own Stories</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Login to start writing and sharing your stories with the community.
              </p>
            </div>
            <LoginButton />
          </div>
        </>
      )}

      {/* Premium Status Section */}
      <Separator className={separatorMargin.default} />
      <div className={`bg-card ${cardRadius.medium} ${cardPadding.default} ${rowSpacing.default} border ${cardElevation.low}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Premium Status</h2>
          {isPremium && <PremiumBadge />}
        </div>
        
        {isPremium ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
              <Crown className={`${iconSizes.md} text-yellow-600 dark:text-yellow-500`} />
              <div className="flex-1">
                <p className="font-medium">Premium Active</p>
                <p className="text-xs text-muted-foreground">Enjoying ad-free experience</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(true)}
              className={`w-full ${focusRing}`}
            >
              Cancel Subscription
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Upgrade to Premium for an ad-free experience and exclusive content.
            </p>
            <Button
              onClick={() => navigate({ to: '/premium' })}
              className={`w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 ${focusRing}`}
            >
              <Crown className={`${iconSizes.sm} mr-2`} />
              Go Premium
            </Button>
          </div>
        )}
      </div>

      {/* Engagement Stats */}
      <Separator className={separatorMargin.default} />
      <div className={`bg-card ${cardRadius.medium} ${cardPadding.default} border ${cardElevation.low}`}>
        <h2 className="text-lg font-semibold mb-4">Your Stats</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Flame className={`${iconSizes.md} text-orange-500`} />
            </div>
            <p className="text-2xl font-bold">{engagement.streak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Award className={`${iconSizes.md} text-yellow-500`} />
            </div>
            <p className="text-2xl font-bold">{engagement.badges.length}</p>
            <p className="text-xs text-muted-foreground">Badges</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className={`${iconSizes.md} text-blue-500`} />
            </div>
            <p className="text-2xl font-bold">{engagement.challengeProgress}%</p>
            <p className="text-xs text-muted-foreground">Challenge</p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <Separator className={separatorMargin.default} />
      <div className={`bg-card ${cardRadius.medium} ${cardPadding.default} border ${cardElevation.low}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {notificationsEnabled ? (
              <Bell className={iconSizes.md} />
            ) : (
              <BellOff className={`${iconSizes.md} text-muted-foreground`} />
            )}
            <div>
              <h3 className="font-semibold">Daily Story Notifications</h3>
              <p className="text-xs text-muted-foreground">Get notified about new stories</p>
            </div>
          </div>
          <Switch
            checked={notificationsEnabled}
            onCheckedChange={handleNotificationToggle}
            disabled={!notificationSupported}
          />
        </div>
        
        {notificationDenied && (
          <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
            <AlertCircle className={`${iconSizes.sm} text-destructive shrink-0 mt-0.5`} />
            <p className="text-xs text-destructive">
              Notifications are blocked. Please enable them in your browser settings.
            </p>
          </div>
        )}
      </div>

      {/* Share App */}
      <Separator className={separatorMargin.default} />
      <div className={`bg-card ${cardRadius.medium} ${cardPadding.default} border ${cardElevation.low}`}>
        <h2 className="text-lg font-semibold mb-4">Share Global Tales Universe</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Help others discover amazing stories. Share with friends and family!
        </p>
        <div className="flex gap-2">
          {hasWebShareApi ? (
            <Button
              onClick={handleShareApp}
              disabled={isSharing}
              className={`flex-1 ${focusRing}`}
            >
              <Share2 className={`${iconSizes.sm} mr-2`} />
              {isSharing ? 'Sharing...' : 'Share App'}
            </Button>
          ) : (
            <Button
              onClick={handleCopyLink}
              className={`flex-1 ${focusRing}`}
            >
              <Copy className={`${iconSizes.sm} mr-2`} />
              Copy Link
            </Button>
          )}
        </div>
      </div>

      {/* Legal Links */}
      <Separator className={separatorMargin.default} />
      <div className={`bg-card ${cardRadius.medium} ${cardPadding.default} border ${cardElevation.low} space-y-2`}>
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/privacy-policy' })}
          className={`w-full justify-between ${focusRing}`}
        >
          Privacy Policy
          <ExternalLink className={iconSizes.sm} />
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/terms-and-conditions' })}
          className={`w-full justify-between ${focusRing}`}
        >
          Terms & Conditions
          <ExternalLink className={iconSizes.sm} />
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/help-and-support' })}
          className={`w-full justify-between ${focusRing}`}
        >
          Help & Support
          <ExternalLink className={iconSizes.sm} />
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/about-us' })}
          className={`w-full justify-between ${focusRing}`}
        >
          About Us
          <ExternalLink className={iconSizes.sm} />
        </Button>
      </div>

      {/* Cancel Subscription Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Premium Subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              You will lose access to ad-free reading and premium stories. You can resubscribe anytime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Premium</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelSubscription}>
              Cancel Subscription
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  );
}
