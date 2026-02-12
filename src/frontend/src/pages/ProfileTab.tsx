import { usePreferences } from '../context/PreferencesContext';
import { useAppUser } from '../hooks/useAppUser';
import { useUserProfile } from '../hooks/useUserProfile';
import { t } from '../lib/i18n';
import LoginButton from '../components/LoginButton';
import UserAvatar from '../components/UserAvatar';
import PremiumBadge from '../components/PremiumBadge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useNavigate } from '@tanstack/react-router';
import { getEngagementData } from '../lib/engagement';
import { Badge } from '../components/ui/badge';
import { Flame, Award, Target, Upload, Crown, Share2, Bell, BellOff, AlertCircle, Copy, ExternalLink } from 'lucide-react';
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
import { iconSizes, cardPadding, rowSpacing, separatorMargin } from '../lib/uiPolish';

export default function ProfileTab() {
  const { language } = usePreferences();
  const { isAuthenticated, isPremium, dailyNotificationsEnabled, updateUserState } = useAppUser();
  const { profile: getProfile, saveProfile, isLoading: profileLoading, isSaving, isFetched } = useUserProfile();
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
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('profile', language)}</h1>
        <LoginButton />
      </div>

      {/* Profile Edit Section */}
      <div className={`bg-card rounded-xl ${cardPadding.default} space-y-6 border shadow-sm`}>
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
                className={nameError ? 'border-destructive' : ''}
              />
              {nameError && (
                <p className="text-sm text-destructive">{nameError}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Profile Picture</Label>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                  disabled={isSaving}
                >
                  <Upload className={`${iconSizes.sm} mr-2`} />
                  Upload Image
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
                  disabled={isSaving}
                />
                <Button
                  variant="outline"
                  onClick={handleUrlSubmit}
                  disabled={!imageUrl.trim() || isSaving}
                >
                  Add
                </Button>
              </div>

              {imageError && (
                <p className="text-sm text-destructive">{imageError}</p>
              )}
              <p className="text-xs text-muted-foreground">
                JPG or PNG, max 2MB
              </p>
            </div>

            <Button
              onClick={handleSave}
              disabled={!canSave}
              className="w-full"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      {/* Engagement Stats */}
      <div className={`bg-card rounded-xl ${cardPadding.default} border shadow-sm`}>
        <h3 className="font-semibold text-lg mb-4">Your Stats</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Flame className={`${iconSizes.lg} text-orange-500`} />
            </div>
            <p className="text-2xl font-bold">{engagement.streak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Award className={`${iconSizes.lg} text-yellow-500`} />
            </div>
            <p className="text-2xl font-bold">{engagement.badges.length}</p>
            <p className="text-xs text-muted-foreground">Badges</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className={`${iconSizes.lg} text-blue-500`} />
            </div>
            <p className="text-2xl font-bold">{engagement.challengeProgress}%</p>
            <p className="text-xs text-muted-foreground">Challenge</p>
          </div>
        </div>
      </div>

      <Separator className={separatorMargin.default} />

      {/* Premium Section */}
      <div className={`bg-card rounded-xl ${cardPadding.default} border shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Premium Status</h3>
          {isPremium && <PremiumBadge variant="compact" />}
        </div>
        
        {isPremium ? (
          <div className={rowSpacing.default}>
            <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <Crown className={`${iconSizes.md} text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5`} />
              <div className="flex-1">
                <p className="font-medium text-yellow-900 dark:text-yellow-100">Premium Active</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">Enjoy ad-free reading and unlimited premium stories</p>
              </div>
            </div>
            
            <div className={`${rowSpacing.default} text-sm`}>
              <div className="flex items-center gap-2">
                <div className={`${iconSizes.sm} rounded-full bg-green-500 flex items-center justify-center shrink-0`}>
                  <span className="text-white text-xs">✓</span>
                </div>
                <span>Ad-free reading experience</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`${iconSizes.sm} rounded-full bg-green-500 flex items-center justify-center shrink-0`}>
                  <span className="text-white text-xs">✓</span>
                </div>
                <span>Unlimited premium stories</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`${iconSizes.sm} rounded-full bg-green-500 flex items-center justify-center shrink-0`}>
                  <span className="text-white text-xs">✓</span>
                </div>
                <span>Exclusive content access</span>
              </div>
            </div>

            <Button
              variant="destructive"
              onClick={() => setShowCancelDialog(true)}
              className="w-full"
            >
              Cancel Subscription
            </Button>
          </div>
        ) : (
          <div className={rowSpacing.default}>
            <p className="text-sm text-muted-foreground">
              Upgrade to Premium for ad-free reading and unlimited access to exclusive stories.
            </p>
            <Button
              onClick={() => navigate({ to: '/premium' })}
              className="w-full"
            >
              <Crown className={`${iconSizes.sm} mr-2`} />
              Go Premium
            </Button>
          </div>
        )}
      </div>

      <Separator className={separatorMargin.default} />

      {/* Share App Section */}
      <div className={`bg-card rounded-xl ${cardPadding.default} border shadow-sm`}>
        <div className="flex items-center gap-3 mb-4">
          <Share2 className={iconSizes.md} />
          <h3 className="font-semibold text-lg">Share GTU</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Share GTU with friends and unlock bonus stories!
        </p>
        <div className="flex gap-2">
          {hasWebShareApi ? (
            <Button
              onClick={handleShareApp}
              disabled={isSharing}
              className="flex-1"
            >
              <Share2 className={`${iconSizes.sm} mr-2`} />
              {isSharing ? 'Sharing...' : 'Share App'}
            </Button>
          ) : (
            <Button
              onClick={handleCopyLink}
              className="flex-1"
            >
              <Copy className={`${iconSizes.sm} mr-2`} />
              Copy Link
            </Button>
          )}
        </div>
        {!hasWebShareApi && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Web Share API not available. Use copy link instead.
          </p>
        )}
      </div>

      <Separator className={separatorMargin.default} />

      {/* Notifications Section */}
      <div className={`bg-card rounded-xl ${cardPadding.default} border shadow-sm`}>
        <div className="flex items-center gap-3 mb-4">
          {notificationsEnabled ? (
            <Bell className={iconSizes.md} />
          ) : (
            <BellOff className={iconSizes.md} />
          )}
          <h3 className="font-semibold text-lg">Daily Notifications</h3>
        </div>
        
        {!notificationSupported ? (
          <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
            <AlertCircle className={`${iconSizes.md} text-muted-foreground shrink-0 mt-0.5`} />
            <p className="text-sm text-muted-foreground">
              Notifications are not supported in your browser.
            </p>
          </div>
        ) : notificationDenied ? (
          <div className={rowSpacing.default}>
            <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <AlertCircle className={`${iconSizes.md} text-destructive shrink-0 mt-0.5`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive mb-1">Permission Denied</p>
                <p className="text-sm text-muted-foreground">
                  Notifications are blocked. To enable them, please allow notifications in your browser settings.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                toast.info('Please enable notifications in your browser settings, then refresh the page.');
              }}
              className="w-full"
            >
              <ExternalLink className={`${iconSizes.sm} mr-2`} />
              How to Enable
            </Button>
          </div>
        ) : (
          <div className={rowSpacing.default}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">Get notified about new stories</p>
                <p className="text-sm text-muted-foreground">
                  Receive a daily notification when new stories are available
                </p>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={handleNotificationToggle}
              />
            </div>
            {notificationPermission === 'default' && (
              <p className="text-xs text-muted-foreground">
                You will be asked for permission when enabling notifications.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Cancel Subscription Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Premium Subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              You will lose access to premium features including ad-free reading and exclusive stories. You can resubscribe anytime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Premium</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelSubscription} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Cancel Subscription
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
