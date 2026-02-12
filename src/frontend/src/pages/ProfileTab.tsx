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
import { Flame, Award, Target, Upload, Link as LinkIcon, Crown, Share2, Bell, BellOff, AlertCircle, Copy } from 'lucide-react';
import { Separator } from '../components/ui/separator';
import { Switch } from '../components/ui/switch';
import { useState, useEffect, useRef } from 'react';
import { validateUsername, validateImageFile, validateImageUrl } from '../lib/profileValidation';
import { toast } from 'sonner';
import { shareApp, getAppUrl } from '../lib/share';
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

  // Sync notifications state
  useEffect(() => {
    setNotificationsEnabled(dailyNotificationsEnabled);
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
      
      toast.success('Profile updated!');
      
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
    setIsSharing(true);
    try {
      const success = await shareApp();
      if (success) {
        const data = recordShare();
        if (data.bonusStoriesUnlocked > 0) {
          toast.success('Bonus story unlocked! 🎉');
        } else {
          toast.success('Thanks for sharing!');
        }
      }
    } catch (error) {
      console.error('Share error:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyLink = async () => {
    const url = getAppUrl();
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
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
        toast.error('Notification permission denied. Please enable it in your browser settings.');
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
          toast.error('Notification permission denied. Please enable it in your browser settings.');
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
      <div className="bg-card rounded-xl p-6 space-y-6 border shadow-sm">
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
              
              <div className="space-y-3">
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image (JPG/PNG, max 2MB)
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">OR</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <div className="flex gap-2">
                  <Input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Enter image URL"
                    onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleUrlSubmit}
                  >
                    <LinkIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {imageError && (
                <p className="text-sm text-destructive">{imageError}</p>
              )}
            </div>

            <Button
              onClick={handleSave}
              disabled={!canSave}
              className="w-full"
            >
              {isSaving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </div>
      </div>

      {/* Premium Status Section */}
      {isPremium && (
        <div className="bg-card rounded-xl p-6 border shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="w-6 h-6 text-yellow-500" />
              <div>
                <h3 className="font-semibold">Premium Active</h3>
                <p className="text-sm text-muted-foreground">Enjoying all premium benefits</p>
              </div>
            </div>
            <PremiumBadge variant="compact" />
          </div>
          
          <Separator />
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span>No ads • Ad-free experience</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span>Unlimited premium stories</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span>Exclusive content access</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => setShowCancelDialog(true)}
          >
            Cancel Subscription
          </Button>
        </div>
      )}

      {/* Engagement Stats */}
      <div className="bg-card rounded-xl p-6 space-y-4 border shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Flame className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-2xl font-bold">{engagement.streak}</p>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </div>
          </div>
          {!isPremium && (
            <Button variant="outline" onClick={() => navigate({ to: '/premium' })}>
              <Crown className="w-4 h-4 mr-2" />
              {t('goPremium', language)}
            </Button>
          )}
        </div>

        {engagement.badges.length > 0 && (
          <>
            <Separator />
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Achievements</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {engagement.badges.map((badge) => (
                  <Badge key={badge} variant="secondary">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator />

        <div className="flex items-center gap-3">
          <Target className="w-5 h-5 text-primary" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Reading Challenge</span>
              <span className="text-sm text-muted-foreground">
                {engagement.challengeProgress}/10
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${(engagement.challengeProgress / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-card rounded-xl p-6 border shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {notificationsEnabled ? (
              <Bell className="w-5 h-5 text-primary" />
            ) : (
              <BellOff className="w-5 h-5 text-muted-foreground" />
            )}
            <div>
              <h3 className="font-semibold">Daily Story Notifications</h3>
              <p className="text-sm text-muted-foreground">
                {!notificationSupported 
                  ? 'Not supported in your browser'
                  : notificationDenied
                  ? 'Permission denied'
                  : notificationPermission === 'granted'
                  ? 'Get notified about new stories'
                  : 'Enable to receive daily updates'}
              </p>
            </div>
          </div>
          <Switch
            checked={notificationsEnabled}
            onCheckedChange={handleNotificationToggle}
            disabled={!notificationSupported || notificationDenied}
          />
        </div>

        {notificationDenied && (
          <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
            <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Notification permission was denied. To enable notifications, please update your browser settings and allow notifications for this site.
            </p>
          </div>
        )}
      </div>

      {/* Share Section */}
      <div className="bg-card rounded-xl p-6 border shadow-sm space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Share2 className="w-5 h-5 text-primary" />
          <div>
            <h3 className="font-semibold">Invite Friends</h3>
            <p className="text-sm text-muted-foreground">Share the app and unlock bonus stories</p>
          </div>
        </div>

        <div className="flex gap-2">
          {hasWebShareApi ? (
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleShareApp}
              disabled={isSharing}
            >
              <Share2 className="w-4 h-4 mr-2" />
              {isSharing ? 'Sharing...' : 'Share App'}
            </Button>
          ) : (
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleCopyLink}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
          )}
        </div>

        {engagement.sharesCount > 0 && (
          <p className="text-xs text-center text-muted-foreground">
            You've shared {engagement.sharesCount} time{engagement.sharesCount !== 1 ? 's' : ''} • 
            {engagement.bonusStoriesUnlocked > 0 && ` ${engagement.bonusStoriesUnlocked} bonus ${engagement.bonusStoriesUnlocked === 1 ? 'story' : 'stories'} unlocked!`}
          </p>
        )}
      </div>

      {/* Cancel Subscription Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Premium Subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              You will lose access to all premium features including ad-free experience, unlimited premium stories, and exclusive content. You can resubscribe anytime.
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
    </div>
  );
}
